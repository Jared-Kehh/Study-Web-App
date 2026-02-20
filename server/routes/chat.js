const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
console.log('API_KEY in chat.js:', process.env.OPENAI_API_KEY ? 'EXISTS' : 'MISSING');
console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);


// Load OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.API_KEY,
});

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Convert your frontend messages into OpenAI format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await client.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant. Help students with study techniques, time management, learning strategies, and understanding concepts. Be encouraging and provide practical advice. If a user asks about anything unrelated to studying or academics, politely let them know you can only help with study-related questions. Do not discuss politics, entertainment, or any inappropriate content. Keep your responses clear, educational, and encouraging."
        },
        ...formattedMessages
      ],
      max_tokens: 1000,
    });

    res.json({
      response: response.choices[0].message.content
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      error: "Failed to get response from chatbot",
      details: error.message,
    });
  }
});

module.exports = router;