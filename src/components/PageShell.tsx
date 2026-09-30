import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

const LOGO =
  "https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png";

/**
 * Standalone page frame for everything outside the dashboard shell.
 *
 * With `aside` the page is two-column: a sticky rail on the left, content on the
 * right. Without it, content is centred at a readable measure.
 */
export function Page({
  children,
  width = "max-w-3xl",
  back,
  aside,
}: {
  children: ReactNode;
  width?: string;
  back?: { href: string; label: string };
  aside?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      {aside ? (
        <div className="mx-auto flex w-full max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:py-14">
          <div className="hidden w-60 shrink-0 lg:block">{aside}</div>
          <div className="min-w-0 flex-1">
            {back && <BackLink {...back} />}
            {children}
          </div>
        </div>
      ) : (
        <div className={`mx-auto w-full ${width} px-5 py-10 sm:px-8 sm:py-14`}>
          {back && <BackLink {...back} />}
          {children}
        </div>
      )}
    </div>
  );
}

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group mb-8 -ml-1 inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
      <span>Back to {label}</span>
    </Link>
  );
}

/**
 * The default rail: wordmark, the account nav every role shares, and legal links.
 * Deliberately carries no "Find work"/"Post job" CTA — that intent already lives
 * in the page header, and two buttons for one intent is a design bug.
 */
const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/notifications", label: "Notifications" },
  { href: "/setting", label: "Settings" },
  { href: "/support", label: "Help & support" },
];

export function SidePanel({ active, children }: { active?: string; children?: ReactNode }) {
  return (
    <div className="sticky top-10 space-y-8">
      <div>
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={LOGO} alt="" width={26} height={26} className="size-6" />
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            FreeLanceBase
          </span>
        </Link>
        <nav className="mt-6 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={`block rounded-lg px-2.5 py-2 text-sm transition-colors ${
                active === item.href
                  ? "bg-surface-soft font-medium text-foreground"
                  : "text-muted-foreground hover:bg-surface-soft hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {children}

      <div className="space-y-2 border-t border-hairline pt-6 text-xs text-muted-foreground">
        <Link href="/terms" className="block hover:text-foreground">
          Terms
        </Link>
        <Link href="/privacy" className="block hover:text-foreground">
          Privacy
        </Link>
        <p className="pt-2">&copy; {new Date().getFullYear()} FreeLanceBase</p>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {action}
      </div>
      {body && <p className="mt-2 text-muted-foreground measure-tight">{body}</p>}
    </div>
  );
}
