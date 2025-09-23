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

const summarizeLearningPathPrompt = ai.definePrompt({
  name: 'summarizeLearningPathPrompt',
  input: {schema: SummarizeLearningPathInputSchema},
  output: {schema: SummarizeLearningPathOutputSchema},
  prompt: `You are an AI expert in career guidance and education, especially in the Indian NSQF framework. Please summarize the following learning path in both English and Hindi, highlighting the key steps, skills to be acquired, and potential career benefits. Focus on making it easily understandable for a learner. The summary should be concise and encouraging.

Learning Path (JSON):
{{learningPathJson}}`,
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
