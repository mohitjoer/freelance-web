'use client';

import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/authLayout";
import { clerkAppearance } from "@/config/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}