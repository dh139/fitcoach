const Groq        = require('groq-sdk');
const ChatHistory = require('../models/ChatHistory');
const { buildCoachContext, calculateImprovementScore } = require('../services/improvementScore');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_HISTORY = 20; // rolling window of messages sent to LLM

// ── POST /api/coach/chat (streaming SSE) ──────────────────────────────────────
const chat = async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    // Build personalised system context
    const { systemPrompt } = await buildCoachContext(req.user._id);

    // Load or create chat history
    let history = await ChatHistory.findOne({ user: req.user._id });
    if (!history) {
      history = await ChatHistory.create({ user: req.user._id, messages: [], messageCount: 0 });
    }

    // Prepare messages for Groq — rolling last MAX_HISTORY messages
    const recentMessages = history.messages
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.content }));

    const groqMessages = [
      { role: 'system',  content: systemPrompt },
      ...recentMessages,
      { role: 'user',    content: message },
    ];

    // Save user message to history
    history.messages.push({ role: 'user', content: message, timestamp: new Date() });
    history.messageCount += 1;

    // Trim history to last 50 messages to prevent unbounded growth
    if (history.messages.length > 50) {
      history.messages = history.messages.slice(-50);
    }

    // ── Set up SSE streaming ───────────────────────────────────────────────────
    res.setHeader('Content-Type',  'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection',    'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const stream = await groq.chat.completions.create({
      model:       'llama-3.3-70b-versatile',
      messages:    groqMessages,
      max_tokens:  600,
      temperature: 0.7,
      stream:      true,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullResponse += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }

    // Save assistant response to history
    history.messages.push({ role: 'assistant', content: fullResponse, timestamp: new Date() });
    history.messageCount += 1;
    await history.save();

    // Signal stream end
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Coach chat error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
};

// ── GET /api/coach/history ─────────────────────────────────────────────────────
const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.findOne({ user: req.user._id }).lean();
    const messages = history?.messages?.slice(-40) || [];
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE /api/coach/history ──────────────────────────────────────────────────
const clearChatHistory = async (req, res) => {
  try {
    await ChatHistory.findOneAndUpdate(
      { user: req.user._id },
      { $set: { messages: [], messageCount: 0 } }
    );
    res.status(200).json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET /api/coach/improvement-score ──────────────────────────────────────────
const getImprovementScore = async (req, res) => {
  try {
    const result = await calculateImprovementScore(req.user._id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat, getChatHistory, clearChatHistory, getImprovementScore };