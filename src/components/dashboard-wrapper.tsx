'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LearningPath, UserProfile } from '@/lib/types';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { Header } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { OnboardingForm } from './onboarding/onboarding-form';
import { generatePathAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export function DashboardWrapper() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const storedPath = localStorage.getItem('learningPath');
    
    if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
    } else {
        // If no profile, they shouldn't be here.
        router.push('/login');
        return;
    }

    if (storedPath) {
      try {
        const parsedPath = JSON.parse(storedPath);
        // Check if the path belongs to the current user
        if (parsedPath.user_id === JSON.parse(storedProfile).email) {
            setPath(parsedPath);
        } else {
            // Clear stale path from a different user
            localStorage.removeItem('learningPath');
        }
      } catch (e) {
        console.error('Failed to parse learning path from localStorage', e);
        localStorage.removeItem('learningPath');
      }
    }
    setLoading(false);
  }, [router]);

  const handleGeneratePath = async (profileData: UserProfile) => {
    setGenerating(true);
    const result = await generatePathAction(profileData);
    if (result.path) {
        const pathWithUser = {...result.path, user_id: profileData.email };
        localStorage.setItem('learningPath', JSON.stringify(pathWithUser));
        setPath(pathWithUser);
        setShowForm(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating Path',
            description: result.error || 'An unknown error occurred.',
        });
    }
    setGenerating(false);
  };

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-muted/20">
        <Header lang={lang} setLang={setLang} showToggle={false} />
        <main className="container mx-auto p-4 md:p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/3 rounded-lg" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
              <Card><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
              <Card><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
            <Card><CardContent className="pt-6"><Skeleton className="h-96 w-full" /></CardContent></Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-1">
        {path ? (
          <DashboardClient path={path} lang={lang} userProfile={userProfile} />
        ) : (
          <div className="container mx-auto p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
            <Card className="max-w-2xl w-full glass-card">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-headline text-primary">Welcome, {userProfile?.name}!</CardTitle>
                <CardDescription className="text-lg">
                  You're all set up. Let's create your personalized career roadmap.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <p className="text-muted-foreground text-center">Answer a few questions about your skills and goals, and our AI will build a custom learning path just for you.</p>
                <Button size="lg" onClick={() => setShowForm(true)} disabled={generating}>
                  {generating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Your Learning Path <ArrowRight className="ml-2" />
                    </>
                  )}
                </Button>

                {showForm && userProfile && (
                    <div className='w-full pt-8'>
                        <OnboardingForm 
                            lang={lang} 
                            userProfile={userProfile}
                            onSubmit={handleGeneratePath} 
                            isLoading={generating}
                        />
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
