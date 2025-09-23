import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { Header } from '@/components/layout/header';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header showLoginButton={false} showToggle={false} />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <OnboardingForm />
      </main>
    </div>
  );
}
