import os
import json
import re
import essentia.standard as es

# Base directory
base_dir = "/mnt/c/Documents/Capstone/"
metadata_file = os.path.join(base_dir, "metadata.json")

# Separated audio directory
separated_audio_dir = os.path.join(base_dir, "separated_audio/")

# BPM-based Genre Classification
def get_genre_from_bpm(bpm, scale):
    """Determine genre based on BPM ranges and scale."""
    if 130 <= bpm <= 160:
        return "Trap"  # Modern trap/hip-hop
    elif 85 <= bpm <= 110:
        return "Hip-Hop"  # Classic/Golden era hip-hop
    elif 60 <= bpm <= 80:
        if scale.lower() == "minor":
            return "R&B"
        else:
            return "Soul"
    elif 110 <= bpm <= 130:
        return "Hip-House"  # Hip-hop with house influences
    elif bpm > 160:
        return "Electronic"
    elif bpm < 60:
        return "Downtempo"
    
    # Default for Kendrick
    return "Alternative"

# Genre-based Mood Mapping - Keep your existing mapping
GENRE_TO_MOOD = {
    "Rock": ["energetic", "rebellious"],
    "Pop": ["uplifting", "emotional"],
    "Jazz": ["relaxed", "sophisticated"],
    "Classical": ["peaceful", "grand"],
    "Electronic": ["intense", "hypnotic"],
    "Hip-Hop": ["confident", "rhythmic"],
    "Trap": ["aggressive", "dark"],
    "R&B": ["smooth", "emotional"],
    "Soul": ["soulful", "groovy"],
    "Hip-House": ["energetic", "bouncy"],
    "Blues": ["melancholic", "soulful"],
    "Downtempo": ["relaxed", "atmospheric"]
}

# Instruments based on Genre
def get_instruments_for_genre(genre):
    """Get typical instruments for a genre."""
    instruments = {
        "Hip-Hop": ["drums", "808 bass", "sampler", "synth"],
        "Trap": ["808 bass", "hi-hats", "synthesizer", "sampler"],
        "R&B": ["drums", "bass", "piano", "synth pads"],
        "Soul": ["drums", "bass", "piano", "electric guitar"],
        "Hip-House": ["drum machine", "synthesizer", "sampler", "bass"],
        "Electronic": ["synthesizer", "drum machine", "sampler", "effects"],
        "Downtempo": ["synth pads", "drum machine", "samples", "bass"]
    }
    return instruments.get(genre, ["synthesizer", "drums", "bass"])

def extract_artist_from_title(title):
    """Extract artist name from title with improved pattern matching."""
    # Try multiple patterns
    
    # Pattern 1: "Artist_-_Title" (most common)
    pattern1 = r"^([^_-]+)_-_(.+)"
    match = re.match(pattern1, title)
    if match:
        artist = match.group(1).replace("_", " ")
        return artist
    
    # Pattern 2: "Artist-Title" (no underscore)
    pattern2 = r"^([^-]+)-(.+)"
    match = re.match(pattern2, title)
    if match:
        artist = match.group(1).strip().replace("_", " ")
        return artist
    
    # Pattern 3: "Title_by_Artist"
    pattern3 = r"(.+)_by_([^_]+)$"
    match = re.match(pattern3, title)
    if match:
        artist = match.group(2).replace("_", " ")
        return artist
    
    # Pattern 4: Just take the first part up to first underscore
    parts = title.split("_", 1)
    if len(parts) > 1:
        return parts[0].replace("_", " ")
    
    return "Unknown Artist"

# BPM-based Mood Mapping - Keep your existing function
def get_bpm_mood(bpm):
    """Infer mood based on BPM."""
    if bpm > 140:
        return ["fast-paced", "intense"]
    elif bpm > 120:
        return ["energetic", "happy"]
    elif bpm > 90:
        return ["relaxed", "chill"]
    else:
        return ["slow", "melancholic"]

# Spectral Centroid-based Mood Mapping - Keep your existing function
def get_spectral_mood(spectral_centroid):
    """Infer brightness and energy of a track."""
    if spectral_centroid > 5000:
        return ["bright", "energetic"]
    elif spectral_centroid > 3000:
        return ["balanced", "dynamic"]
    else:
        return ["dark", "mellow"]

def analyze_audio(audio_file):
    """Extracts relevant features using Essentia."""
    # Keep your existing function as is
    try:
        # Load audio
        loader = es.MonoLoader(filename=audio_file)()
        audio = loader

        # Extract basic features
        duration = es.Duration()(audio)

        # Extract rhythm features
        try:
            rhythm_extractor = es.RhythmExtractor2013()
            rhythm_features = rhythm_extractor(audio)
            bpm = rhythm_features[0]  # BPM estimation
        except Exception as re:
            print(f"Rhythm extraction failed for {audio_file}: {re}")
            bpm = 0.0

        # Extract key and scale
        try:
            key_extractor = es.KeyExtractor()
            key_features = key_extractor(audio)
            key = key_features[0]  # Key (e.g., 'C#')
            scale = key_features[1]  # Scale (e.g., 'major')
        except Exception as ke:
            print(f"Key extraction failed for {audio_file}: {ke}")
            key = "unknown"
            scale = "unknown"

        # Extract spectral features
        try:
            spectral_features = es.SpectralCentroidTime()(audio)
            spectral_centroid = float(spectral_features.mean())
        except Exception as se:
            print(f"Spectral analysis failed for {audio_file}: {se}")
            spectral_centroid = 0.0

        return {
            "duration": float(duration),
            "bpm": float(bpm),
            "key": key,
            "scale": scale,
            "spectral_centroid": spectral_centroid
        }
    except Exception as e: ##These are our defualts in the event a song cannot analyzed
        print(f"Error analyzing {audio_file}: {e}")
        return {
            "duration": 0.0,
            "bpm": 0.0,
            "key": "unknown",
            "scale": "unknown",
            "spectral_centroid": 0.0
        }

