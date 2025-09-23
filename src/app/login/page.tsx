'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { ArrowRight, User, Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">SkillPath AI Demo</CardTitle>
            <CardDescription>Choose a role to log in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full">
                <User className="mr-2" /> Login as Learner
              </Button>
            </Link>
            <Link href="/admin" className="w-full">
              <Button variant="secondary" className="w-full">
                <Shield className="mr-2" /> Login as Trainer/Admin
              </Button>
            </Link>
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
