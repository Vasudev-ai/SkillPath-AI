'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Shield, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const storedUser = localStorage.getItem('userProfile');
    if (storedUser) {
      const userProfile = JSON.parse(storedUser);
      if (userProfile.email === values.email && userProfile.password === values.password) {
        // A user with a valid login should always go to the dashboard.
        // The dashboard itself will handle whether to show the path or the prompt to create one.
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Credentials',
          description: 'The email or password you entered is incorrect.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'No Account Found',
        description: 'Please create an account first.',
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-headline">Learner Login</CardTitle>
              <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <User className="mr-2" /> Login as Learner
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                New to SkillPath?{' '}
                <Link href="/onboarding" className="underline font-medium text-primary">
                  Create an account
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg font-headline">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
                <Link href="/admin">
                    <Button variant="secondary" className="w-full">
                        <Shield className="mr-2" /> Login as Trainer/Admin
                    </Button>
                </Link>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
