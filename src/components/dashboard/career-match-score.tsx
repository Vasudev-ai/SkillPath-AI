'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface CareerMatchScoreProps {
  score: number;
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Career Match Score",
        description: "Based on your profile"
    },
    hi: {
        title: "करियर मैच स्कोर",
        description: "आपकी प्रोफ़ाइल के आधार पर"
    }
}

export function CareerMatchScore({ score, lang }: CareerMatchScoreProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Target className="text-primary" />
          {content[lang].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="16"
            fill="transparent"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            stroke="hsl(var(--accent))"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold font-headline text-primary">
            {Math.round(score)}%
          </span>
          <span className="text-sm text-muted-foreground">{content[lang].description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
