import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import ConversationRow from "@/components/messages/ConversationRow";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { onRefresh } from "@/lib/refresh-bus";

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

const getMockConversations = (userId) => [
  {
    id: "sim_conv_mock_1",
    participant_ids: [userId, "mock_1"],
    participant_names: ["Anika K.", "Maya R."],
    participant_avatars: ["", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"],
    last_message: "Hey! Are you still planning for Bali?",
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread: { [userId]: 2 },
    created_date: new Date().toISOString()
  },
  {
    id: "sim_conv_mock_2",
    participant_ids: [userId, "mock_2"],
    participant_names: ["Anika K.", "Ava L."],
    participant_avatars: ["", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"],
    last_message: "Sure! Let's discuss the itinerary.",
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    unread: { [userId]: 0 },
    created_date: new Date().toISOString()
  },
  {
    id: "sim_conv_mock_3",
    participant_ids: [userId, "mock_4"],
    participant_names: ["Anika K.", "Isabella K."],
    participant_avatars: ["", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"],
    last_message: "That sounds great!",
    last_message_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    unread: { [userId]: 0 },
    created_date: new Date().toISOString()
  },
  {
    id: "sim_conv_mock_4",
    participant_ids: [userId, "mock_5"],
    participant_names: ["Anika K.", "Emma T."],
    participant_avatars: ["", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&h=100&q=80"],
    last_message: "Let me know the details.",
    last_message_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    unread: { [userId]: 0 },
    created_date: new Date().toISOString()
  }
];

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [blockedIds, setBlockedIds] = useState(new Set());
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
      const dbIds = new Set(convs.map((c) => c.id));
      const mockToAdd = getMockConversations(user?.id).filter((m) => !dbIds.has(m.id));
      setConversations([...convs, ...mockToAdd]);
      setBlockedIds(new Set(blocked.map((b) => b.blocked_user_id)));
    } catch (e) {
      setConversations(getMockConversations(user?.id));
      setBlockedIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
    const unsub = base44.entities.Conversation.subscribe(() => load());
    return unsub;
  }, [load]);
  useEffect(() => onRefresh("/messages", load), [load]);

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
      <h1 className="font-display font-bold text-lg mb-1">Messages</h1>
      <p className="text-sm text-muted-foreground mb-4">Chat with your travel friends</p>

      {/* Search */}
      <div className="flex items-center gap-2 bg-card border border-border/80 shadow-soft rounded-2xl px-4 py-3 mb-4">
        <Search className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search conversations"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Recent Matches Horizontal Strip */}
      {!loading && rows.length > 0 && !query && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
            Your Matches
          </p>
          <div className="flex gap-3.5 overflow-x-auto no-scrollbar -mx-5 px-5 py-1">
            {rows.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate(`/conversations/${r.id}`)}
                className="flex flex-col items-center gap-1.5 shrink-0 active:scale-95 transition"
              >
                <div className="relative">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#A1846B] shadow-soft"
                  />
                  {r.unread > 0 && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#A1846B] ring-2 ring-card rounded-full" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground truncate max-w-[64px]">
                  {r.name.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-0.5">
            Chats
          </p>
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