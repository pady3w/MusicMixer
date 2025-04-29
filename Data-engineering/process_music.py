import os
import json
import subprocess
import shutil

# Base directory (Set to Capstone folder in Windows)
base_dir = "/mnt/c/Documents/Capstone/"

# Directories inside Capstone
download_dir = os.path.join(base_dir, "downloads/")
processed_dir = os.path.join(base_dir, "processed_data/")
separated_dir = os.path.join(base_dir, "separated_audio/")
metadata_file = os.path.join(base_dir, "metadata.json")
s3_bucket = "our-bucket"

# Create directories if they don't exist
os.makedirs(download_dir, exist_ok=True)
os.makedirs(processed_dir, exist_ok=True)
os.makedirs(separated_dir, exist_ok=True)

# Check yt-dlp installation path
yt_dlp_path = shutil.which("yt-dlp")
if yt_dlp_path is None:
    print("yt-dlp not found! Install it with: pip install yt-dlp")
    exit(1)

def split_audio(input_file, output_dir, title, chunk_length=30):
    """Splits an audio file into 30-second chunks using FFmpeg."""
    print(f"Splitting {input_file} into {chunk_length}-second chunks...")
    
    # Define the output pattern for chunks
    output_pattern = os.path.join(output_dir, f"{title}_chunk_%03d.wav")
    
    # FFmpeg command to split the audio file
    command = [
        "ffmpeg", "-y", "-i", input_file, "-f", "segment",
        "-segment_time", str(chunk_length), "-c", "copy", output_pattern
    ]
    
    # Run the FFmpeg command
    try:
        subprocess.run(command, check=True)
        print(f"Successfully split {input_file} into chunks")
        
        # Get a list of created chunks
        chunks = [f for f in os.listdir(output_dir) if f.startswith(f"{title}_chunk_") and f.endswith(".wav")]
        return chunks
    except Exception as e:
        print(f"Error splitting audio: {e}")
        return []
    
# YouTube playlist URLs - add your playlist URLs here
playlist_urls = [
    "https://youtube.com/playlist?list=PLRweAmj1MmxoUts0Wiu_SWlfPah1sgmhL&si=j8qqsCdULlSpsH4E"
]

# Option to limit number of videos (set to None for all videos)
max_videos = None  # Set to a number to limit downloads, e.g., 10

# Function to get all video URLs from a playlist
def get_playlist_videos(playlist_url, limit=None):
    """Extract all video URLs from a YouTube playlist."""
    print(f"Extracting videos from playlist: {playlist_url}")
    
    command = f'yt-dlp --flat-playlist --get-id "{playlist_url}"'
    result = subprocess.run(command, capture_output=True, text=True, shell=True)
    
    if result.returncode != 0:
        print(f"Error extracting playlist: {result.stderr}")
        return []
        
    video_ids = result.stdout.strip().split('\n')
    
    # Apply limit if specified
    if limit and limit > 0:
        video_ids = video_ids[:limit]
        
    # Convert IDs to full URLs
    video_urls = [f"https://www.youtube.com/watch?v={video_id}" for video_id in video_ids if video_id]
    
    return video_urls

# Get all video URLs from playlists
video_urls = []
for playlist_url in playlist_urls:
    playlist_videos = get_playlist_videos(playlist_url, max_videos)
    video_urls.extend(playlist_videos)

# If no videos were found in playlists, exit the program
if not video_urls:
    print("No videos found in the specified playlists. Please check the playlist URLs.")
    exit(1)

# Load existing metadata if it exists
metadata_list = []
if os.path.exists(metadata_file):
    try:
        with open(metadata_file, "r") as f:
            metadata_list = json.load(f)
        print(f"Loaded {len(metadata_list)} existing entries from metadata.json")
    except json.JSONDecodeError:
        print("Existing metadata.json is invalid, starting fresh")

# Get list of already processed video IDs
processed_ids = set()
for entry in metadata_list:
    # Extract the base video ID (without the chunk part)
    video_id = entry.get("video_id", "")
    if "_chunk_" in video_id:
        base_id = video_id.split("_chunk_")[0]
        processed_ids.add(base_id)
    else:
        processed_ids.add(video_id)

