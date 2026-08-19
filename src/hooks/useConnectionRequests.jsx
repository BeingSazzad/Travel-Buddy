import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { MOCK_MEMBERS, memberDisplayName, DEMO_INCOMING_REQUEST_IDS, resolveMemberAvatar } from "@/lib/member-profile";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";

const MOCK_REQUESTS = DEMO_INCOMING_REQUEST_IDS.map((id) => {
  const m = MOCK_MEMBERS.find((x) => x.user_id === id);
  if (!m) return null;
  const hoursAgo = id === "mock_3" ? 2 : 26;
  return {
    user_id: m.user_id,
    name: m.name,
    avatar: m.avatar,
    current_city: m.current_city,
    country: m.country,
    trip: m.trip,
    created_date: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
  };
}).filter(Boolean);

export function useConnectionRequests() {
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) {
      setRequests([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const myLikes = await base44.entities.Like.filter({ created_by_id: user.id }, "-created_date", 200);
      const likedByMe = new Set(myLikes.filter((l) => l.action === "like").map((l) => l.liked_user_id));
      const incoming = await base44.entities.Like.filter({ liked_user_id: user.id, action: "like" }, "-created_date", 50);

      const pending = incoming
        .filter((l) => !likedByMe.has(l.created_by_id))
        .map((l) => {
          const mock = MOCK_MEMBERS.find((m) => m.user_id === l.created_by_id);
          return mock
            ? {
                user_id: mock.user_id,
                name: mock.name,
                avatar: resolveMemberAvatar(mock.user_id, mock.avatar || mock.main_photo),
                current_city: mock.current_city,
                country: mock.country,
                trip: mock.trip,
                created_date: l.created_date,
              }
            : {
                user_id: l.created_by_id,
                name: memberDisplayName(l.created_by_id),
                avatar: resolveMemberAvatar(l.created_by_id),
                created_date: l.created_date,
              };
        });

      setRequests(pending.length > 0 ? pending : useDemoFallbacks ? MOCK_REQUESTS : []);
    } catch {
      setRequests(useDemoFallbacks ? MOCK_REQUESTS : []);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  return { requests, loading, reload: load };
}
