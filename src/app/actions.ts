'use server';

import { generatePersonalizedLearningPath } from '@/ai/flows/generate-personalized-learning-path';
import { interviewFlow } from '@/ai/flows/interview-flow';
import type { UserProfile, LearningPath, InterviewMessage } from '@/lib/types';
import { z } from 'zod';

const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  education: z.string().min(1, 'Education is required'),
  skills: z.string().min(1, 'Skills are required'),
  aspirations: z.string().min(1, 'Aspirations is required'),
});

export async function generatePathAction(
  profileData: UserProfile
): Promise<{ path: LearningPath | null; error?: string }> {
  const validation = userProfileSchema.safeParse(profileData);
  if (!validation.success) {
    return {
      path: null,
      error: validation.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const profileString = JSON.stringify(validation.data);
    const laborMarketData = JSON.stringify({
      demand_index: 85,
      avg_salary_inr: 950000,
      top_locations: ['Bengaluru', 'Pune', 'Hyderabad', 'NCR'],
    });

    const learningPath = await generatePersonalizedLearningPath({
      profile: profileString,
      laborMarketData,
    });

    if (!learningPath) {
      return { path: null, error: 'AI model failed to return a path.' };
    }
    
    // The AI might return a string for salary, so we parse it here if needed.
    if (typeof learningPath.labour_market_signals.avg_salary_inr === 'string') {
        const salaryStr = learningPath.labour_market_signals.avg_salary_inr as string;
        learningPath.labour_market_signals.avg_salary_inr = parseInt(salaryStr.replace(/[^0-9]/g, '')) || 0;
    }


    return { path: learningPath };
  } catch (error) {
    console.error('Error generating learning path:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return {
      path: null,
      error: `An unexpected error occurred. Please try again later. Details: ${errorMessage}`,
    };
  }
}

export async function interviewAction(
  courseTitle: string,
  messages: InterviewMessage[]
): Promise<{ response: string; error?: string }> {
  try {
    const result = await interviewFlow({
      courseTitle,
      messages: JSON.stringify(messages),
    });
    return { response: result.response };
  } catch (error) {
    console.error('Error in interview flow:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during the interview.';
    return {
      response: '',
      error: `An unexpected error occurred. Details: ${errorMessage}`,
    };
  }
}
