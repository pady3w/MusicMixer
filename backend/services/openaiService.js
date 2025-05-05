// backend/services/openaiService.js
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateLyrics(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",  // or another appropriate model
      messages: [
        { role: "system", content: "You are a skilled songwriter. Create unique and creative lyrics based on the user's prompt. Do not allow for any cursing or racist remarks in the generation." },
        { role: "user", content: prompt }
      ],
      max_tokens: 10,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating lyrics:', error);
    throw new Error('Failed to generate lyrics');
  }
}

module.exports = { generateLyrics };