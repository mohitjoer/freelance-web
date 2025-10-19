'use client';

import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/authLayout";
import { clerkAppearance } from "@/config/clerk-appearance";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        appearance={clerkAppearance}
      />
    </AuthLayout>
  );
}