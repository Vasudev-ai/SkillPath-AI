import type { GeneratePersonalizedLearningPathOutput } from '@/ai/flows/generate-personalized-learning-path';

export type UserProfile = {
  name: string;
  email: string;
  education: string;
  skills: string;
  aspirations: string;
  budget?: string;
  time_commitment?: string;
  device_access?: string[];
  constraints?: string;
};

// The output from the AI flow is the learning path
export type LearningPath = GeneratePersonalizedLearningPathOutput;
