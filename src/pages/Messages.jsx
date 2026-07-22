import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ConversationRow from "@/components/messages/ConversationRow";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

function timeLabel(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const [convs, blocked] = await Promise.all([
        base44.entities.Conversation.list("-updated_date", 100),
        base44.entities.BlockedMember.list("-created_date", 200),
      ]);
      setConversations(convs);
      setBlockedIds(new Set(blocked.map((b) => b.blocked_user_id)));
    } catch (e) {
      setConversations([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = base44.entities.Conversation.subscribe(() => load());
    return unsub;
  }, [load]);

  const rows = useMemo(() => {
    const mapped = conversations
      .map((c) => {
        const otherIndex = c.participant_ids.findIndex((p) => p !== user?.id);
        if (otherIndex === -1) return null;
        const otherId = c.participant_ids[otherIndex];
        return {
          id: c.id,
          otherId,
          name: c.participant_names?.[otherIndex] || "Travel friend",
          avatar: c.participant_avatars?.[otherIndex] || "",
          lastMessage: c.last_message || "",
          time: timeLabel(c.last_message_at || c.created_date),
          unread: c.unread?.[user?.id] || 0,
          sortAt: c.last_message_at ? new Date(c.last_message_at).getTime() : new Date(c.created_date).getTime(),
        };
      })
      .filter(Boolean);

    // Hide conversations with blocked members
    const visible = mapped.filter((r) => !blockedIds.has(r.otherId));
    // Sort by newest activity
    visible.sort((a, b) => b.sortAt - a.sortAt);
    // Search by name
    const q = query.trim().toLowerCase();
    return q ? visible.filter((r) => r.name.toLowerCase().includes(q)) : visible;
  }, [conversations, blockedIds, user, query]);

  return (
    <div className="px-5 pt-12 pb-24">
      <h1 className="font-display font-semibold text-2xl mb-1">Messages</h1>
      <p className="text-sm text-muted-foreground mb-4">Chat with your travel friends</p>

      <div className="flex items-center gap-2 bg-card border border-border shadow-soft rounded-2xl px-4 py-3 mb-4">
        <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground py-10 text-center">Loading…</p>
      ) : error ? (
        <ErrorState className="mt-6" onRetry={load} />
      ) : rows.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={MessageCircle}
          title="No conversations yet"
          description="Match with a travel friend to start chatting."
          actionLabel="Find travel friends"
          onAction={() => navigate("/discover")}
        />
      ) : (
        <div>
          {rows.map((r) => (
            <ConversationRow
              key={r.id}
              name={r.name}
              avatar={r.avatar}
              lastMessage={r.lastMessage}
              time={r.time}
              unread={r.unread}
              onClick={() => navigate(`/conversations/${r.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}