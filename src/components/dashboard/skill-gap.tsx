import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';
import type { LearningPath } from '@/lib/types';

interface SkillGapProps {
  skills: LearningPath['skill_gap'];
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Skill Gap Analysis",
        description: "Skills to focus on:"
    },
    hi: {
        title: "कौशल अंतर विश्लेषण",
        description: "फोकस करने के लिए कौशल:"
    }
}

export function SkillGap({ skills, lang }: SkillGapProps) {
  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wrench className="text-primary" />
          {content[lang].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{content[lang].description}</p>
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map((skill, index) => (
              <Badge key={index} variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 text-sm py-1 px-3">
                {skill.skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No specific skill gaps identified. Your profile is well-rounded!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
