import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, MapPin, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LearningPath } from '@/lib/types';

interface LabourMarketSignalsProps {
  signals: LearningPath['labour_market_signals'];
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Labour Market Signals",
        demand: "Demand Index",
        salary: "Average Salary",
        locations: "Top Locations"
    },
    hi: {
        title: "श्रम बाजार संकेत",
        demand: "मांग सूचकांक",
        salary: "औसत वेतन",
        locations: "शीर्ष स्थान"
    }
}

export function LabourMarketSignals({ signals, lang }: LabourMarketSignalsProps) {
  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(salary) + ' per annum';
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <TrendingUp className="text-primary" />
          {content[lang].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start">
          <IndianRupee className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
          <div>
            <h4 className="font-semibold">{content[lang].salary}</h4>
            <p className="text-lg font-bold text-primary">{signals.avg_salary_inr ? formatSalary(signals.avg_salary_inr) : 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <TrendingUp className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
          <div>
            <h4 className="font-semibold">{content[lang].demand}</h4>
            <p className="text-lg font-bold text-primary">{signals.demand_index ? `${signals.demand_index.toFixed(0)}%` : 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start">
          <MapPin className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
          <div>
            <h4 className="font-semibold">{content[lang].locations}</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {(signals.top_locations as string[])?.length > 0 ? (
                (signals.top_locations as string[]).map((loc: string) => (
                  <Badge key={loc} variant="secondary">{loc}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Not available</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
