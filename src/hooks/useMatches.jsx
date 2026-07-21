import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useMatches() {
  const { isAuthenticated } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("trip-matches", {});
      setMatches(res.data?.suggestions || []);
    } catch (e) {
      setMatches([]);
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