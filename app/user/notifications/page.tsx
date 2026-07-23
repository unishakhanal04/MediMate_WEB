"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useToast } from "../../../contexts/ToastContext";
import { notificationService } from "../../../services/notification.service";
import { pushService, isPushSupported } from "../../../services/push.service";
import { NotificationItem } from "../../../types/notification.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { EmptyState } from "../../../components/common/EmptyState";
import { NotificationItemRow } from "../../../components/notifications/NotificationItemRow";
import { NotificationsSkeleton } from "../../../components/notifications/NotificationsSkeleton";

export default function NotificationsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    fetchNotifications();
    if (isPushSupported()) {
      pushService
        .getStatus()
        .then((status) => setPushSubscribed(status.subscribed))
        .catch((error) => console.error("Failed to load push subscription status:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, router]);

  const handleTogglePush = async () => {
    setPushBusy(true);
    try {
      if (pushSubscribed) {
        await pushService.unsubscribe();
        setPushSubscribed(false);
        toast.success("Push notifications turned off.");
      } else {
        await pushService.subscribe();
        setPushSubscribed(true);
        toast.success("Push notifications enabled — you'll get reminders even when MediMate is closed.");
      }
    } catch (error) {
      console.error("Failed to toggle push notifications:", error);
      const message = error instanceof Error ? error.message : "Unable to update push notification settings.";
      toast.error(message);
    } finally {
      setPushBusy(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await notificationService.markAllSeen();
      toast.success("All notifications marked as read.");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Unable to mark notifications as read.");
    } finally {
      setMarking(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <PageHeader
        icon="🔔"
        title="Notifications"
        description="Things that need your attention — missed doses, upcoming visits, and recent account activity."
        action={
          unreadCount > 0 ? (
            <button
              onClick={handleMarkAllRead}
              disabled={marking}
              className="rounded-full bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
            >
              {marking ? "Marking..." : "Mark all as read"}
            </button>
          ) : undefined
        }
      />

      {isPushSupported() && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Browser push notifications</p>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {pushSubscribed
                ? "Enabled — you'll be notified for your reminders even when MediMate is closed."
                : "Get notified for your reminders even when this tab or browser is closed."}
            </p>
          </div>
          <button
            onClick={handleTogglePush}
            disabled={pushBusy}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              pushSubscribed
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {pushBusy ? "Please wait…" : pushSubscribed ? "Turn off" : "Enable push notifications"}
          </button>
        </div>
      )}

      {loading ? (
        <NotificationsSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="You're all caught up"
          description="Missed doses, upcoming appointments, low stock alerts, and recent account activity will show up here."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((notification) => (
            <NotificationItemRow key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </div>
  );
}
