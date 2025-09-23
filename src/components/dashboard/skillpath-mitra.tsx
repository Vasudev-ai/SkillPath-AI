'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Pause, Volume2, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { textToSpeechAction } from '@/app/actions';

interface SkillPathMitraProps {
  summary: string;
  lang: 'en' | 'hi';
}

const content = {
  en: {
    welcome: 'Welcome! I am your SkillPath Mitra. Here is a summary of your path. Click play to listen.',
    error_title: 'Audio Generation Failed',
  },
  hi: {
    welcome: 'नमस्ते! मैं आपका स्किलपाथ मित्र हूं। यह आपके रास्ते का सारांश है। सुनने के लिए प्ले पर क्लिक करें।',
    error_title: 'ऑडियो बनाने में विफल',
  },
};

export function SkillPathMitra({ summary, lang }: SkillPathMitraProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const t = content[lang];
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

  useEffect(() => {
    // Reset state when summary or lang changes
    setIsLoading(false);
    setIsPlaying(false);
    setAudioDataUri(null);
    if(audioRef.current){
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
    const textToConvert = lang === 'hi' ? summary : `Hello! Here is a summary of your personalized learning path. ${summary}`;
    const result = await textToSpeechAction(textToConvert);
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

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border glass-card">
      <Avatar className="h-16 w-16 border-2 border-primary shadow-lg">
        {avatarImage ? (
            <AvatarImage src={avatarImage.imageUrl} alt="SkillPath Mitra" />
        ) : (
            <AvatarFallback>
                <Bot />
            </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{t.welcome}</p>
      </div>
      <Button onClick={handlePlayPause} size="icon" className="rounded-full w-12 h-12 flex-shrink-0">
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </Button>
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
    </div>
  );
}
