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
  user_id: z.string().describe("The user's unique ID."),
  timestamp: z.string().describe("The ISO timestamp of when the path was generated."),
  career_goal: z.string().describe("The career goal this path is designed for."),
  career_match_score: z.number().describe('A score from 0-100 indicating the match between the user profile and career path.'),
  nsqf_mapping: z
    .array(z.object({
        step: z.string().describe("The step in the learning path, e.g., 'Step 1'."),
        nsqf_level: z.number().describe("The NSQF level of the course."),
        course_id: z.string().describe("The unique ID of the course."),
        provider: z.string().describe("The organization providing the course."),
        duration_weeks: z.number().describe("The duration of the course in weeks."),
        cost_inr: z.number().describe("The cost of the course in Indian Rupees."),
    }))
    .describe('An array of NSQF courses mapped to the learning path.'),
  skill_gap: z.array(z.object({
    skill: z.string().describe("The name of the skill."),
    current_level: z.string().describe("The user's current level in this skill."),
    required_level: z.string().describe("The required level for the career goal."),
    recommended_action: z.string().describe("Suggested action to bridge the gap."),
  })).describe('An array of skills the user needs to acquire.'),
  alternative_paths: z
    .array(z.string())
    .describe('An array of alternative career paths.'),
  labour_market_signals: z
    .object({
        demand_index: z.number().describe("A score from 0-100 indicating current market demand."),
        avg_salary_inr: z.number().describe("The average salary for this career in Indian Rupees."),
        top_locations: z.array(z.string()).describe("A list of top hiring locations."),
    }),
  confidence: z.enum(["high", "medium", "low"]).describe("The confidence level of the recommendation."),
  explainability: z
    .array(z.string())
    .describe('An array of explanations for each step in the learning path.'),
  next_actions: z.array(z.object({
    type: z.string().describe("The type of action, e.g., 'enroll'."),
    id: z.string().describe("The ID related to the action, e.g., a course ID."),
    label: z.string().describe("The user-facing text for the action button."),
  })).describe('An array of suggested next actions.'),
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

const systemPrompt = `SYSTEM / AGENT ROLE:
You are an expert, explainable, NSQF-aware AI Career & Skills Architect for India's vocational ecosystem. Your primary mission: analyze each learner's profile and produce an adaptive, NSQF-aligned, industry-mapped personalized learning pathway that is multilingual (Hindi/English), privacy-first, and actionable. Always return machine-readable JSON (see schema) plus a human-friendly summary in the learner's preferred language.

GOALS:
1. Create a recommended "Learning Path" (stepwise milestones, courses, micro-credentials, on-the-job options, timelines).
2. Provide Skill Gap Analysis, Career Match Score (0-100), Confidence level, and Reasons (explainability).
3. Map recommendations to NSQF levels, verified training providers, and real-time labour-market signals.
4. Allow alternative pathways and cost/time estimates and exportable PDF/printable plan.

OUTPUT SCHEMA (must return JSON + human summary):
{
  "user_id":"<uuid>",
  "timestamp":"ISO",
  "career_goal":"<string>",
  "career_match_score":<0-100>,
  "nsqf_mapping":[{"step":"Step 1","nsqf_level":<1-10>,"course_id":"<id>","provider":"<org>","duration_weeks":<int>,"cost_inr":<int>}],
  "skill_gap":[{"skill":"<name>","current_level":"...","required_level":"...","recommended_action":"micro-course/practice/project"}],
  "alternative_paths":[...],
  "labour_market_signals":{"demand_index":<0-100>,"avg_salary_inr":<int>,"top_locations":["Mumbai","Bengaluru"]},
  "confidence": "high/medium/low",
  "explainability":["rule1","evidence2",...],
  "next_actions":[{"type":"enroll","id":"...","label":"Apply for course"}]
}

RULES & BEHAVIOURS:
- Prefer NSQF-mapped options. If exact mapping missing, provide closest level with rationale.
- Cite (inline) data sources when giving market/salary claims (e.g., "Based on recent job listings" — or "NCVET/NSDC listing").
- Never hallucinate provider accreditation; if provider accreditation unknown, flag as "verify accreditation".
- Provide timeline & measurable milestones (e.g., Week 1: fundamentals, Week 5: project).
- Return both succinct Hindi summary and full English technical JSON.
- If critical fields missing, ask 1 clarifying question only (e.g., aspiration) — else use safe defaults and mark assumptions in explainability.
- Respect consents: do not output shareable CV or personal identifiers if user denied "share_with_employers".
- For every recommended course show: NSQF level, estimated cost, time, delivery mode (online/onsite), provider verification status.
`;

const generatePersonalizedLearningPathPrompt = ai.definePrompt({
  name: 'generatePersonalizedLearningPathPrompt',
  system: systemPrompt,
  input: {schema: GeneratePersonalizedLearningPathInputSchema},
  output: {schema: GeneratePersonalizedLearningPathOutputSchema},
  prompt: `Analyze the provided user profile and generate a step-by-step learning path.

  User Profile: {{{profile}}}

  Labor Market Data (if available): {{{laborMarketData}}}

  Provide the output in both machine-readable JSON format and human-readable summaries in English and Hindi.
`,
});

const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async input => {
    // In a real app, we'd generate a real UUID
    const userId = "user-" + Math.random().toString(36).substring(7);
    
    const {output} = await generatePersonalizedLearningPathPrompt(input);
    
    // Augment the output with server-generated data
    const finalOutput = {
      ...output!,
      user_id: userId,
      timestamp: new Date().toISOString(),
    };
    
    // Ensure the output matches the schema, especially for complex objects
    if(finalOutput.labour_market_signals && typeof finalOutput.labour_market_signals.avg_salary_inr === 'string') {
        const salaryString = finalOutput.labour_market_signals.avg_salary_inr as string;
        finalOutput.labour_market_signals.avg_salary_inr = parseInt(salaryString.replace(/[^0-9]/g, ''), 10) || 0;
    }

    if (finalOutput.nsqf_mapping.length > 0 && typeof finalOutput.nsqf_mapping[0].nsqf_level === 'string') {
      finalOutput.nsqf_mapping.forEach(m => {
        m.nsqf_level = parseInt(m.nsqf_level as string, 10) || 0;
      });
    }


    return finalOutput;
  }
);
