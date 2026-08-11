import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { MOCK_MEMBERS, getMockConversationId, DEMO_FRIEND_MEMBER_IDS } from "@/lib/member-profile";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";

const MOCK_FRIENDS = DEMO_FRIEND_MEMBER_IDS.map((memberId, i) => {
  const m = MOCK_MEMBERS.find((x) => x.user_id === memberId);
  if (!m) return null;
  return {
    matchId: `match_mock_${i + 1}`,
    memberId: m.user_id,
    name: m.name,
    avatar: m.avatar,
    loc: `${m.current_city}, ${m.country}`,
    convId: getMockConversationId(m.user_id),
  };
}).filter(Boolean);

function mapMatchRow(m) {
  const city = m.city || m.data?.city;
  const country = m.country || m.data?.country;
  const loc = [city, country].filter(Boolean).join(", ");
  return {
    matchId: m.id,
    memberId: m.match_user_id || m.data?.match_user_id,
    name: m.match_name || m.data?.match_name || "Seluna member",
    avatar: m.match_avatar || m.data?.match_avatar || "",
    loc,
    convId: m.conversation_id || null,
  };
}

export function useFriends() {
  const { isAuthenticated } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await base44.entities.Match.list("-created_date", 100);
      const mapped = rows.map(mapMatchRow).filter((f) => f.memberId);
      setFriends(mapped.length > 0 ? mapped : useDemoFallbacks ? MOCK_FRIENDS : []);
    } catch {
      setFriends(useDemoFallbacks ? MOCK_FRIENDS : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
    else {
      setFriends([]);
      setLoading(false);
    }
  }, [isAuthenticated, load]);

  const removeFriend = useCallback(async (friend) => {
    const id = friend.matchId;
    if (id && !String(id).startsWith("match_mock_")) {
      try {
        await base44.entities.Match.delete(id);
      } catch {
        /* mock or already removed */
      }
    }
    setFriends((prev) => prev.filter((f) => f.memberId !== friend.memberId));
  }, []);

  const blockFriend = useCallback(async (memberId) => {
    try {
      await base44.entities.BlockedMember.create({ blocked_user_id: memberId, reason: "block" });
    } catch {
      /* already blocked */
    }
    setFriends((prev) => prev.filter((f) => f.memberId !== memberId));
  }, []);

  return { friends, loading, reload: load, removeFriend, blockFriend };
}
