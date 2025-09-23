'use client';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { OnboardingForm } from '@/components/onboarding/onboarding-form';

export function OnboardingWrapper() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} setLang={setLang} showToggle={false} />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <OnboardingForm lang={lang} />
      </main>
    </div>
  );
}
