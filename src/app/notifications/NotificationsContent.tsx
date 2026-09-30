"use client"

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Page, PageHeader, SidePanel } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { EmptyState, Panel } from '@/components/ui/panel';

// Module-scope formatter with fixed locale + timezone so SSR and client render identically
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

interface NotificationItem {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsContent({
  initialNotifications,
}: {
  initialNotifications: NotificationItem[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [markingRead, setMarkingRead] = useState(false);
  const markingReadRef = useRef(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    if (markingReadRef.current) return;
    markingReadRef.current = true;
    setMarkingRead(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      if (res.ok) setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    } finally {
      markingReadRef.current = false;
      setMarkingRead(false);
    }
  };

  return (
    <Page
      width="max-w-2xl"
      aside={<SidePanel active="/notifications" />}
      back={{ href: "/dashboard", label: "dashboard" }}
    >
      <PageHeader
        title="Notifications"
        body={unreadCount > 0 ? `${unreadCount} unread` : 'You are all caught up.'}
        action={
          unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} disabled={markingRead}>
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <Panel>
          <EmptyState
            title="Nothing here yet"
            body="Updates on your proposals and jobs show up here."
          />
        </Panel>
      ) : (
        <Panel>
          <ul className="divide-y divide-hairline">
            {notifications.map((n) => {
              const body = (
                <div className="flex items-start gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium text-ink">
                      {!n.read && (
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      )}
                      <span className="truncate">{n.title}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                  </div>
                  <time
                    dateTime={n.createdAt}
                    className="shrink-0 text-xs tabular-nums text-muted-foreground"
                  >
                    {dateTimeFormatter.format(new Date(n.createdAt))}
                  </time>
                </div>
              );

              return (
                <li key={n.notificationId} className={n.read ? '' : 'bg-primary/[0.04]'}>
                  {n.link ? (
                    <Link href={n.link} className="block transition-colors hover:bg-surface-soft">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </Page>
  );
}
