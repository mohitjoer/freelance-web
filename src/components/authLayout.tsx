'use client';

import { ReactNode } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AuthLayout({ children, title = "Welcome to" }: AuthLayoutProps) {
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
                        <Image
                            src="/signin-illustration.svg"
                            alt="Sign in illustration"
                            className="w-full h-auto object-contain animate-slideInLeft"
                        />
                    </div>

                    {/* Right Side - Auth Form */}
                    <div className="flex-1 w-full max-w-md">
                        <div className="mb-6 animate-slideInRight">
                            <h1 className="text-gray-400 text-sm font-medium mb-1">{title}</h1>
                            <h2 className="text-3xl font-bold">
                                <span className="text-white">Free</span>
                                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent bg-[length:200%_100%]">Lance</span>
                                <span className="text-white">Base</span>
                            </h2>
                        </div>

                        {children}
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