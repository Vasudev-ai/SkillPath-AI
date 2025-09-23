'use server';

/**
 * @fileOverview Generates a personalized learning path based on user profile data.
 *
 * - generatePersonalizedLearningPath - A function that generates a personalized learning path.
 * - GeneratePersonalizedLearningPathInput - The input type for the generatePersonalizedLearningPath function.
 * - GeneratePersonalizedLearningPathOutput - The return type for the generatePersonalizedLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedLearningPathInputSchema = z.object({
  profile: z
    .string()
    .describe(
      'JSON string containing user profile data including education, skills, aspirations, and constraints.'
    ),
  laborMarketData: z.string().optional().describe('JSON string containing labor market data, including demand index, average salary, and top locations.'),
});
export type GeneratePersonalizedLearningPathInput = z.infer<
  typeof GeneratePersonalizedLearningPathInputSchema
>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  career_match_score: z.number().describe('A score indicating the match between the user profile and career path.'),
  nsqf_mapping: z
    .array(z.string())
    .describe('An array of NSQF course IDs mapped to the learning path.'),
  skill_gap: z.array(z.string()).describe('An array of skills the user needs to acquire.'),
  alternative_paths: z
    .array(z.string())
    .describe('An array of alternative career paths.'),
  labour_market_signals: z
    .record(z.any())
    .describe('A JSON object containing labor market signals data.'),
  explainability: z
    .array(z.string())
    .describe('An array of explanations for each step in the learning path.'),
  next_actions: z.array(z.string()).describe('An array of suggested next actions.'),
  summary_en: z.string().describe('A human-readable summary of the learning path in English.'),
  summary_hi: z.string().describe('A human-readable summary of the learning path in Hindi.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<
  typeof GeneratePersonalizedLearningPathOutputSchema
>;

export async function generatePersonalizedLearningPath(
  input: GeneratePersonalizedLearningPathInput
): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const generatePersonalizedLearningPathPrompt = ai.definePrompt({
  name: 'generatePersonalizedLearningPathPrompt',
  input: {schema: GeneratePersonalizedLearningPathInputSchema},
  output: {schema: GeneratePersonalizedLearningPathOutputSchema},
  prompt: `You are an AI career path generator specializing in NSQF (National Skills Qualification Framework) alignment. You generate personalized learning paths for Indian learners.

  Analyze the provided user profile and generate a step-by-step learning path that addresses skill gaps and aligns with their aspirations, constraints, and current labor market demands.

  User Profile: {{{profile}}}

  Labor Market Data (if available): {{{laborMarketData}}}

  Provide the output in both machine-readable JSON format and human-readable summaries in English and Hindi.

  Ensure that the learning path is NSQF-mapped and includes confidence scores for each recommendation.
  Consider alternative paths and explain the reasoning behind each step.
  Suggest clear next actions for the learner.
  Include labour market signals in your consideration.
`,
});

const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async input => {
    const {output} = await generatePersonalizedLearningPathPrompt(input);
    return output!;
  }
);
