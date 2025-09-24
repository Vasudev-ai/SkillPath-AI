'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { InterviewMessage } from '@/lib/types';
import { interviewAction } from '@/app/actions';
import { Bot, Loader2, Mic, MicOff, Send, User, VideoOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface InterviewModalProps {
  courseTitle: string | null;
  onClose: () => void;
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Practice Video Interview",
        description: "Your AI coach will ask you a few questions related to",
        placeholder: "Type or record your answer...",
        send: "Send",
        end: "End Interview",
        error_title: "Interview Error",
        camera_error_title: "Camera Access Required",
        camera_error_description: "Please enable camera permissions in your browser settings to use this feature.",
        speech_error_title: "Speech Recognition Error",
        speech_error_description: "Your browser does not support speech recognition.",
        recording: "Recording... Click to stop.",
        start_recording: "Record Answer"
    },
    hi: {
        title: "वीडियो साक्षात्कार का अभ्यास करें",
        description: "आपका AI कोच आपसे संबंधित कुछ प्रश्न पूछेगा",
        placeholder: "अपना उत्तर टाइप करें या रिकॉर्ड करें...",
        send: "भेजें",
        end: "साक्षात्कार समाप्त करें",
        error_title: "साक्षात्कार में त्रुटि",
        camera_error_title: "कैमरा एक्सेस आवश्यक है",
        camera_error_description: "इस सुविधा का उपयोग करने के लिए कृपया अपनी ब्राउज़र सेटिंग्स में कैमरा अनुमति सक्षम करें।",
        speech_error_title: "भाषण पहचान में त्रुटि",
        speech_error_description: "आपका ब्राउज़र भाषण पहचान का समर्थन नहीं करता है।",
        recording: "रिकॉर्डिंग... रोकने के लिए क्लिक करें।",
        start_recording: "उत्तर रिकॉर्ड करें"
    }
}

export function InterviewModal({ courseTitle, onClose, lang }: InterviewModalProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null); // Using `any` for SpeechRecognition for wider browser support
  const { toast } = useToast();
  const t = content[lang];

  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }

  useEffect(() => {
    if (courseTitle) {
      // Setup Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setInput(finalTranscript + interimTranscript);
        };
        recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
        };

      } else {
        toast({
            variant: 'destructive',
            title: t.speech_error_title,
            description: t.speech_error_description,
        });
      }

      // Get camera permission and start interview
      const getCameraAndStart = async () => {
        try {
          setMessages([]);
          setHasCameraPermission(null);
          
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }

          setIsLoading(true);
          const res = await interviewAction(courseTitle, []);
          if (res.response) {
            setMessages([{ role: 'model', content: res.response }]);
            if (res.audioDataUri) {
                playAudio(res.audioDataUri);
            }
          } else if(res.error) {
            toast({ variant: 'destructive', title: t.error_title, description: res.error });
            onClose();
          }
          setIsLoading(false);

        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: t.camera_error_title,
            description: t.camera_error_description,
          });
        }
      };

      getCameraAndStart();
      
      return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        if(audioRef.current) {
            audioRef.current.pause();
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
      }
    }
  }, [courseTitle, onClose, toast, lang, t]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  const handleToggleRecording = () => {
    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    } else {
        recognitionRef.current?.start();
        setIsRecording(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !courseTitle) return;

    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }

    const newMessages: InterviewMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const result = await interviewAction(courseTitle, newMessages);
        if (result.response) {
            setMessages(prev => [...prev, { role: 'model', content: result.response }]);
            if (result.audioDataUri) {
                playAudio(result.audioDataUri);
            }
        } else if (result.error) {
            toast({ variant: 'destructive', title: t.error_title, description: result.error });
        }
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        toast({ variant: 'destructive', title: t.error_title, description: errorMessage });
    } finally {
        setIsLoading(false);
    }
  };

  const isOpen = courseTitle !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col glass-card p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="font-headline text-primary">{t.title}</DialogTitle>
          <DialogDescription>
            {t.description} '{courseTitle}'.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 grid md:grid-cols-2 overflow-hidden">
            <div className='relative flex flex-col items-center justify-center bg-black/50 p-4'>
                <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                        <VideoOff className="h-16 w-16 text-destructive mb-4"/>
                         <Alert variant="destructive">
                            <AlertTitle>{t.camera_error_title}</AlertTitle>
                            <AlertDescription>
                                {t.camera_error_description}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
                 {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                       <Loader2 className="h-16 w-16 animate-spin text-primary"/>
                       <p className='mt-4 text-muted-foreground'>Accessing camera...</p>
                    </div>
                )}
            </div>

            <div className='flex flex-col h-full'>
                <ScrollArea className="flex-1 px-6 pt-6" ref={scrollAreaRef as any}>
                    <div className='space-y-4 pr-4'>
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' && 'justify-end')}>
                                {msg.role === 'model' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback><Bot size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "p-3 rounded-2xl max-w-sm whitespace-pre-wrap",
                                    msg.role === 'model' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                                )}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <Avatar className="w-8 h-8 border">
                                        <AvatarFallback><User size={18} /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && messages.length > 0 && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 border">
                                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                                </Avatar>
                                <div className="p-3 rounded-2xl bg-muted">
                                    <Loader2 className="animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        {isLoading && hasCameraPermission && messages.length === 0 && (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="animate-spin text-primary" size={40}/>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-6 pt-2 border-t bg-background/50">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t.placeholder}
                            disabled={isLoading || hasCameraPermission !== true}
                            className="flex-1"
                        />
                         <Button 
                            type="button" 
                            size="icon" 
                            variant={isRecording ? "destructive" : "outline"}
                            onClick={handleToggleRecording} 
                            disabled={isLoading || hasCameraPermission !== true}
                            title={isRecording ? t.recording : t.start_recording}
                          >
                           {isRecording ? <MicOff /> : <Mic />}
                         </Button>
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim() || hasCameraPermission !== true} title={t.send}>
                            <Send />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
        <audio ref={audioRef} hidden />
      </DialogContent>
    </Dialog>
  );
}
