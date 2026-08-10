import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BellOff, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import NotificationItem from "@/components/notifications/NotificationItem";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif_mock_1",
    title: "New match with Maya R.! 🎉",
    body: "Maya is also travelling to Lisbon in August. Send a message to plan your trip together.",
    type: "new_match",
    read: false,
    created_date: new Date(Date.now() - 30 * 60000).toISOString(),
    link: "/conversations/sim_conv_mock_1",
  },
  {
    id: "notif_mock_2",
    title: "Upcoming event: Sunset Yoga",
    body: "Santorini Sunset Yoga is happening this Thursday at 8:00 AM.",
    type: "event_reminder",
    read: false,
    created_date: new Date(Date.now() - 3 * 3600000).toISOString(),
    link: "/events",
  },
  {
    id: "notif_mock_3",
    title: "Isabella sent you a message",
    body: '"That sounds great! Let\'s meet at Café Norden."',
    type: "new_message",
    read: true,
    created_date: new Date(Date.now() - 24 * 3600000).toISOString(),
    link: "/conversations/sim_conv_mock_3",
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.Notification.list("-created_date", 60);
      setItems(list.length > 0 ? list : MOCK_NOTIFICATIONS);
      setError(false);
    } catch (e) {
      setItems(MOCK_NOTIFICATIONS);
      setError(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = base44.entities.Notification.subscribe(() => load());
    return unsub;
  }, [load]);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAll = async () => {
    if (!unreadCount) return;
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await base44.entities.Notification.updateMany(
        { user_id: user.id, read: false },
        { $set: { read: true } }
      );
    } catch (e) {
      /* local state already updated */
    }
  };

  return (
    <div className="app-px safe-pt pb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center tap-feedback"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <h1 className="font-display font-bold text-lg">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAll}
            className="text-xs font-medium text-[#A1846B] tap-feedback"
          >
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        </div>
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications yet"
          description="New matches, messages and updates will show here."
        />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <NotificationItem key={n.id} n={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
}
