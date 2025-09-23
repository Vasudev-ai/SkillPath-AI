'use server';
/**
 * @fileOverview An AI agent that explains why a course is recommended.
 *
 * - explainCourseRecommendation - A function that handles the explanation process.
 * - ExplainCourseRecommendationInput - The input type for the explainCourseRecommendation function.
 * - ExplainCourseRecommendationOutput - The return type for the explainCourseRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCourseRecommendationInputSchema = z.object({
  courseId: z.string().describe('The ID of the course to explain.'),
  userProfile: z.string().describe('The user profile in JSON format (education, skills, aspirations, constraints).'),
  recommendationData: z.string().describe('The recommendation data for the course in JSON format (career_match_score, nsqf_mapping, skill_gap, alternative_paths, labour_market_signals, explainability, next_actions).'),
});
export type ExplainCourseRecommendationInput = z.infer<typeof ExplainCourseRecommendationInputSchema>;

const ExplainCourseRecommendationOutputSchema = z.object({
  explanation: z.string().describe('The detailed explanation of why the course is recommended for the user, including the source of the recommendation and the confidence level.'),
});
export type ExplainCourseRecommendationOutput = z.infer<typeof ExplainCourseRecommendationOutputSchema>;

export async function explainCourseRecommendation(input: ExplainCourseRecommendationInput): Promise<ExplainCourseRecommendationOutput> {
  return explainCourseRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCourseRecommendationPrompt',
  input: {schema: ExplainCourseRecommendationInputSchema},
  output: {schema: ExplainCourseRecommendationOutputSchema},
  prompt: `You are an AI assistant providing explanations for course recommendations to learners.

You will receive the following information:
- Course ID: {{{courseId}}}
- User Profile (JSON): {{{userProfile}}}
- Recommendation Data (JSON): {{{recommendationData}}}

Based on this information, explain why the course is recommended for the user.
Include the source of the recommendation (e.g., NSQF mapping, skill gap analysis, labor market signals) and a confidence level (High, Medium, Low) for the recommendation.
Format your explanation in a clear and concise manner that is easy for the learner to understand.
`,
});

const explainCourseRecommendationFlow = ai.defineFlow(
  {
    name: 'explainCourseRecommendationFlow',
    inputSchema: ExplainCourseRecommendationInputSchema,
    outputSchema: ExplainCourseRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
