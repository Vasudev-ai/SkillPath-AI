# **App Name**: SkillPath AI

## Core Features:

- AI-Powered Personalized Learning Path Generation: Generates personalized, NSQF-mapped career pathways based on user input, skill gaps, and labor market signals using a local LLM API as a tool.  Output includes career match score, NSQF mapping, skill gaps, alternative paths, labor market data, explainability, and next actions in both machine-readable JSON and human-readable summaries (Hindi & English).
- Multi-step Onboarding: Guides users through a multi-step onboarding process to collect data on education, skills, aspirations, budget, time, device, and constraints.
- Dashboard (Learner View): Presents key metrics like Career Match Score, Skill Gap Analysis, Recommended Path, Alternative Paths, and Next Actions via charts and timelines. Includes an export-to-PDF function (localized in Hindi/English).
- Explainability Layer: Provides detailed explanations for each recommended course step, including reasons, sources, and confidence levels, displayed in expandable cards.
- Multilingual Support: Offers content and UI in both Hindi and English, with a language toggle in the dashboard.
- Data Privacy and Consent Management: Implements a consent form with granular toggles for data usage and sharing with employers. Enforces PII encryption at rest and anonymizes data after 6 months.

## Style Guidelines:

- Primary color: Saffron (#FF9933) to represent energy, optimism, and knowledge.
- Background color: Light blue (#EBF4FA), a desaturated hue related to saffron, providing a clean and trustworthy feel.
- Accent color: Deep Blue (#3366FF) to convey trust, security, and a government-aligned feel.  This creates good contrast to the saffron, for clear calls to action.
- Headline font: 'Space Grotesk', a sans-serif for a modern and tech-forward feel. Body text: 'Inter' sans-serif.
- Use a set of clean, modern icons that complement the color scheme. The style is professional and trustworthy.
- Employs rounded cards and subtle shadows for a modern look with a mobile-first responsive design.
- Incorporate subtle animations for a smooth, modern UI experience, particularly when transitioning between onboarding steps or when generating a learning path.