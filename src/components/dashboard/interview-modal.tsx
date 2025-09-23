'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { InterviewMessage } from '@/lib/types';
import { interviewAction } from '@/app/actions';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface InterviewModalProps {
  courseTitle: string | null;
  onClose: () => void;
  lang: 'en' | 'hi';
}

const content = {
    en: {
        title: "Practice Interview",
        description: "Your AI coach will ask you a few questions related to",
        placeholder: "Type your answer here...",
        send: "Send",
        end: "End Interview",
        error_title: "Interview Error"
    },
    hi: {
        title: "साक्षात्कार का अभ्यास करें",
        description: "आपका AI कोच आपसे संबंधित कुछ प्रश्न पूछेगा",
        placeholder: "अपना उत्तर यहां लिखें...",
        send: "भेजें",
        end: "साक्षात्कार समाप्त करें",
        error_title: "साक्षात्कार में त्रुटि"
    }
}

export function InterviewModal({ courseTitle, onClose, lang }: InterviewModalProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const t = content[lang];

  useEffect(() => {
    // When the modal opens with a new course title, start the interview
    if (courseTitle) {
      setMessages([]);
      setIsLoading(true);
      interviewAction(courseTitle, [])
        .then(res => {
          if (res.response) {
            setMessages([{ role: 'model', content: res.response }]);
          } else if(res.error) {
            toast({ variant: 'destructive', title: t.error_title, description: res.error });
            onClose();
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [courseTitle, onClose, toast, t.error_title]);
  
  useEffect(() => {
    // Scroll to bottom when a new message is added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !courseTitle) return;

    const newMessages: InterviewMessage[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        const result = await interviewAction(courseTitle, newMessages);
        if (result.response) {
            setMessages(prev => [...prev, { role: 'model', content: result.response }]);
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
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col glass-card p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="font-headline text-primary">{t.title}</DialogTitle>
          <DialogDescription>
            {t.description} '{courseTitle}'.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef as any}>
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
                 {isLoading && messages.length === 0 && (
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
                    disabled={isLoading}
                    className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
