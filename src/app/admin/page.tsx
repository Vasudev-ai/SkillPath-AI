import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import { Header } from '@/components/layout/header';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-4 px-4 md:px-6 w-full border-b">
        <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold font-headline text-foreground">
              Trainer & Policymaker Panel
            </h1>
        </div>
      </header>
      <main className="flex-1 bg-muted/20">
        <AnalyticsDashboard />
      </main>
    </div>
  );
}
