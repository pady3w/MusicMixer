from flask import Flask, request, jsonify, send_file
import scipy
from transformers import AutoProcessor, MusicgenForConditionalGeneration
import io

app = Flask(__name__)

# Load the MusicGen model and processor
processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

print("Starting Flask server...")

# API endpoint to generate music
@app.route('/generate', methods=['POST'])
def generate_music():
    try:
        prompt = request.json.get("prompt")
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        print(f"Received music generation request with prompt: {prompt}")  # Log input

        # Process the prompt (log processing stage)
        inputs = processor(text=[prompt], padding=True, return_tensors="pt")
        print("Processed prompt, generating music...")

        # Generate the music (log the start of the generation)
        audio_values = model.generate(**inputs, max_new_tokens=1024)
        print("Music generation complete")

        # Save to buffer (log saving stage)
        audio_buffer = io.BytesIO()
        scipy.io.wavfile.write(audio_buffer, rate=model.config.audio_encoder.sampling_rate, data=audio_values[0, 0].numpy())
        audio_buffer.seek(0)

        # Respond with the audio file
        print("Sending back audio file")
        return send_file(audio_buffer, mimetype="audio/wav", as_attachment=True, download_name="generated_song.wav")

    except Exception as e:
        print(f"Error during music generation: {e}")  # Log errors
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)

