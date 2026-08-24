import { redirect } from "next/navigation";
import { getUserId } from "@/lib/session";
import connectDB from "@/mongo/db";
import Notification from "@/mongo/model/notificationschema";
import { toPlain } from "@/lib/serialize";
import NotificationsContent from "./NotificationsContent";

export const dynamic = "force-dynamic";

export interface NotificationItem {
  notificationId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default async function NotificationsPage() {
  const [, userId] = await Promise.all([connectDB(), getUserId()]);
  if (!userId) redirect("/sign-in?redirect=/notifications");

  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return <NotificationsContent initialNotifications={toPlain(notifications) as NotificationItem[]} />;
}