def generate_moods(entry, audio_metadata):
    """Generate moods based on genre, BPM, and spectral features."""
    moods = []

    genre = entry.get("genre", "unknown")
    bpm = audio_metadata.get("bpm", 0)
    spectral_centroid = audio_metadata.get("spectral_centroid", 0)

    if genre in GENRE_TO_MOOD:
        moods.extend(GENRE_TO_MOOD[genre])

    moods.extend(get_bpm_mood(bpm))
    moods.extend(get_spectral_mood(spectral_centroid))

    return list(set(moods))  # Remove duplicates

def generate_keywords(entry, audio_metadata):
    """Generate keywords based on extracted metadata."""
    keywords = []

    # Add genre
    if entry.get("genre", "").lower() != "unknown":
        keywords.append(entry["genre"].lower())

    # Add instruments
    for instrument in entry.get("instruments", []):
        keywords.append(instrument.lower())

    # Add tempo description
    bpm = audio_metadata.get("bpm", 0)
    if bpm > 120:
        keywords.append("fast tempo")
    elif bpm < 80:
        keywords.append("slow tempo")
    else:
        keywords.append("mid-tempo")
        
    # Add key if available
    if entry.get("key", "").lower() != "unknown":
        keywords.append(f"{entry['key']} {entry.get('scale', '')}")

    return keywords

def generate_enhanced_prompt(entry, audio_metadata):
    """Generate a concise text prompt for MusicGen training."""
    # Get basic elements
    genre = entry.get("genre", "unknown")
    
    # Format instruments (limit to 2)
    instruments = entry.get("instruments", [])
    if len(instruments) >= 2:
        instrument_text = f"{instruments[0]} and {instruments[1]}"
    else:
        instrument_text = instruments[0] if instruments else ""
    
    # Round BPM to nearest integer
    bpm = audio_metadata.get("bpm", 0)
    bpm_text = f"{int(round(bpm))}" if bpm else ""
    
    # Get key and scale
    key = audio_metadata.get("key", "")
    scale = audio_metadata.get("scale", "")
    key_text = f"{key} {scale}" if key != "unknown" else ""
    
    # Get most important moods (limit to 5)
    moods = entry.get("moods", [])
    mood_text = ", ".join(moods[:5]) if moods else ""
    
    # Create concise prompt
    prompt = f"{genre} instrumental with {instrument_text}, {bpm_text} BPM, {key_text}. {mood_text}."
    
    # Clean up any double spaces or punctuation issues
    prompt = prompt.replace("  ", " ").replace(" ,", ",").replace(",,", ",")
    prompt = prompt.replace(" .", ".").replace("..", ".")
    
    return prompt

def prepare_enhanced_metadata():
    """Reads metadata.json, adds enhanced audio analysis results, and updates the file."""
    
    if not os.path.exists(metadata_file):
        print("Metadata file not found! Run the download script first.")
        return
    
    with open(metadata_file, "r") as f:
        metadata_list = json.load(f)

    print(f"Found {len(metadata_list)} entries in metadata file")
    updated_count = 0

    for entry in metadata_list:
        print(f"Enhancing metadata for: {entry['title']}")

        # Extract artist name
        artist = extract_artist_from_title(entry['title'])
        entry["artist"] = artist
        
        # Get the chunk file path from self_wav
        if "self_wav" in entry:
            # Extract filename from S3 path
            filename = entry["self_wav"].split('/')[-1]
            instrumentals_file = os.path.join(separated_audio_dir, filename)
        else:
            print(f"Skipping {entry['title']}: Missing self_wav path")
            continue
        
        if not os.path.exists(instrumentals_file):
            print(f"Skipping {entry['title']}: File not found at {instrumentals_file}")
            continue

        # Extract audio features if not already present
        if "bpm" not in entry or entry["bpm"] == 0:
            audio_metadata = analyze_audio(instrumentals_file)
            entry.update(audio_metadata)
        else:
            # Use existing audio metadata
            audio_metadata = {
                "bpm": entry.get("bpm", 0),
                "key": entry.get("key", "unknown"),
                "scale": entry.get("scale", "unknown"),
                "spectral_centroid": entry.get("spectral_centroid", 0)
            }
        
        # Determine genre based on BPM and scale
        entry["genre"] = get_genre_from_bpm(audio_metadata.get("bpm", 0), audio_metadata.get("scale", ""))
        
        # Get instruments based on genre
        entry["instruments"] = get_instruments_for_genre(entry["genre"])
        
        # Generate moods, keywords, and enhanced prompt
        entry["moods"] = generate_moods(entry, audio_metadata)
        entry["keywords"] = generate_keywords(entry, audio_metadata)
        entry["prompt"] = generate_enhanced_prompt(entry, audio_metadata)
        
        # Add instrumentals_file field if missing
        if "instrumentals_file" not in entry:
            entry["instrumentals_file"] = entry["self_wav"]
        
        updated_count += 1
        
        # Save progress periodically
        if updated_count % 100 == 0:
            with open(metadata_file, "w") as f:
                json.dump(metadata_list, f, indent=4)
            print(f"Saved progress after {updated_count} entries")

    # Save the updated metadata back to the same file
    with open(metadata_file, "w") as f:
        json.dump(metadata_list, f, indent=4)

    print(f"Updated metadata.json with enhanced information for {updated_count} entries")

if __name__ == "__main__":
    prepare_enhanced_metadata()