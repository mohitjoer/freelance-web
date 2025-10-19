'use client';

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300"
        >
          ← Back
        </button>

        <div className="flex w-full max-w-6xl gap-8 items-center justify-between animate-fadeIn">
          {/* Left Side - Image */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-xl">
            <img
              src="/signin-illustration.svg"
              alt="Sign in illustration"
              className="w-full h-auto object-contain animate-slideInLeft"
            />
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="flex-1 w-full max-w-md">
            <div className="mb-6 animate-slideInRight">
              <h1 className="text-gray-400 text-sm font-medium mb-1">Welcome to</h1>
              <h2 className="text-3xl font-bold">
                <span className="text-white">Free</span>
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%]">Lance</span>
                <span className="text-white">Base</span>
              </h2>
            </div>


            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
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
                  socialButtonsBlockButton:
                    'border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition duration-200',
                  formFieldInput:
                    'border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg',
                  footerActionLink: 'text-blue-500 hover:text-blue-600 font-medium'
                }
              }}
            />

          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }

          .animate-slideInLeft {
            animation: slideInLeft 0.7s ease-out;
          }

          .animate-slideInRight {
            animation: slideInRight 0.7s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}