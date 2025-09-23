import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, GraduationCap } from 'lucide-react';
import type { LearningPath } from '@/lib/types';
import { nsqfCourses } from '@/lib/data';
import { ExplainabilityLayer } from './explainability-layer';
import { Badge } from '../ui/badge';

interface RecommendedPathProps {
  path: LearningPath;
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Your Recommended Path",
        subtitle: "A step-by-step guide to achieving your career goals.",
        level: "NSQF Level",
        action: "Enroll Now",
        goal: "Career Goal Achieved!"
    },
    hi: {
        title: "आपकी अनुशंसित राह",
        subtitle: "अपने करियर लक्ष्यों को प्राप्त करने के लिए एक कदम-दर-कदम मार्गदर्शिका।",
        level: "एनएसक्यूएफ स्तर",
        action: "अभी पंजीकरण करें",
        goal: "करियर लक्ष्य प्राप्त हुआ!"
    }
}

export function RecommendedPath({ path, lang }: RecommendedPathProps) {
  
  const pathWithDetails = path.nsqf_mapping.map((step, index) => {
    const course = nsqfCourses.find(c => c.course_id === step.course_id);
    
    return {
      course: course || { 
        title: step.course_id, 
        nsqf_level: step.nsqf_level, 
        provider: step.provider,
      },
      explanation: path.explainability[index] || "No explanation available.",
      action: path.next_actions[index] || { label: content[lang].action },
    };
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">{content[lang].title}</CardTitle>
        <CardDescription>{content[lang].subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-9 top-0 h-full w-0.5 bg-border" />

          <div className="space-y-8">
            {pathWithDetails.map((step, index) => (
              <div key={index} className="relative flex items-start">
                <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="font-bold">{index + 1}</span>
                </div>
                <div className="ml-12 w-full">
                  <Card className="bg-card">
                    <CardHeader>
                      <div className='flex justify-between items-start'>
                        <div>
                          <CardTitle className="text-lg font-semibold">{step.course.title}</CardTitle>
                          <CardDescription>{step.course.provider}</CardDescription>
                        </div>
                        <Badge variant="outline">{content[lang].level} {step.course.nsqf_level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ExplainabilityLayer explanation={step.explanation} lang={lang} />
                      <Button className="mt-4 w-full sm:w-auto">
                        {step.action.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
             <div className="relative flex items-start">
                <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div className="ml-12 pt-1">
                    <h3 className="text-lg font-bold font-headline text-foreground">{content[lang].goal}</h3>
                </div>
              </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
