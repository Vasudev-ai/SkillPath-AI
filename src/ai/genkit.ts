import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKeys = (process.env.GEMINI_API_KEY || '').split(',').filter(k => k.trim());
let currentKeyIndex = 0;

if (apiKeys.length === 0) {
  console.warn('GEMINI_API_KEY environment variable is not set or is empty.');
}

/**
 * Returns a Google AI plugin instance with the current API key.
 * This function can be used to retry operations with a new key on failure.
 */
export function getGoogleAIPlugin() {
  if (apiKeys.length === 0) {
    // Falls back to the default behavior if no keys are provided.
    // googleAI() will then look for the key in the environment itself.
    return googleAI();
  }
  const apiKey = apiKeys[currentKeyIndex];
  return googleAI({apiKey});
}

/**
 * Rotates to the next available API key.
 * Returns true if a new key was available, false otherwise.
 */
export function rotateKey() {
  if (apiKeys.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
    console.log(`Rotated to new Gemini API key (index: ${currentKeyIndex}).`);
    // We need to re-initialize the ai object with the new plugin
    ai.configure({
        plugins: [getGoogleAIPlugin()],
    });
    return true;
  }
  console.warn('No API keys available for rotation.');
  return false;
}


export const ai = genkit({
  plugins: [getGoogleAIPlugin()],
  model: 'googleai/gemini-2.5-flash',
});
