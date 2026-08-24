'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/backbutton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoneAllIcon from '@mui/icons-material/DoneAll';

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

interface NotificationsContentProps {
  initialNotifications: NotificationItem[];
}

function typeStyle(type: string) {
  switch (type) {
    case 'proposal_received':
      return { icon: <DescriptionOutlinedIcon fontSize="small" />, classes: 'bg-blue-50 text-blue-600' };
    case 'proposal_accepted':
      return { icon: <CheckCircleOutlineIcon fontSize="small" />, classes: 'bg-green-50 text-green-600' };
    case 'proposal_rejected':
      return { icon: <CancelOutlinedIcon fontSize="small" />, classes: 'bg-red-50 text-red-600' };
    case 'job_completed':
      return { icon: <TaskAltIcon fontSize="small" />, classes: 'bg-purple-50 text-purple-600' };
    default:
      return { icon: <DescriptionOutlinedIcon fontSize="small" />, classes: 'bg-gray-100 text-gray-600' };
  }
}

export default function NotificationsContent({ initialNotifications }: NotificationsContentProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
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
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    } finally {
      markingReadRef.current = false;
      setMarkingRead(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <BackButton/>
              <div className="flex items-center space-x-3">
                <Image
                  src="https://res.cloudinary.com/dipugmopt/image/upload/v1753371311/ChatGPT_Image_Jul_24_2025_09_04_04_PM_odujhi.png"
                  alt="FreeLanceBase Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FreeLanceBase</h1>
                  <p className="text-xs text-gray-500">Professional Freelance Network</p>
                </div>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DoneAllIcon style={{ fontSize: 16 }} />
                Mark all read
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'You are all caught up'}
          </p>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Updates about your proposals and jobs will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const { icon, classes } = typeStyle(notification.type);
              const content = (
                <div
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    notification.read
                      ? 'bg-white border-gray-200'
                      : 'bg-blue-50/60 border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${classes}`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${notification.read ? 'font-medium text-gray-900' : 'font-semibold text-gray-900'}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full align-middle"></span>
                        )}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                        {dateTimeFormatter.format(new Date(notification.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                    {notification.link && (
                      <span className="inline-block mt-2 text-sm font-medium text-blue-600 group-hover:text-blue-800">
                        View details →
                      </span>
                    )}
                  </div>
                </div>
              );

              return notification.link ? (
                <Link key={notification.notificationId} href={notification.link} className="block group">
                  {content}
                </Link>
              ) : (
                <div key={notification.notificationId}>{content}</div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
