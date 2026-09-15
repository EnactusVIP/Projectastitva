import { generateChatResponse } from './aiProvider/index.js';

// Basic in-memory rate limiting store (sliding 1-minute window)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;

// Clean up stale IP records periodically
if (typeof setInterval !== 'undefined') {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now - data.startTime > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
  if (interval && typeof interval.unref === 'function') {
    interval.unref();
  }
}

function checkRateLimit(clientIp) {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  if (!entry || now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIp, { count: 1, startTime: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  entry.count += 1;
  return true;
}

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported.',
    });
  }

  // 2. Client IP extraction & rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'You have sent several messages in a short time. Please wait a moment before sending another.',
    });
  }

  // 3. Request body validation
  const body = req.body || {};
  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid request: "messages" must be a non-empty array of messages.',
    });
  }

  // 4. Sanitize and validate conversation history
  // Keep up to the last 20 messages for context window management
  const sanitized = [];
  const maxMessages = 20;
  const recentMessages = messages.slice(-maxMessages);

  for (const msg of recentMessages) {
    if (!msg || typeof msg !== 'object') continue;
    const role = msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user';
    const content = typeof msg.content === 'string' ? msg.content.trim() : '';

    if (!content) continue;

    // Enforce max 1000 characters per individual message
    const trimmedContent = content.slice(0, 1000);
    sanitized.push({ role, content: trimmedContent });
  }

  if (sanitized.length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'No valid message content provided.',
    });
  }

  // Ensure the latest message is from the user
  const lastMsg = sanitized[sanitized.length - 1];
  if (lastMsg.role !== 'user') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'The last message in the sequence must be from the user.',
    });
  }

  // 5. Generate response using AI provider abstraction
  try {
    const result = await generateChatResponse(sanitized);

    return res.status(200).json({
      message: result.text,
    });
  } catch (error) {
    const status = error.status || 500;
    const clientMessage =
      error.clientMessage ||
      'Saathi is having trouble responding right now. Please try again in a moment.';

    // Technical details are only logged server-side
    console.error('[API /api/saathi Error]:', error?.message || error);

    return res.status(status).json({
      error: error.code || 'AI_ERROR',
      message: clientMessage,
    });
  }
}
