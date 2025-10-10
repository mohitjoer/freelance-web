'use client';

import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f8] relative top-2">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 px-3 py-1.5 rounded-md text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-900 transition"
      >
        &larr; Back
      </button>

      <SignUp />
    </div>
  );
}


