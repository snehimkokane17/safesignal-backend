const express = require('express');
const Groq = require('groq-sdk');
require('dotenv').config();

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: `You are SafeSignal AI, an emergency crisis assistant for India. 
          You help people during emergencies like floods, fires, earthquakes, accidents and medical emergencies.
          Give calm, clear, step by step guidance.
          Always mention relevant Indian emergency numbers like 100 (Police), 101 (Fire), 108 (Ambulance).
          Keep responses short and actionable.`
        },
        {
          role: 'user',
          content: message
        }
      ]
    });
    res.json({
      reply: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;