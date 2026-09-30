"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, FileText, Inbox } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface NotificationItem {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// Module scope so it is not rebuilt per render.
const relFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86400], ['hour', 3600], ['minute', 60],
];

function timeAgo(iso: string): string {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, secs] of UNITS) {
    if (Math.abs(diff) >= secs) return relFormatter.format(Math.round(diff / secs), unit);
  }
  return 'just now';
}

export default function NotificationBell() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const json = await res.json();
      if (json.success) {
        setItems(json.data ?? []);
        setUnread(json.unreadCount ?? 0);
      }
    } catch {
      // Silent: a failed poll should not break the header.
    }
  }, []);

  useEffect(() => {
    // Deferred so the first fetch does not setState synchronously in the effect body.
    const first = setTimeout(load, 0);
    const id = setInterval(load, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [load]);

  async function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markAllRead' }),
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
          className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-ink hover:bg-surface-soft transition-colors"
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="absolute top-0.5 right-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 sm:w-96 p-0 bg-card border-hairline elev-3">
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
          <h3 className="text-sm font-bold text-ink">Notifications</h3>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <Inbox className="size-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-ink">Nothing here yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Proposals, acceptances and completions will show up here.
            </p>
          </div>
        ) : (
          <ul className="max-h-96 overflow-y-auto divide-y divide-hairline">
            {items.map((n) => (
              <li key={n.notificationId}>
                <Link
                  href={n.link || '/notifications'}
                  onClick={() => {
                    setOpen(false);
                    router.push(n.link || '/notifications');
                  }}
                  className={`flex gap-3 px-4 py-3 hover:bg-surface-soft transition-colors ${
                    n.read ? '' : 'bg-primary/5'
                  }`}
                >
                  <span className="size-8 shrink-0 rounded-full bg-surface-soft flex items-center justify-center">
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink truncate">{n.title}</span>
                      {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                    </span>
                    <span className="block text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {n.message}
                    </span>
                    <span className="block text-xs text-muted-foreground/80 mt-1">
                      {timeAgo(n.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-hairline p-2">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-sm font-semibold text-primary hover:underline py-1.5"
          >
            View all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
