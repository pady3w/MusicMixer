
const { generateLyrics } = require('../services/openaiService');

async function handleLyricGeneration(req, res) {
  try {
    const { prompt, style, mood } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Construct a more detailed prompt using additional parameters
    const enhancedPrompt = `Write song lyrics with the following details:
      Main idea: ${prompt}
      ${style ? `Style: ${style}` : ''}
      ${mood ? `Mood: ${mood}` : ''}
    `;
    
    const lyrics = await generateLyrics(enhancedPrompt);
    return res.json({ lyrics });
  } catch (error) {
    console.error('Lyric generation failed:', error);
    return res.status(500).json({ error: 'Failed to generate lyrics' });
  }
}

module.exports = { handleLyricGeneration };