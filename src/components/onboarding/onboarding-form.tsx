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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  education: z.string(),
  skills: z.string(),
  aspirations: z.string(),
  consent: z.boolean(),
});

const pathGenSchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    education: z.string().min(10, { message: 'Please describe your education.' }),
    skills: z.string().min(5, { message: 'Please list some of your skills.' }),
    aspirations: z.string().min(10, { message: 'What are your career aspirations?' }),
    consent: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms to proceed.',
    }),
});


const content = {
    en: {
        title: "Create Your Account",
        subtitle: "Join SkillPath AI to start your personalized career journey.",
        path_title: "Build Your Learning Path",
        path_subtitle: "Fill out your profile to get a personalized, AI-powered career path.",
        name: "Full Name",
        name_placeholder: "e.g., Anjali Sharma",
        email: "Email Address",
        email_placeholder: "you@example.com",
        password: "Password",
        password_placeholder: "••••••••",
        education: "Highest Education",
        education_placeholder: "e.g., 12th Pass (Science), B.Com Graduate",
        skills: "Current Skills",
        skills_placeholder: "e.g., MS Office, Basic Python, Good communication",
        aspirations: "Career Aspirations",
        aspirations_placeholder: "e.g., I want to become a data analyst in a tech company.",
        consent_label: "I consent to my data being used to generate a personalized learning path.",
        submit_button: "Generate Path",
        signup_button: "Create Account",
        loading_text: "Our AI is crafting your path...",
        error_title: "Uh oh! Something went wrong.",
        prev_button: "Previous",
        next_button: "Next",
    },
    hi: {
        title: "अपना खाता बनाएं",
        subtitle: "अपनी व्यक्तिगत करियर यात्रा शुरू करने के लिए स्किलपाथ एआई से जुड़ें।",
        path_title: "अपनी सीखने की राह बनाएं",
        path_subtitle: "एक व्यक्तिगत, एआई-संचालित करियर पथ प्राप्त करने के लिए अपनी प्रोफ़ाइल भरें।",
        name: "पूरा नाम",
        name_placeholder: "उदाहरण, अंजलि शर्मा",
        email: "ईमेल पता",
        email_placeholder: "you@example.com",
        password: "पासवर्ड",
        password_placeholder: "••••••••",
        education: "उच्चतम शिक्षा",
        education_placeholder: "उदाहरण, 12वीं पास (विज्ञान), बी.कॉम स्नातक",
        skills: "वर्तमान कौशल",
        skills_placeholder: "उदाहरण, एमएस ऑफिस, बेसिक पाइथन, अच्छा संचार",
        aspirations: "करियर आकांक्षाएं",
        aspirations_placeholder: "उदाहरण, मैं एक टेक कंपनी में डेटा विश्लेषक बनना चाहता हूं।",
        consent_label: "मैं व्यक्तिगत सीखने का मार्ग बनाने के लिए अपने डेटा के उपयोग के लिए सहमति देता हूं।",
        submit_button: "पथ बनाएं",
        signup_button: "खाता बनाएं",
        loading_text: "हमारा एआई आपके लिए रास्ता बना रहा है...",
        error_title: "उफ़! कुछ गलत हो गया।",
        prev_button: "पिछला",
        next_button: "अगला",
    }
}

type OnboardingFormProps = {
    lang?: 'en' | 'hi';
    userProfile?: UserProfile;
    onSubmit?: (values: UserProfile) => void;
    isLoading?: boolean;
}


export function OnboardingForm({ lang = 'en', userProfile, onSubmit, isLoading = false }: OnboardingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const isSignupFlow = !userProfile;
  const [step, setStep] = useState(0);


  const form = useForm<z.infer<typeof pathGenSchema>>({
    resolver: zodResolver(isSignupFlow ? signupSchema : pathGenSchema),
    defaultValues: {
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      password: '',
      education: userProfile?.education || '',
      skills: userProfile?.skills || '',
      aspirations: userProfile?.aspirations || '',
      consent: false,
    },
  });

  const totalSteps = isSignupFlow ? 3 : 4;
  const progress = ((step + 1) / totalSteps) * 100;

  async function handleSubmit(values: z.infer<typeof pathGenSchema>) {
    if(isSignupFlow) {
        const { consent, ...profileData } = values;
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        toast({
            title: "Account Created!",
            description: "Redirecting you to the dashboard...",
        });
        // We log them in and send to dashboard to generate path
        router.push('/dashboard');
    } else if (onSubmit && userProfile) {
        const { password, consent, ...profileData } = values;
        onSubmit(profileData as UserProfile);
    }
  }

  const t = content[lang];
  
  const nextStep = async () => {
    let fields: (keyof z.infer<typeof pathGenSchema>)[] = [];
    if(isSignupFlow) {
        if (step === 0) fields = ["name", "email"];
        if (step === 1) fields = ["password"];
    } else {
        if (step === 0) fields = ["education"];
        if (step === 1) fields = ["skills"];
        if (step === 2) fields = ["aspirations"];
    }

    const isValid = await form.trigger(fields as any);
    if(isValid) {
        setStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  }

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));
  
  const renderSignupSteps = () => {
      switch(step) {
          case 0: return (
            <>
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>{t.name}</FormLabel><FormControl><Input placeholder={t.name_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
            </>
          );
          case 1: return (
              <>
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>{t.email}</FormLabel><FormControl><Input placeholder={t.email_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
              </>
          );
          case 2: return (
            <>
                <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>{t.password}</FormLabel><FormControl><Input type="password" placeholder={t.password_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="consent" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t.consent_label}</FormLabel><FormMessage /></div></FormItem>)} />
            </>
          );
          default: return null;
      }
  }

  const renderPathGenSteps = () => {
      switch(step) {
          case 0: return <FormField control={form.control} name="education" render={({ field }) => (<FormItem><FormLabel>{t.education}</FormLabel><FormControl><Textarea placeholder={t.education_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />;
          case 1: return <FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel>{t.skills}</FormLabel><FormControl><Textarea placeholder={t.skills_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />;
          case 2: return <FormField control={form.control} name="aspirations" render={({ field }) => (<FormItem><FormLabel>{t.aspirations}</FormLabel><FormControl><Textarea placeholder={t.aspirations_placeholder} {...field} /></FormControl><FormMessage /></FormItem>)} />;
          case 3: return <FormField control={form.control} name="consent" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-background/50"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>{t.consent_label}</FormLabel><FormMessage /></div></FormItem>)} />;
          default: return null;
      }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto w-full"
    >
      <Card className={isSignupFlow ? "glass-card" : "bg-transparent border-0 shadow-none"}>
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{isSignupFlow ? t.title : t.path_title}</CardTitle>
          <CardDescription>{isSignupFlow ? t.subtitle : t.path_subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-8 h-2" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <motion.div
                    key={step}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 min-h-[150px]"
                >
                    {isSignupFlow ? renderSignupSteps() : renderPathGenSteps()}
                </motion.div>

                <div className="flex justify-between pt-4">
                    {step > 0 && !isLoading && (
                        <Button type="button" variant="outline" onClick={prevStep}>
                            {t.prev_button}
                        </Button>
                    )}
                    <div className='flex-grow' />
                    {step < totalSteps - 1 && !isLoading && (
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
                        isSignupFlow ? t.signup_button : t.submit_button
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
