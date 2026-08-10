import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const MOCK_MATCHES = [
  {
    id: "match_mock_1",
    user_id: "mock_1",
    name: "Maya R.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-15",
      end_date: "2026-08-22"
    }
  },
  {
    id: "match_mock_2",
    user_id: "mock_2",
    name: "Ava L.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    trip: {
      city: "Lisbon",
      country: "Portugal",
      start_date: "2026-08-10",
      end_date: "2026-08-17"
    }
  },
  {
    id: "match_mock_3",
    user_id: "mock_3",
    name: "Sophie M.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80",
    trip: {
      city: "Santorini",
      country: "Greece",
      start_date: "2026-08-12",
      end_date: "2026-08-19"
    }
  },
  {
    id: "match_mock_4",
    user_id: "mock_4",
    name: "Isabella K.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    trip: {
      city: "Paris",
      country: "France",
      start_date: "2026-09-02",
      end_date: "2026-09-08"
    }
  },
  {
    id: "match_mock_5",
    user_id: "mock_5",
    name: "Emma T.",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&h=100&q=80",
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-20",
      end_date: "2026-08-28"
    }
  }
];

export function useMatches() {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("trip-matches", {});
      const list = res.data?.suggestions || [];
      setMatches(list.length > 0 ? list : MOCK_MATCHES);
    } catch (e) {
      setMatches(MOCK_MATCHES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const blockMember = useCallback(
    async (userId, reason = "block") => {
      try {
        await base44.entities.BlockedMember.create({ blocked_user_id: userId, reason });
      } catch (e) {
        /* already blocked */
      }
      await load();
    },
    [load]
  );

  return { matches, loading, reload: load, blockMember };
}