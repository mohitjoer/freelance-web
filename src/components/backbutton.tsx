"use client"
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 px-4 py-2 text-black/55 hover:text-white hover:bg-neutral-800 rounded-full transition-all duration-200"
    >
      <ArrowLeft className="w-7 h-7" />
    </button>
  );
}