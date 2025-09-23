'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/header';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>Enter your email to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <Link href="/onboarding" legacyBehavior>
                <Button className="w-full" asChild>
                  <a>
                    Continue with Email <ArrowRight className="ml-2" />
                  </a>
                </Button>
              </Link>
            </div>
            <div className="mt-4 text-center text-sm">
              New to SkillPath?{' '}
              <Link href="/onboarding" className="underline font-medium text-primary">
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
