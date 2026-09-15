import { GoogleGenAI } from '@google/genai';
import { SAATHI_SYSTEM_PROMPT } from './systemPrompt.js';

/**
 * Call the Google Gemini API to generate a response for Saathi.
 *
 * @param {Array<{role: string, content: string}>} messages - Sanitized conversation history
 * @returns {Promise<{text: string}>}
 */
export async function callGemini(messages) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured on the server.');
    err.code = 'CONFIG_MISSING';
    err.status = 503;
    throw err;
  }

  const modelName = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();

  const ai = new GoogleGenAI({ apiKey });

  // Map messages to Gemini's role format ('user' and 'model')
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
    parts: [{ text: String(m.content || '').trim() }],
  }));

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: SAATHI_SYSTEM_PROMPT,
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const replyText = response?.text || '';
    if (!replyText) {
      throw new Error('Empty response received from Gemini.');
    }

    return { text: replyText.trim() };
  } catch (error) {
    // Sanitize technical details to prevent credential leaks
    const rawMsg = error?.message || String(error);
    console.error('[Saathi Gemini Error]:', rawMsg);

    const err = new Error('Upstream AI generation failed.');
    if (rawMsg.includes('API_KEY_INVALID') || rawMsg.includes('API key not valid')) {
      err.code = 'AUTH_INVALID';
      err.status = 401;
      err.clientMessage = 'Server authentication error with the AI service.';
    } else if (rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429') || rawMsg.includes('quota')) {
      err.code = 'QUOTA_EXCEEDED';
      err.status = 429;
      err.clientMessage = 'Saathi is receiving high traffic right now. Please try again in a few moments.';
    } else if (rawMsg.includes('NOT_FOUND') || rawMsg.includes('models/')) {
      err.code = 'MODEL_NOT_FOUND';
      err.status = 502;
      err.clientMessage = `Configured model (${modelName}) could not be reached. Please check server settings.`;
    } else {
      err.code = 'GEMINI_ERROR';
      err.status = 500;
      err.clientMessage = 'Saathi is having trouble responding right now. Please try again in a moment.';
    }

    throw err;
  }
}
