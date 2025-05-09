from transformers import AutoProcessor, MusicgenForConditionalGeneration
import scipy

processor = AutoProcessor.from_pretrained("facebook/musicgen-small")
model = MusicgenForConditionalGeneration.from_pretrained("facebook/musicgen-small")

inputs = processor(
    text=["80s pop track with bassy drums and synth", "90s rock song with loud guitars and heavy drums"],
    #text=["70s pop track with jangly guitars and poppy hook", "90s rock song with loud guitars and heavy drums"],
    padding=True,
    return_tensors="pt",
)

audio_values = model.generate(**inputs, max_new_tokens=1024)

sampling_rate = model.config.audio_encoder.sampling_rate
scipy.io.wavfile.write("musicgen_out3.wav", rate=sampling_rate, data=audio_values[0, 0].numpy())  