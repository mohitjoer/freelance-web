'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function useUser() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;
  const fullName = user?.name ?? '';
  const parts = fullName.split(' ');
  return {
    user: user
      ? {
          id: user.id,
          email: user.email,
          firstName: parts[0] || '',
          lastName: parts.slice(1).join(' ') || undefined,
          imageUrl: user.image ?? null,
        }
      : undefined,
    isLoaded: !isPending,
    isSignedIn: !!user,
  };
}

export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || !isSignedIn) return null;
  return <>{children}</>;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded || isSignedIn) return null;
  return <>{children}</>;
}

export function SignInButton({
  mode,
  forceRedirectUrl,
  children,
}: {
  mode?: 'redirect' | 'modal';
  forceRedirectUrl?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={forceRedirectUrl ? `/sign-in?redirect=${encodeURIComponent(forceRedirectUrl)}` : '/sign-in'}>
      {children}
    </Link>
  );
}

export function UserButton({ size = 36 }: { size?: number }) {
  const { user } = useUser();
  if (!user) return null;

  return (
    <Link href="/setting" title="Account">
      {user.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={user.firstName || 'User'}
          width={size}
          height={size}
          unoptimized
          className="rounded-lg object-cover"
        />
      ) : (
        <span
          className="flex items-center justify-center rounded-lg bg-blue-600 font-semibold text-white"
          style={{ width: size, height: size }}
        >
          {(user.firstName || 'U').charAt(0).toUpperCase()}
        </span>
      )}
    </Link>
  );
}

export function SignOutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    await authClient.signOut();
    router.push('/');
    router.refresh();
    setSigningOut(false);
  }

  return (
    <button type="button" onClick={handleSignOut} disabled={signingOut}>
      {children}
    </button>
  );
}
