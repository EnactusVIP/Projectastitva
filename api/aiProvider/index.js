import { callGemini } from './gemini.js';

const TIMEOUT_MS = 20000;

/**
 * Dispatch message generation to the active AI provider with timeout protection.
 *
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<{text: string}>}
 */
export async function generateChatResponse(messages) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase().trim();

  let providerPromise;

  if (provider === 'grok' && process.env.XAI_API_KEY) {
    // Optional placeholder for future xAI Grok provider
    const err = new Error('Grok provider is not enabled on this environment.');
    err.status = 501;
    err.clientMessage = 'Configured AI provider is not available. Defaulting to Gemini.';
    providerPromise = Promise.reject(err);
  } else {
    // Default provider: Google Gemini
    providerPromise = callGemini(messages);
  }

  // Wrap with timeout protection
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const timeoutErr = new Error('AI response timed out.');
      timeoutErr.code = 'TIMEOUT';
      timeoutErr.status = 504;
      timeoutErr.clientMessage = 'Saathi took a bit too long to respond. Please try again.';
      reject(timeoutErr);
    }, TIMEOUT_MS);
  });

  try {
    const result = await Promise.race([providerPromise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timer);
  }
}
