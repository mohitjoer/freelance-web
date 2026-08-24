'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
}

const valueProps = [
    'Post a job and hire in minutes',
    'A dedicated workspace for every project',
    'Real-time chat with clear milestones',
];

// <!-- mock --> Stats shown here are illustrative sample data.

export default function AuthLayout({ children }: AuthLayoutProps) {
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] grid lg:grid-cols-[1.1fr_1fr]">

            {/* Brand panel */}
            <div className="relative hidden lg:flex flex-col justify-between bg-surface-dark text-on-dark p-10 xl:p-14 overflow-hidden">
                <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] opacity-50 pointer-events-none" />
                <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[120px] opacity-40 pointer-events-none" />

                <Link href="/" className="relative z-10 flex items-center gap-2.5 w-fit">
                    <Image
                        src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                        alt="FreeLanceBase"
                        width={36}
                        height={36}
                        className="rounded-lg"
                    />
                    <span className="text-xl font-bold tracking-tight">FreeLanceBase</span>
                </Link>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-display-md font-display leading-tight tracking-tight mb-4">
                        Where good work finds <span className="text-primary">great talent</span>
                    </h1>
                    <ul className="space-y-3 mb-10">
                        {valueProps.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm font-medium text-on-dark-soft">
                                <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-emerald-400" />
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="flex gap-8 pt-6 border-t border-white/10">
                        <div>
                            <p className="text-title-md font-bold">38k+</p>
                            <p className="text-xs text-on-dark-soft">Freelancers</p>
                        </div>
                        <div>
                            <p className="text-title-md font-bold">12k+</p>
                            <p className="text-xs text-on-dark-soft">Projects delivered</p>
                        </div>
                        <div>
                            <p className="text-title-md font-bold">4.9/5</p>
                            <p className="text-xs text-on-dark-soft">Average rating</p>
                        </div>
                    </div>
                </div>

                <p className="relative z-10 text-xs text-on-dark-soft">
                    © {new Date().getFullYear()} FreeLanceBase
                </p>
            </div>

            {/* Form side */}
            <div className="flex flex-col bg-canvas">
                <div className="flex items-center justify-between p-5 sm:p-6 lg:justify-end">
                    <Link href="/" className="lg:hidden flex items-center gap-2">
                        <Image
                            src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                            alt="FreeLanceBase"
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="font-bold text-ink">FreeLanceBase</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        aria-label="Back to home"
                        className="px-4 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-surface-soft active:scale-[0.98] transition cursor-pointer"
                    >
                        ← Back
                    </button>
                </div>

                <main className="flex-1 flex items-start sm:items-center justify-center px-5 pb-16 sm:p-6">
                    <div className="w-full max-w-md">{children}</div>
                </main>
            </div>
        </div>
    );
}
