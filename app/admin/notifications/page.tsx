"use client";

import { useEffect, useState } from "react";
import { useToast } from "../../../contexts/ToastContext";
import { adminService } from "../../../services/admin.service";
import { AdminNotificationItem } from "../../../types/admin-notification.types";
import { PageHeader } from "../../../components/common/PageHeader";
import { EmptyState } from "../../../components/common/EmptyState";
import { AdminNotificationItemRow } from "../../../components/admin/AdminNotificationItemRow";
import { AdminSkeleton } from "../../../components/admin/AdminSkeleton";

export default function AdminNotificationsPage() {
  const toast = useToast();
  const [items, setItems] = useState<AdminNotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await adminService.getNotifications();
      setItems(data.items);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch admin notifications:", error);
      toast.error("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await adminService.markNotificationsSeen();
      toast.success("All notifications marked as read.");
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      toast.error("Unable to mark notifications as read.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon="🔔"
        title="Notifications"
        description="System events that need admin attention — new users, payments, expirations, and errors."
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

      {loading ? (
        <AdminSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="All quiet"
          description="New registrations, successful payments, subscription expirations, and system errors will show up here."
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((notification) => (
            <AdminNotificationItemRow key={notification.id} notification={notification} />
          ))}
        </ul>
      )}
    </div>
  );
}
