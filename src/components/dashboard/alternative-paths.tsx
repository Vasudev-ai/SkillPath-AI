import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import type { LearningPath } from '@/lib/types';

interface AlternativePathsProps {
  paths: LearningPath['alternative_paths'];
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Alternative Paths"
    },
    hi: {
        title: "वैकल्पिक रास्ते"
    }
}

export function AlternativePaths({ paths, lang }: AlternativePathsProps) {
  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Zap className="text-accent" />
          {content[lang].title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paths && paths.length > 0 ? (
          <ul className="space-y-3">
            {paths.map((path, index) => (
              <li key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-foreground">{path}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No alternative paths available.</p>
        )}
      </CardContent>
    </Card>
  );
}
