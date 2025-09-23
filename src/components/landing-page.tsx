'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, BrainCircuit, LineChart, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-card p-6 text-center">
    <div className="inline-block bg-accent/20 text-accent p-3 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-headline font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);


export function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4">
            Chart Your Career with SkillPath AI
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
            India's first vernacular Career GPS, dynamically syncing your learning journey with live job market opportunities.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="text-lg">
              Generate Your Free Path
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Why SkillPath AI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <FeatureCard 
                icon={<Target size={32} />}
                title="Hyper-Personalized Paths"
                description="AI-driven recommendations based on your unique skills, goals, and constraints, aligned with the NSQF framework."
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <FeatureCard 
                icon={<LineChart size={32} />}
                title="Live Market Sync"
                description="Our paths adapt to real-time job market data, ensuring your skills are always in demand."
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <FeatureCard 
                icon={<BrainCircuit size={32} />}
                title="Explainable AI"
                description="Understand the 'why' behind every recommendation with clear, concise explanations for each step of your journey."
              />
            </motion.div>
          </div>
        </div>
      </section>
      
       {/* Call to Action */}
       <section className="py-20 text-center">
            <div className='container mx-auto'>
                <h2 className="text-3xl font-bold font-headline mb-4">Ready to find your path?</h2>
                <p className="text-muted-foreground mb-8">It takes less than 5 minutes to get your personalized career roadmap.</p>
                <Link href="/onboarding">
                    <Button size="lg">
                    Start Building Your Future
                    <ArrowRight className="ml-2" />
                    </Button>
                </Link>
            </div>
       </section>

    </div>
  );
}
