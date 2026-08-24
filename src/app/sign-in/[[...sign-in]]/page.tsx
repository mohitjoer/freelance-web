'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from "@/components/authLayout";
import PasswordInput from "@/components/PasswordInput";
import { authClient } from '@/lib/auth-client';
import { Alert, AlertDescription } from "@/components/ui/alert";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/select';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message || 'Invalid email or password.');
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <div className="space-y-1.5">
        <h1 className="text-display-sm font-display font-bold text-ink tracking-tight">Sign in</h1>
        <p className="text-body-sm text-muted-foreground">
          New to FreeLanceBase?{' '}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 py-2.5">
          <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-ink">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-hairline bg-background text-base text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-ink">Password</label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-full bg-primary text-on-dark font-bold text-base shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:hover:scale-100 transition-transform cursor-pointer disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
        {' '}and{' '}
        <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthLayout>
  );
}
