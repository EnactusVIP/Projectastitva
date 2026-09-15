/**
 * Project Astitva — Saathi Client Service
 * Dispatches conversational messages to the secure server-side endpoint /api/saathi.
 * Keeps UI components completely decoupled from upstream AI providers and keys.
 */

/**
 * Send conversation history to the Saathi AI backend.
 *
 * @param {Array<{role: 'user' | 'assistant', content: string}>} messages - Current conversation history
 * @returns {Promise<string>} The assistant's reply text
 */
export async function sendMessageToSaathi(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages list cannot be empty.');
  }

  const response = await fetch('/api/saathi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Saathi is having trouble responding right now. Please try again in a moment.');
  }

  if (!response.ok) {
    const errorMsg = data?.message || 'Saathi is having trouble responding right now. Please try again in a moment.';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = data?.error;
    throw error;
  }

  if (!data?.message) {
    throw new Error('Empty message returned from Saathi.');
  }

  return data.message;
}
