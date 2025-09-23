import { LandingPage } from '@/components/landing-page';
import { Header } from '@/components/layout/header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header showLoginButton />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
}
