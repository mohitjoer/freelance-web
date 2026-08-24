"use client";

import { Button } from "../ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@/components/auth";

import Link from "next/link";
import Image from "next/image";

function Homeheader() {
  return (
    <header className="w-full fixed z-100 bg-background/90 backdrop-blur-lg border-b border-hairline transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            alt="FreeLanceBase logo"
            src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-ink tracking-tight hidden sm:block">
            FreeLanceBase
          </span>
        </Link>

        {/* Primary links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-muted-foreground">
          <Link href="/jobs/open" className="hover:text-ink transition-colors">
            Browse jobs
          </Link>
          <Link href="/sign-up" className="hover:text-ink transition-colors">
            Post a job
          </Link>
          <Link href="/how-it-works" className="hover:text-ink transition-colors">
            How it works
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <SignedOut>
            <SignInButton mode="redirect" forceRedirectUrl="/select">
              <Button
                variant="ghost"
                className="cursor-pointer rounded-full px-5 font-bold text-muted-foreground hover:text-ink hover:bg-surface-soft"
              >
                Sign in
              </Button>
            </SignInButton>
            <Link href="/sign-up" className="inline-block ml-1">
              <Button className="cursor-pointer rounded-full px-6 font-bold shadow-none hover:shadow-md hover:shadow-primary/20 transition-shadow">
                Join
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link href="/select">
              <Button
                variant="outline"
                className="cursor-pointer rounded-full px-6 font-bold border-hairline text-ink hover:bg-surface-soft hover:text-ink"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton size={36} />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default Homeheader;
