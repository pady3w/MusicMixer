# from flask import Flask, request, jsonify, send_file
# from audiocraft.models import MusicGen
# from audiocraft.data.audio import audio_write
# import os
# import boto3
# import uuid
# import torch
# import io
# import scipy
# from flask_cors import CORS
# import subprocess

# ## download the weights first
# subprocess.run(["python", "download_weights.py"], check=True)

# app = Flask(__name__)
# CORS(app)
# print("Initializing MusicGen model...", flush=True)
# device = "cuda" if torch.cuda.is_available() else "cpu"
# model = MusicGen.get_pretrained('facebook/musicgen-small', device=device)
# model.set_generation_params(duration=8)
# print("MusicGen model initialized successfully!", flush=True)

# s3 = boto3.client('s3')
# bucket = os.getenv("S3_BUCKET","temp_bucket")
# print(f"Using S3 bucket: {bucket}", flush=True)

# @app.route('/generate', methods=['POST'])
# def generate():
#     print("Received generation request...", flush=True)
#     data = request.get_json()
#     prompt = data.get("prompt", "lofi hip hop")
#     print(f"Generating music for prompt: {prompt}", flush=True)
    
#     filename = f"{uuid.uuid4().hex[:8]}.wav"
#     tmp_path = f"/tmp/{filename}"
#     try:
#         print("Starting music generation...", flush=True)
#         if torch.cuda.is_available():
#             print(f"Using GPU: {torch.cuda.get_device_name(0)}", flush=True)
#         else:
#             print("No GPU available, using CPU", flush=True)
            
#         wav = model.generate([prompt])
#         print("Music generated, moving to CPU for file writing...", flush=True)
#         wav_tensor = wav[0].cpu()  # Move to CPU for audio_write
        
#         print("Writing audio file...", flush=True)
#         audio_write(tmp_path[:-4], wav_tensor, model.sample_rate, strategy="loudness")
        
#         print(f"Uploading to S3: {filename}", flush=True)
#         s3.upload_file(tmp_path, bucket, f"{filename}")


#         s3_url = f"https://{bucket}.s3.amazonaws.com/{filename}"
#         print(f"Upload complete! URL: {s3_url}", flush=True)
#         return jsonify({"url": s3_url})
#         # Save to buffer (log saving stage)
#         # audio_buffer = io.BytesIO()
#         # scipy.io.wavfile.write(audio_buffer, rate=model.config.audio_encoder.sampling_rate, data=wav[0, 0].numpy())
#         # audio_buffer.seek(0)

#         # # Respond with the audio file
#         # print("Sending back audio file")
#         # return send_file(audio_buffer, mimetype="audio/wav", as_attachment=True, download_name="generated_song.wav")
    
#     except Exception as e:
#         print(f"Error occurred: {str(e)}", flush=True)
#         return jsonify({"error": str(e)}), 500

# if __name__ == '__main__':
#     print("Starting Flask server...", flush=True)
#     app.run(host='0.0.0.0', port=8080)


from flask import Flask, request, jsonify, send_file
from audiocraft.models import MusicGen
from audiocraft.data.audio import audio_write
import os
import boto3
import uuid
import torch
import io
import scipy
from flask_cors import CORS
import subprocess

## download the weights first
subprocess.run(["python", "download_weights.py"], check=True)

app = Flask(__name__)
CORS(app)
print("Initializing MusicGen model...", flush=True)
device = "cuda" if torch.cuda.is_available() else "cpu"
model = MusicGen.get_pretrained('facebook/musicgen-small', device=device)
model.set_generation_params(duration=8)
print("MusicGen model initialized successfully!", flush=True)

s3 = boto3.client('s3')
bucket = os.getenv("S3_BUCKET", "temp_bucket")
print(f"Using S3 bucket: {bucket}", flush=True)

@app.route('/generate', methods=['POST'])
def generate():
    print("Received generation request...", flush=True)
    data = request.get_json()
    prompt = data.get("prompt", "lofi hip hop")
    print(f"Generating music for prompt: {prompt}", flush=True)

    try:
        print("Starting music generation...", flush=True)
        if torch.cuda.is_available():
            print(f"Using GPU: {torch.cuda.get_device_name(0)}", flush=True)
        else:
            print("No GPU available, using CPU", flush=True)

        # Generate the music
        wav = model.generate([prompt])
        print("Music generated, moving to CPU for file writing...", flush=True)
        wav_tensor = wav[0].cpu()  # Move to CPU for audio_write

        # Save to buffer (log saving stage)
        audio_buffer = io.BytesIO()
        scipy.io.wavfile.write(audio_buffer, rate=model.sample_rate, data=wav[0, 0].numpy())
        audio_buffer.seek(0)

        # Respond with the audio file
        print("Sending back audio file")
        return send_file(
            audio_buffer, 
            mimetype="audio/wav", 
            as_attachment=True, 
            download_name="generated_song.wav"
        )

    except Exception as e:
        print(f"Error occurred: {str(e)}", flush=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...", flush=True)
    app.run(host='0.0.0.0', port=8080)
