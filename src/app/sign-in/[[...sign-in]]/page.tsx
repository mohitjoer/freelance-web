'use client';

import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/components/authLayout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary: {
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.95rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              transition: 'all 0.07s',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
              }
            },
            card: 'shadow-none',
            headerTitle: 'text-2xl font-bold text-gray-900',
            headerSubtitle: 'text-gray-600',
            socialButtonsBlockButton: 'border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition duration-200',
            formFieldInput: 'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg',
            footerActionLink: 'text-blue-500 hover:text-blue-600 font-medium'
          }
        }}
      />
    </AuthLayout>
  );
}