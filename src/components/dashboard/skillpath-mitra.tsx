'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, X, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { textToSpeechAction } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '../ui/card';

interface SkillPathMitraProps {
  summary: string;
  lang: 'en' | 'hi';
}

const content = {
  en: {
    welcome: 'Welcome! I am your SkillPath Mitra. Here is a summary of your path.',
    cta: 'Click me to listen!',
    error_title: 'Audio Generation Failed',
  },
  hi: {
    welcome: 'नमस्ते! मैं आपका स्किलपाथ मित्र हूं। यह आपके रास्ते का सारांश है।',
    cta: 'सुनने के लिए क्लिक करें!',
    error_title: 'ऑडियो बनाने में विफल',
  },
};

export function SkillPathMitra({ summary, lang }: SkillPathMitraProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const t = content[lang];
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

  useEffect(() => {
    // Reset state when summary or lang changes
    setIsLoading(false);
    setIsPlaying(false);
    setAudioDataUri(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [summary, lang]);

  const handlePlayPause = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioDataUri && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    
    // Make the AI summary more conversational
    const textToConvert = `Hello! My name is SkillPath Mitra, your personal AI guide. Based on your profile, I have generated a learning path for you. Here is a quick summary: ${summary}`;
    const hindiTextToConvert = `नमस्ते! मेरा नाम स्किलपाथ मित्र है, आपका व्यक्तिगत AI गाइड। आपकी प्रोफ़ाइल के आधार पर, मैंने आपके लिए एक सीखने का मार्ग तैयार किया है। यहाँ एक संक्षिप्त सारांश है: ${summary}`;

    const result = await textToSpeechAction(lang === 'hi' ? hindiTextToConvert : textToConvert);
    setIsLoading(false);

    if (result.audioDataUri) {
      setAudioDataUri(result.audioDataUri);
      // Use a timeout to allow the state to update and the audio element to be rendered
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      }, 0);
    } else {
      toast({
        variant: 'destructive',
        title: t.error_title,
        description: result.error,
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const toggleMitra = () => {
      setIsOpen(!isOpen);
      if(isPlaying && audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
      }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {isOpen && (
             <motion.div
             initial={{ opacity: 0, y: 20, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 20, scale: 0.9 }}
             transition={{ duration: 0.2, ease: 'easeOut' }}
             className="w-80"
           >
             <Card className="glass-card mb-4 shadow-2xl">
               <CardHeader className='flex-row items-center gap-3 p-4'>
                 <Avatar className="h-12 w-12 border-2 border-primary">
                    {avatarImage ? (
                        <AvatarImage src={avatarImage.imageUrl} alt="SkillPath Mitra" />
                    ) : (
                        <AvatarFallback><Bot /></AvatarFallback>
                    )}
                 </Avatar>
                 <div className='flex-1'>
                    <h3 className='font-bold text-foreground'>SkillPath Mitra</h3>
                    <p className='text-xs text-muted-foreground'>{t.welcome}</p>
                 </div>
               </CardHeader>
               <CardContent className="p-4 pt-0">
                 <Button onClick={handlePlayPause} className="w-full">
                   {isLoading ? (
                     <Loader2 className="animate-spin" />
                   ) : isPlaying ? (
                    <> <Pause className="mr-2"/> Pause</>
                   ) : (
                    <> <Play className="mr-2"/> Play Summary </>
                   )}
                 </Button>
               </CardContent>
             </Card>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={toggleMitra}
            size="icon"
            className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X size={32} />
                </motion.div>
              ) : (
                <motion.div key="avatar" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}>
                   <Avatar className="w-14 h-14 border-2 border-primary-foreground/50">
                    {avatarImage ? (
                        <AvatarImage src={avatarImage.imageUrl} alt="SkillPath Mitra" />
                    ) : (
                        <AvatarFallback><Bot /></AvatarFallback>
                    )}
                 </Avatar>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      {audioDataUri && (
        <audio
          ref={audioRef}
          src={audioDataUri}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          hidden
        />
      )}
    </>
  );
}
