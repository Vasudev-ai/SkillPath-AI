import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeaderProps = {
  lang: 'en' | 'hi';
  setLang: (lang: 'en' | 'hi') => void;
  showToggle?: boolean;
};

export function Header({ lang, setLang, showToggle = true }: HeaderProps) {
  return (
    <header className={cn(
      "py-4 px-4 md:px-6 w-full border-b",
      "sticky top-0 z-50 bg-background/80 backdrop-blur-sm"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo />
          <h1 className="text-xl font-bold font-headline text-foreground group-hover:text-primary transition-colors">
            SkillPath AI
          </h1>
        </Link>
        {showToggle && (
          <Button
            variant="ghost"
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            aria-label="Toggle language"
            className='flex items-center gap-2'
          >
            <Languages className="h-5 w-5" />
            <span className="uppercase text-xs font-bold">{lang === 'en' ? 'HI' : 'EN'}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
