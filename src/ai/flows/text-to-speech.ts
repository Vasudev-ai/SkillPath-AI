'use server';
/**
 * @fileOverview A flow for converting text to speech.
 *
 * - textToSpeech - A function that converts text to speech.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The return type for the textToSpeech function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/googleai';

const TextToSpeechInputSchema = z.object({
  summary: z.string().describe('The summary of the learning path to make conversational and convert to speech.'),
  lang: z.enum(['en', 'hi']).describe('The language for the conversational output.'),
  userName: z.string().describe('The name of the user.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI in WAV format. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const conversationalPrompt = ai.definePrompt({
    name: 'conversationalPrompt',
    system: `You are SkillPath Mitra, a friendly and encouraging AI career guide. Your task is to transform a formal summary of a user's learning path into a warm, personal, and conversational monologue.

    RULES:
    1.  Start by greeting the user by their name.
    2.  Introduce yourself cheerfully (e.g., "I'm SkillPath Mitra, your personal AI guide.").
    3.  Do NOT just repeat the summary. Rephrase it in a natural, encouraging, and easy-to-understand way.
    4.  Keep it concise and to the point, like a quick, helpful voice note.
    5.  End on a positive and motivational note.
    6.  Speak in the user's chosen language (English or Hindi).
    `,
    input: { schema: TextToSpeechInputSchema },
    output: { schema: z.object({ conversationalText: z.string() }) },
    prompt: `The user's name is {{{userName}}} and their language is {{{lang}}}. Convert the following learning path summary into a conversational script for me to speak:

    Summary: {{{summary}}}
    `,
});


const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    // 1. Generate conversational text from the summary
    const conversationalResponse = await conversationalPrompt(input);
    const textToSpeak = conversationalResponse.output?.conversationalText || (input.lang === 'en' ? `Hello ${input.userName}, I am unable to provide a summary at the moment.` : `नमस्ते ${input.userName}, मैं इस समय सारांश प्रदान करने में असमर्थ हूं।`);

    // 2. Convert the generated text to speech
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A friendly voice
            },
          },
        },
        prompt: textToSpeak,
      });

      if (!media) {
        throw new Error('Text-to-speech model did not return any media.');
      }

      // 3. Convert the raw PCM audio data from Base64 to a Buffer
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      // 4. Convert the PCM Buffer to a WAV Base64 string
      const wavBase64 = await toWav(audioBuffer);
      
      return {
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
      };
  }
);
