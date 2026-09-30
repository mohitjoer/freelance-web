"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu as MenuOutlinedIcon, X as CloseOutlinedIcon, LogOut as LogoutOutlinedIcon } from "lucide-react";
import { SignOutButton } from "@/components/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardShellProps {
  navItems: NavItem[];
  user: { name: string; subtitle?: string; image: string | null };
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

const LOGO =
  "https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png";

const navLink =
  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-surface-soft";

export default function DashboardShell({
  navItems,
  user,
  title,
  action,
  children,
}: DashboardShellProps) {
  const [open, setOpen] = useState(false);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="flex h-dvh bg-canvas">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-hairline bg-canvas
          transition-transform duration-200 ease-out lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src={LOGO} alt="" width={28} height={28} className="size-7" />
              <span className="text-[15px] font-semibold tracking-tight text-ink">FreeLanceBase</span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="-mr-1 p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            >
              <CloseOutlinedIcon className="size-5" />
            </button>
          </div>

          {user.image && (
            <div className="mx-3 mt-1 flex items-center gap-3 px-2.5 py-2">
              <Image
                src={user.image}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{firstName}</p>
                {user.subtitle && (
                  <p className="truncate text-xs text-muted-foreground">{user.subtitle}</p>
                )}
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={i === 0 ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`${navLink} ${
                  i === 0
                    ? "bg-surface-soft font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="shrink-0 [&>svg]:size-[18px]">{item.icon}</span>
                {item.label}
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-foreground px-1.5 text-[11px] font-medium tabular-nums text-background">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="border-t border-hairline p-3">
            <SignOutButton>
              <span className={`${navLink} w-full text-muted-foreground hover:text-destructive`}>
                <LogoutOutlinedIcon className="size-[18px] shrink-0" />
                Sign out
              </span>
            </SignOutButton>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-hairline bg-canvas/85 px-5 backdrop-blur-md sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="-ml-1.5 p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            >
              <MenuOutlinedIcon className="size-5" />
            </button>
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground">{title}</h1>
          </div>
          {action}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
