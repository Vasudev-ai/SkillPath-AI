'use server';
/**
 * @fileOverview An AI agent that conducts a mock interview with spoken responses.
 *
 * - interviewFlow - A function that handles the interview process.
 * - InterviewFlowInput - The input type for the interviewFlow function.
 * - InterviewFlowOutput - The return type for the interviewFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import wav from 'wav';

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

const InterviewFlowInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course/job for which the interview is being conducted.'),
  messages: z.string().describe('The chat history as a JSON string of InterviewMessage objects.'),
});
export type InterviewFlowInput = z.infer<typeof InterviewFlowInputSchema>;

const InterviewFlowOutputSchema = z.object({
  response: z.string().describe('The AI interviewer\'s next response or question.'),
  audioDataUri: z.string().optional().describe("The generated audio for the response as a data URI in WAV format."),
});
export type InterviewFlowOutput = z.infer<typeof InterviewFlowOutputSchema>;

export async function interviewFlow(input: InterviewFlowInput): Promise<InterviewFlowOutput> {
  return interviewFlowRunner(input);
}

const systemPrompt = `You are an expert, friendly, and encouraging AI hiring manager for India's vocational ecosystem. Your goal is to conduct a short, focused, and helpful mock interview with a learner who is preparing for a job related to a specific course they have taken.

ROLE & BEHAVIOUR:
1.  **Be a Coach, Not Just an Examiner:** Your tone should be supportive. Start by welcoming the user and explaining the process.
2.  **Stay in Character:** You are a hiring manager for a company in India.
3.  **Ask One Question at a Time:** Do not overwhelm the user. Ask one question and wait for their response before asking the next one.
4.  **Relevance is Key:** Ask questions directly relevant to the course title provided. For a "Full-Stack Web Development" course, ask about HTML, CSS, JavaScript, React, Node.js, databases, etc. For "Data Analytics", ask about SQL, Excel, Python (pandas), statistics, etc.
5.  **Mix of Questions:** Ask a simple mix of technical and behavioral questions. (e.g., "What is a closure in JavaScript?", "Tell me about a project you're proud of.").
6.  **Keep it Conversational:** Use simple, clear language. You can use Hindi if the user responds in Hindi.
7.  **Starting the Interview:** If the message history is empty, you must start the interview. Welcome the user warmly, introduce yourself as their AI interview coach for the role related to "{{courseTitle}}", and ask your first question. For example: "Hello! I'm your AI interview coach. I'm here to help you practice for your interview related to {{courseTitle}}. Let's start with our first question: What interests you about this field?"
8.  **Concluding the Interview:** After 3-4 questions, conclude the interview. Provide brief, positive, and constructive feedback. Thank them for their time. Do not ask for more questions from the user after providing feedback.

The user's chat history will be provided. Your response should be the next message in the conversation.
`;

const interviewFlowRunner = ai.defineFlow(
  {
    name: 'interviewFlow',
    inputSchema: InterviewFlowInputSchema,
    outputSchema: InterviewFlowOutputSchema,
  },
  async ({courseTitle, messages}) => {
    
    // 1. Generate the text response from the interviewer
    const response = await ai.generate({
        prompt: `Conducting a mock interview for the role related to: ${courseTitle}.

        Here is the conversation history so far:
        ${messages}
        
        Based on the history, ask the next relevant question or provide a concluding feedback if the interview is over. Your response should be just the hiring manager's dialogue.
        `,
        model: 'googleai/gemini-2.5-flash',
        config: {
            temperature: 0.7,
        },
        system: systemPrompt,
    });
    
    const textResponse = response.text;
    if (!textResponse) {
        throw new Error('AI did not generate a text response.');
    }

    // 2. Convert the generated text to speech
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: textResponse,
      });

      if (!media) {
        return { response: textResponse }; // Return text only if TTS fails
      }

      // 3. Convert the raw PCM audio data from Base64 to a Buffer
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      // 4. Convert the PCM Buffer to a WAV Base64 string
      const wavBase64 = await toWav(audioBuffer);
      
      return {
        response: textResponse,
        audioDataUri: `data:audio/wav;base64,${wavBase64}`,
      };
  }
);
