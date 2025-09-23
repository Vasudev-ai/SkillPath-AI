'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Languages, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeaderProps = {
  lang?: 'en' | 'hi';
  setLang?: (lang: 'en' | 'hi') => void;
  showToggle?: boolean;
  showLoginButton?: boolean;
};

export function Header({ lang = 'en', setLang, showToggle = true, showLoginButton = false }: HeaderProps) {
  const handleLanguageToggle = () => {
    if (setLang) {
      setLang(lang === 'en' ? 'hi' : 'en');
    }
  };

  return (
    <header className={cn(
      "py-4 px-4 md:px-6 w-full",
      "sticky top-0 z-50 bg-background/30 backdrop-blur-lg border-b border-white/10"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
          <h1 className="text-xl font-bold font-headline text-foreground group-hover:text-primary transition-colors">
            SkillPath AI
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          {showToggle && (
            <Button
              variant="ghost"
              onClick={handleLanguageToggle}
              aria-label="Toggle language"
              className='flex items-center gap-2'
            >
              <Languages className="h-5 w-5" />
              <span className="uppercase text-xs font-bold">{lang === 'en' ? 'HI' : 'EN'}</span>
            </Button>
          )}
          {showLoginButton && (
             <Link href="/login">
                <Button variant="default">
                    Login / Sign Up
                    <LogIn className='ml-2'/>
                </Button>
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}
