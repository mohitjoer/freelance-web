import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider, ThemeScript } from "@/components/theme-provider";
import ScrollToTop from '@/components/ScrollToTop';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FreelanceBase - The Modern Freelance Marketplace",
    template: "%s | FreelanceBase",
  },
  description: "Connect with top freelance talent and find high-quality remote jobs on FreelanceBase. Build your career or grow your business today.",
  keywords: ["freelance", "jobs", "marketplace", "remote work", "hiring", "freelancers", "clients", "portfolio"],
  authors: [{ name: "FreelanceBase Team" }],
  creator: "FreelanceBase",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://freelancebase.com",
    title: "FreelanceBase - The Modern Freelance Marketplace",
    description: "Connect with top freelance talent and find high-quality remote jobs on FreelanceBase.",
    siteName: "FreelanceBase",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelanceBase - The Modern Freelance Marketplace",
    description: "Connect with top freelance talent and find high-quality remote jobs on FreelanceBase.",
    creator: "@freelancebase",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeScript />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>          
          <ThemeProvider>
            {children}
            <ScrollToTop />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}