# SkillPath AI - Your Vernacular Career GPS

![SkillPath AI Landing Page](https://i.imgur.com/your-screenshot.png) <!-- Replace with a real screenshot -->

**SkillPath AI** is an award-winning, AI-powered personalized learning path generator designed for India's vocational skilling ecosystem. It acts as a dynamic "Career GPS," guiding learners from their current status to their desired career goals with a clear, actionable, and NSQF-aligned roadmap.

Our mission is to democratize career guidance, making it personalized, data-driven, and accessible to every learner in India, regardless of their background or language.

## 🚀 The Problem

India’s skilling ecosystem is vast, but learners often struggle to navigate it. Key challenges include:
- **Generic Pathways:** Most learning journeys are one-size-fits-all, failing to consider a learner's unique background, skills, and aspirations.
- **Skill Mismatch:** This leads to a significant gap between the skills learned and the skills demanded by the industry.
- **Lack of Guidance:** Learners lack a reliable, data-driven guide to help them make informed career decisions.

## ✨ Our Solution

SkillPath AI is an AI-first platform that provides a hyper-personalized, adaptive, and explainable learning journey for every user.

Our system:
1.  **Analyzes** a learner's complete profile (education, skills, aspirations).
2.  **Maps** their goals to real-time labor market data and NSQF-aligned qualifications.
3.  **Generates** a step-by-step learning path with specific courses, micro-credentials, and on-the-job training recommendations.
4.  **Guides** the learner through their journey with an interactive AI assistant.

---

## 🔥 Key Features

### 1. **Personalized Learning Path Generation**
The core of our platform. Our Genkit-powered AI engine analyzes user profiles to generate a unique, step-by-step learning path, complete with timelines, costs, and course recommendations from verified providers.

### 2. **SkillPath Mitra - The AI Assistant**
A friendly, interactive AI avatar that acts as a personal guide ("Mitra").
- **Conversational Summaries:** Uses Text-to-Speech to provide warm, encouraging audio summaries of the user's path in their chosen language (English or Hindi).
- **Proactive Reminders:** Highlights the next crucial skill to focus on.
- **Celebrates Success:** Uses on-screen effects like confetti to celebrate milestones, making the journey engaging.

### 3. **AI-Powered Mock Interviews**
To ensure job-readiness, learners can practice for interviews at any stage.
- **Realistic Simulation:** The AI acts as a hiring manager, asking relevant technical and behavioral questions based on the course.
- **Video Practice Environment:** The user sees their own webcam feed during the interview, simulating a real video call and allowing them to practice their body language and presentation skills.

### 4. **Explainable AI (XAI)**
We build trust by making our AI transparent. For every recommendation, the user can see a clear, simple explanation of *why* a particular course was chosen for them, linking it back to their profile and career goals.

### 5. **Analytics Dashboard for Trainers & Policymakers**
A dedicated `/admin` panel provides a high-level overview of the skilling ecosystem, with visualizations for:
- Learner Growth Trends
- NSQF Level Adoption Rates
- Top Career Aspirations & Common Skill Gaps

### 6. **Multilingual and Accessible**
The entire learner-facing dashboard is available in both **English** and **Hindi**. The use of audio summaries from our AI Mitra also makes the platform more accessible.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI & Generative UI:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **AI Models:** Google Gemini 2.5 Flash, Gemini TTS, Imagen
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en) (v20 or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/skillpath-ai.git
cd skillpath-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project and add your Google AI API Key:
```
GEMINI_API_KEY=your_google_ai_api_key
```

### 4. Run the Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

### 5. Run the Genkit Inspector (Optional)
To inspect and debug your AI flows, run the Genkit inspector in a separate terminal:
```bash
npm run genkit:watch
```
This will start the inspector on `http://localhost:4000`.

---

## 📂 Project Structure

```
.
├── src
│   ├── app                 # Next.js App Router pages (UI)
│   │   ├── (main)          # Main application routes
│   │   ├── admin           # Policymaker dashboard
│   │   └── onboarding      # User onboarding flow
│   ├── ai                  # All Genkit-related code
│   │   ├── flows           # Core AI logic for generation, TTS, etc.
│   │   └── genkit.ts       # Genkit initialization
│   ├── components          # Reusable React components
│   │   ├── dashboard       # Components for the learner dashboard
│   │   ├── layout          # Header, Footer, etc.
│   │   └── ui              # ShadCN UI components
│   ├── lib                 # Shared utilities, types, and data
│   └── hooks               # Custom React hooks
└── package.json
```
