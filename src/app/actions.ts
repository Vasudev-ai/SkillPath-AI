
'use server';

import { generatePersonalizedLearningPath } from '@/ai/flows/generate-personalized-learning-path';
import type { UserProfile, LearningPath } from '@/lib/types';
import { z } from 'zod';

const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  education: z.string().min(1, 'Education is required'),
  skills: z.string().min(1, 'Skills are required'),
  aspirations: z.string().min(1, 'Aspirations are required'),
  budget: z.string(),
  time_commitment: z.string(),
  device_access: z.array(z.string()),
  constraints: z.string(),
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
      demand_index: 0.85,
      average_salary: '9,50,000 INR per annum',
      top_locations: ['Bengaluru', 'Pune', 'Hyderabad', 'NCR'],
      sample_jobs: [
        'Frontend Developer',
        'Full Stack Engineer',
        'UI/UX Developer',
      ],
    });

    const learningPath = await generatePersonalizedLearningPath({
      profile: profileString,
      laborMarketData,
    });

    if (!learningPath) {
      return { path: null, error: 'AI model failed to return a path.' };
    }

    return { path: learningPath };
  } catch (error) {
    console.error('Error generating learning path:', error);
    return {
      path: null,
      error: 'An unexpected error occurred. Please try again later.',
    };
  }
}
