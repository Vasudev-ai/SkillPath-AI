// Summarize the learning path into human-readable format (both in English and Hindi).

'use server';

/**
 * @fileOverview Summarizes a learning path into human-readable formats.
 *
 * - summarizeLearningPath - A function that summarizes the generated learning path.
 * - SummarizeLearningPathInput - The input type for the summarizeLearningPath function.
 * - SummarizeLearningPathOutput - The return type for the summarizeLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLearningPathInputSchema = z.object({
  learningPathJson: z
    .string()
    .describe('The JSON representation of the generated learning path.'),
});
export type SummarizeLearningPathInput = z.infer<
  typeof SummarizeLearningPathInputSchema
>;

const SummarizeLearningPathOutputSchema = z.object({
  englishSummary: z.string().describe('A human-readable summary in English.'),
  hindiSummary: z.string().describe('A human-readable summary in Hindi.'),
});
export type SummarizeLearningPathOutput = z.infer<
  typeof SummarizeLearningPathOutputSchema
>;

export async function summarizeLearningPath(
  input: SummarizeLearningPathInput
): Promise<SummarizeLearningPathOutput> {
  return summarizeLearningPathFlow(input);
}

const systemPrompt = `You are an AI expert in career guidance and education, especially in the Indian NSQF framework. Your task is to summarize a detailed, JSON-formatted learning path into a concise, encouraging, and easy-to-understand summary for a learner. You must provide this summary in both English and Hindi.

Highlight the key steps, the most important skills to be acquired, and the potential career benefits. The tone should be motivational and clear.`;

const summarizeLearningPathPrompt = ai.definePrompt({
  name: 'summarizeLearningPathPrompt',
  system: systemPrompt,
  input: {schema: SummarizeLearningPathInputSchema},
  output: {schema: SummarizeLearningPathOutputSchema},
  prompt: `Please summarize the following learning path in both English and Hindi.

Learning Path (JSON):
{{{learningPathJson}}}`,
});

const summarizeLearningPathFlow = ai.defineFlow(
  {
    name: 'summarizeLearningPathFlow',
    inputSchema: SummarizeLearningPathInputSchema,
    outputSchema: SummarizeLearningPathOutputSchema,
  },
  async input => {
    const {output} = await summarizeLearningPathPrompt(input);
    return output!;
  }
);
