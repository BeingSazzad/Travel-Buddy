import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { getDiscoverDeckMembers } from "@/lib/member-profile";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";

export function useDiscover() {
  const { isAuthenticated } = useAuth();
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("discover-members", {});
      const members = res.data?.members || [];
      if (members.length > 0) {
        const rows = await base44.entities.Match.list("-created_date", 100).catch(() => []);
        const connectedIds = new Set(rows.map((m) => m.match_user_id).filter(Boolean));
        setDeck(members.filter((m) => !connectedIds.has(m.user_id)));
      } else {
        setDeck(useDemoFallbacks ? getDiscoverDeckMembers() : []);
      }
    } catch {
      setDeck(useDemoFallbacks ? getDiscoverDeckMembers() : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const act = useCallback(async (member, action) => {
    try {
      const res = await base44.functions.invoke("record-like", {
        liked_user_id: member.user_id,
        action,
      });
      if (res.data?.matched) {
        setMatched({ ...res.data.match, name: member.name, avatar: member.avatar });
      }
    } catch {
      /* offline — no fake match */
    }
  }, []);

  const decide = useCallback(
    (member, choice) => {
      setDeck((d) => d.filter((m) => m.user_id !== member.user_id));
      act(member, choice === "connect" ? "like" : "pass");
    },
    [act]
  );

  const unmatch = useCallback(async (matchId) => {
    try {
      await base44.entities.Match.delete(matchId);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const block = useCallback(async (userId) => {
    try {
      await base44.entities.BlockedMember.create({ blocked_user_id: userId, reason: "block" });
    } catch (e) {
      /* already blocked */
    }
  }, []);

  return {
    deck, loading, matched, setMatched,
    decide, reload: load, unmatch, block,
  };
}
