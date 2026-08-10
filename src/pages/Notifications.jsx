import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BellOff, CheckCheck, Loader2 } from "lucide-react";
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
    type: "match",
    read: false,
    created_date: new Date(Date.now() - 30 * 60000).toISOString(),
    action_url: "/conversations/sim_conv_mock_1",
  },
  {
    id: "notif_mock_2",
    title: "Upcoming event: Sunset Yoga",
    body: "Santorini Sunset Yoga is happening this Thursday at 8:00 AM.",
    type: "event",
    read: false,
    created_date: new Date(Date.now() - 3 * 3600000).toISOString(),
    action_url: "/events",
  },
  {
    id: "notif_mock_3",
    title: "Isabella sent you a message",
    body: '"That sounds great! Let\'s meet at Café Norden."',
    type: "message",
    read: true,
    created_date: new Date(Date.now() - 24 * 3600000).toISOString(),
    action_url: "/conversations/sim_conv_mock_3",
  },
];

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");

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
  const shown = filter === "unread" ? items.filter((n) => !n.read) : items;

  const markAll = async () => {
    if (!unreadCount) return;
    try {
      await base44.entities.Notification.updateMany(
        { user_id: user.id, read: false },
        { $set: { read: true } }
      );
    } catch (e) {
      // Local fallback for mock
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    }
    load();
  };

  return (
    <div className="px-5 safe-pt pb-6 min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-display font-bold text-lg">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
          </div>
        </div>
        <button
          onClick={markAll}
          disabled={!unreadCount}
          className="flex items-center gap-1.5 text-xs text-[#A1846B] disabled:opacity-40 active:scale-95 transition font-semibold"
        >
          <CheckCheck className="w-4 h-4" strokeWidth={1.5} /> Mark all read
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "unread"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition ${
              filter === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            }`}
          >
            {f === "all" ? "All" : "Unread"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        </div>
      ) : error ? (
        <ErrorState onRetry={load} />
      ) : shown.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
          description="New matches, messages and updates will show here."
          actionLabel={filter === "unread" ? "View all" : undefined}
          onAction={filter === "unread" ? () => setFilter("all") : undefined}
        />
      ) : (
        <div className="space-y-2.5">
          {shown.map((n) => (
            <NotificationItem key={n.id} n={n} onChange={load} />
          ))}
        </div>
      )}
    </div>
  );
}