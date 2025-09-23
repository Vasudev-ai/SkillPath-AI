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

const systemPrompt = `You are an AI assistant providing clear, concise, and encouraging explanations for course recommendations to learners within the Indian NSQF ecosystem. Your goal is to build trust and help the learner understand the value of each recommended step in their career path.

For each explanation, you must:
1.  Directly address why this specific course is recommended for this specific user.
2.  Reference the user's profile (e.g., "Because you mentioned you want to be a...," "Building on your skill in...").
3.  Connect the course to a specific skill gap or career aspiration.
4.  Cite the source of the recommendation (e.g., "This aligns with labor market data showing demand for...", "It's a crucial step for NSQF Level 5...").
5.  State a confidence level (High, Medium, Low) for how impactful this course will be for the user's goal.
6.  Keep the language simple, positive, and easy to understand.`;

const prompt = ai.definePrompt({
  name: 'explainCourseRecommendationPrompt',
  system: systemPrompt,
  input: {schema: ExplainCourseRecommendationInputSchema},
  output: {schema: ExplainCourseRecommendationOutputSchema},
  prompt: `A learner is asking for an explanation about a recommended course.

You will receive the following information:
- Course ID: {{{courseId}}}
- User Profile (JSON): {{{userProfile}}}
- The Full Learning Path Recommendation (JSON): {{{recommendationData}}}

Based on all this information, generate a simple and clear explanation for why this specific course (ID: {{{courseId}}}) is recommended for this user.
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
