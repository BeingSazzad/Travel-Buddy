import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BellOff, CheckCheck, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function Notifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const list = await base44.entities.Notification.list("-created_date", 60);
      setItems(list);
    } catch (e) {
      setItems([]);
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
      ) : shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <BellOff className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="font-display font-semibold">{filter === "unread" ? "No unread notifications" : "No notifications yet"}</p>
          <p className="text-sm text-muted-foreground mt-1">New matches, messages and updates will show here.</p>
        </div>
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