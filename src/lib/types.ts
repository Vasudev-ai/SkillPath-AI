import type { GeneratePersonalizedLearningPathOutput, interviewFlow } from '@/ai/flows/generate-personalized-learning-path';
import type { InterviewFlowOutput } from '@/ai/flows/interview-flow';

export type UserProfile = {
  name: string;
  email: string;
  education: string;
  skills: string;
  aspirations: string;
  password?: string;
};

// The output from the AI flow is the learning path
export type LearningPath = GeneratePersonalizedLearningPathOutput;

export type InterviewMessage = {
    role: 'user' | 'model';
    content: string;
};
