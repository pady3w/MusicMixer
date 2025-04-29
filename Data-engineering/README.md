# Music Mixer Data-engineering

## Overview
We are building a platform that utilizes music gen to create music
based on a dataset of our own creation. We will be fine-tuning the model
in order to do that we needed to create our own dataset from scratch. Below is the process undertaken to do that.

## Requirements

### Hardware
- Nvidia GPU 16 GB VRAM
- 38 GB of Storage to store downloaded and instrumental audio files

### Software
#### Core Dependencies
- Python (3.10.12)
- cuda (12.18)
- pytorch (2.6.0+cu124)

#### Audio Processing
- yt-dlp (2025.02.19)
- essentia (2.1b6.dev1110)
- ffmpeg (4.4.2-0ubuntu0.22.04.1)
- Demucs (4.0.1) 

#### AWS
- AWS SDK boto3(python3) 1.37.13
- I have used a placeholder for our bucket name for security reasons this can be seen in the scripts songs_analyzer.py, improve_metadata.py, uptoS3.py, process_music.py

### Roadmap
- Use this dataset to fine-tune the music generation model
- Make additional tweaks to the dataset after our first training run is complete
- Address potential issues:
  - Limited variety of instruments and moods in song chunks
  - Chunks shorter than 15 seconds may prevent Music Gen from learning meaningful patterns
  - Short chunks may need to be removed in subsequent training runs
- Consider adding additional songs to improve dataset diversity and quality

### Project Structure

### Key Scripts
- **process_music.py**: Downloads YouTube videos, extracts audio, and processes them using Demucs to separate vocals from instrumentals. Creates 30-second chunks for dataset creation.
ffmpeg is used to convert the audio signal of the .wav files to 16kHz mono as this is the required audio format for fine-tuning MusicGen

- **songs_analyzer.py**: Analyzes the processed audio files to extract musical features such as BPM, key, scale, and genre. Generates metadata for each audio file.

- **improve_metadata.py**: Enhances the metadata by adding additional information like artist names, mood descriptors, and instruments. Cleans and normalizes the metadata.

- **uptoS3.py**: Uploads the processed audio files and associated metadata to AWS S3 for storage and later use in training music generation models.

### Workflow
1. Run process_music.py to download and process audio files
2. Run songs_analyzer.py to extract audio features
3. Run improve_metadata.py to enhance metadata quality
4. Run uptoS3.py to upload dataset to AWS S3


### Installing Dependencies
```bash
pip install torch==2.6.0+cu124
pip install boto3==1.37.13
pip install yt-dlp==2025.02.19
pip install essentia==2.1b6.dev1110
pip install demucs==4.0.1



