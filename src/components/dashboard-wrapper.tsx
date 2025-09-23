'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LearningPath } from '@/lib/types';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from './ui/card';

export function DashboardWrapper() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedPath = localStorage.getItem('learningPath');
    if (storedPath) {
      try {
        setPath(JSON.parse(storedPath));
      } catch (e) {
        console.error('Failed to parse learning path from localStorage', e);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  if (loading || !path) {
    return (
      <div className="min-h-screen bg-background">
        <Header lang={lang} setLang={setLang} showToggle={false} />
        <main className="container mx-auto p-4 md:p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="pt-6">
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-1">
        <DashboardClient path={path} lang={lang} />
      </main>
    </div>
  );
}