# Process new videos
for i, url in enumerate(video_urls):
    print(f"Processing {i+1}/{len(video_urls)}: {url}")
    
    # Extract video ID to check if already processed
    try:
        command = f'yt-dlp --get-id "{url}"'
        result = subprocess.run(command, capture_output=True, text=True, shell=True, check=True)
        video_id = result.stdout.strip()
        
        # Skip if already processed
        if video_id in processed_ids:
            print(f"Skipping {url} - already processed")
            continue
            
    except subprocess.CalledProcessError as e:
        print(f"Error getting video ID for {url}: {e}")
        continue

    # Extract metadata from YouTube
    try:
        command = f'yt-dlp --get-title --get-id --get-duration "{url}"'
        result = subprocess.run(command, capture_output=True, text=True, shell=True, check=True)
        output = result.stdout.strip().split("\n")

        # Generate human-readable filenames
        title = output[0].replace(" ", "_").replace("/", "-").replace("\\", "-")
        title = ''.join(c for c in title if c.isalnum() or c in "_-")  # More thorough cleaning
        video_id = output[1]
        duration = output[2]
    except subprocess.CalledProcessError as e:
        print(f"Error fetching metadata for {url}: {e}")
        continue

    # Define filenames using song title instead of video ID
    original_audio_file = os.path.join(download_dir, f"{title}.wav")
    processed_audio_file = os.path.join(processed_dir, f"{title}.wav")
    instrumentals_file = os.path.join(separated_dir, f"{title}_instrumentals.wav")

    # Download and extract audio
    print(f"Downloading audio for: {title}")
    try:
        subprocess.run(f'yt-dlp -x --audio-format wav --audio-quality 0 -o "{original_audio_file}" "{url}"',
                       shell=True, check=True)
    except Exception as e:
        print(f"Error downloading audio for {title}: {e}")
        continue

    # Convert to 16kHz mono WAV for MusicGen
    print(f"Converting {title} to 16kHz mono...")
    try:
        subprocess.run(f'ffmpeg -y -i "{original_audio_file}" -ar 16000 -ac 1 "{processed_audio_file}"',
                       shell=True, check=True)
    except Exception as e:
        print(f"Error converting {title}: {e}")
        continue

    # Run Demucs to separate vocals (which also produces instrumentals)
    print(f"Extracting instrumentals for {title}...")
    try:
        subprocess.run(f'demucs -d cuda --two-stems=vocals "{processed_audio_file}"',
                       shell=True, check=True)
    except Exception as e:
        print(f"Error running Demucs for {title}: {e}")
        continue

    # Define Demucs output directory
    demucs_output_dir = os.path.join(base_dir, f"separated/htdemucs/{title}/")

    if os.path.exists(demucs_output_dir):
        if os.path.exists(os.path.join(demucs_output_dir, "no_vocals.wav")):
            os.rename(os.path.join(demucs_output_dir, "no_vocals.wav"), instrumentals_file)
        else:
            print(f"Instrumental file not found for {title} in {demucs_output_dir}")
            continue  # Skip to next song if instrumental file is missing

    # Split the instrumental into 30-second chunks directly in the separated_audio directory
    chunk_filenames = split_audio(instrumentals_file, separated_dir, title)
    
    if not chunk_filenames:
        print(f"No chunks were created for {title}")
        continue
    
    print(f"Created {len(chunk_filenames)} chunks for {title}")
    
    
    
    # Create metadata entries for each chunk only (don't store full song in metadata)
    for chunk_filename in chunk_filenames:
        # Extract chunk number from filename
        chunk_num = chunk_filename.split("_chunk_")[1].split(".")[0]
        
        # Create metadata entry for this chunk
        chunk_metadata = {
            "title": f"{title}_chunk_{chunk_num}",
            "video_id": f"{video_id}_chunk_{chunk_num}",
            "duration": "30",  # Approximately 30 seconds per chunk
            "instrumentals_file": f"s3://{s3_bucket}/xxxx/{chunk_filename}",
            "metadata_file": f"s3://{s3_bucket}/xxxxx/{title}_chunk_{chunk_num}.json",
            "self_wav": f"s3://{s3_bucket}/xxxx/{chunk_filename}"
        }
        
        metadata_list.append(chunk_metadata)
    
    # Delete the full song instrumental file after creating chunks to save space
    try:
        os.remove(instrumentals_file)
        print(f"Removed full instrumental file to save space")
    except Exception as e:
        print(f"Could not remove full instrumental file: {e}")
    
    # Update metadata file after each successful download
    with open(metadata_file, "w") as f:
        json.dump(metadata_list, f, indent=4)
    
    print(f"Processed {title} into {len(chunk_filenames)} chunks and updated metadata")

print(f"Final metadata saved to {metadata_file}")
print("🎼 Audio processing & chunk extraction completed!")
print(f"Total entries in metadata: {len(metadata_list)}")