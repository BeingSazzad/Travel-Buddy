import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BellOff, CheckCheck, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import NotificationItem from "@/components/notifications/NotificationItem";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

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
      setItems(list);
      setError(false);
    } catch (e) {
      setItems([]);
      setError(true);
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
      load();
    } catch (e) {}
  };

  return (
    <div className="px-5 pt-12 pb-6 min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center active:scale-95 transition">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-display font-semibold text-xl">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-muted-foreground">{unreadCount} unread</p>}
          </div>
        </div>
        <button
          onClick={markAll}
          disabled={!unreadCount}
          className="flex items-center gap-1.5 text-xs text-[#A1846B] disabled:opacity-40 active:scale-95 transition"
        >
          <CheckCheck className="w-4 h-4" strokeWidth={1.5} /> Mark all read
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "unread"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs capitalize transition ${filter === f ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
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