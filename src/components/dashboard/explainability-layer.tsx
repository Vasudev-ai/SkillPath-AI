import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Lightbulb } from 'lucide-react';

interface ExplainabilityLayerProps {
  explanation: string;
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Why is this recommended?"
    },
    hi: {
        title: "यह अनुशंसित क्यों है?"
    }
}

export function ExplainabilityLayer({ explanation, lang }: ExplainabilityLayerProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-sm font-semibold text-primary hover:no-underline">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            {content[lang].title}
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground bg-background p-4 rounded-md">
          {explanation}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
