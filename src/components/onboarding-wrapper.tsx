'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { OnboardingForm } from '@/components/onboarding/onboarding-form';

export function OnboardingWrapper() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const router = useRouter();

  useEffect(() => {
    // If a user has already completed onboarding, redirect them to the dashboard
    const hasOnboarded = localStorage.getItem('learningPath');
    if (hasOnboarded) {
      router.replace('/dashboard');
    }
  }, [router]);


  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header lang={lang} setLang={setLang} />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <OnboardingForm lang={lang} />
      </main>
    </div>
  );
}
