'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { generatePathAction } from '@/app/actions';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  education: z.string().min(10, { message: 'Please describe your education.' }),
  skills: z.string().min(5, { message: 'Please list some of your skills.' }),
  aspirations: z.string().min(10, { message: 'What are your career aspirations?' }),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms to proceed.',
  }),
});

const content = {
    en: {
        title: "Let's build your future.",
        subtitle: "Fill out your profile to get a personalized, AI-powered career path.",
        name: "Full Name",
        name_placeholder: "e.g., Anjali Sharma",
        email: "Email Address",
        email_placeholder: "you@example.com",
        education: "Highest Education",
        education_placeholder: "e.g., 12th Pass (Science), B.Com Graduate",
        skills: "Current Skills",
        skills_placeholder: "e.g., MS Office, Basic Python, Good communication",
        aspirations: "Career Aspirations",
        aspirations_placeholder: "e.g., I want to become a data analyst in a tech company.",
        consent_label: "I consent to my data being used to generate a personalized learning path.",
        submit_button: "Generate My Path",
        loading_text: "Our AI is crafting your path...",
        error_title: "Uh oh! Something went wrong.",
        prev_button: "Previous",
        next_button: "Next",
    },
    hi: {
        title: "आइए आपका भविष्य बनाएं।",
        subtitle: "एक व्यक्तिगत, एआई-संचालित करियर पथ प्राप्त करने के लिए अपनी प्रोफ़ाइल भरें।",
        name: "पूरा नाम",
        name_placeholder: "उदाहरण, अंजलि शर्मा",
        email: "ईमेल पता",
        email_placeholder: "you@example.com",
        education: "उच्चतम शिक्षा",
        education_placeholder: "उदाहरण, 12वीं पास (विज्ञान), बी.कॉम स्नातक",
        skills: "वर्तमान कौशल",
        skills_placeholder: "उदाहरण, एमएस ऑफिस, बेसिक पाइथन, अच्छा संचार",
        aspirations: "करियर आकांक्षाएं",
        aspirations_placeholder: "उदाहरण, मैं एक टेक कंपनी में डेटा विश्लेषक बनना चाहता हूं।",
        consent_label: "मैं व्यक्तिगत सीखने का मार्ग बनाने के लिए अपने डेटा के उपयोग के लिए सहमति देता हूं।",
        submit_button: "मेरा रास्ता बनाएं",
        loading_text: "हमारा एआई आपके लिए रास्ता बना रहा है...",
        error_title: "उफ़! कुछ गलत हो गया।",
        prev_button: "पिछला",
        next_button: "अगला",
    }
}


export function OnboardingForm({ lang }: { lang: 'en' | 'hi' }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      education: '',
      skills: '',
      aspirations: '',
      consent: false,
    },
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const { consent, ...profileData } = values;
    const profile: UserProfile = profileData;
    
    const result = await generatePathAction(profile);

    if (result.path) {
      localStorage.setItem('learningPath', JSON.stringify(result.path));
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: content[lang].error_title,
        description: result.error || 'An unknown error occurred.',
      });
      setIsLoading(false);
    }
  }

  const t = content[lang];
  
  const nextStep = async () => {
    let fields: ("name" | "email" | "education" | "skills" | "aspirations")[] = [];
    if (step === 0) fields = ["name"];
    if (step === 1) fields = ["email"];
    if (step === 2) fields = ["education"];
    if (step === 3) fields = ["skills"];

    const isValid = await form.trigger(fields);
    if(isValid) {
        setStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  }

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.name}</FormLabel>
                <FormControl>
                  <Input placeholder={t.name_placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 1:
        return (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  <Input placeholder={t.email_placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 2:
        return (
          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.education}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t.education_placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 3:
        return (
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.skills}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t.skills_placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      case 4:
        return (
          <>
            <FormField
              control={form.control}
              name="aspirations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t.aspirations}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t.aspirations_placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm mt-8">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t.consent_label}</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </>
        );
      default:
        return null;
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-8" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <motion.div
                    key={step}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                >
                    {renderStep()}
                </motion.div>

                <div className="flex justify-between pt-4">
                {step > 0 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                        {t.prev_button}
                    </Button>
                )}
                <div className='flex-grow' />
                {step < totalSteps - 1 && (
                    <Button type="button" onClick={nextStep}>
                        {t.next_button}
                    </Button>
                )}
                {step === totalSteps - 1 && (
                    <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.loading_text}
                      </>
                    ) : (
                      t.submit_button
                    )}
                  </Button>
                )}

              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
