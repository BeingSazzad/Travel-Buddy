import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useDiscover() {
  const { isAuthenticated } = useAuth();
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("discover-members", {});
      setDeck(res.data?.members || []);
    } catch (e) {
      setDeck([]);
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
    } catch (e) {
      /* ignore */
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

  const viewProfile = useCallback(async (member) => {
    try {
      setProfileLoading(true);
      const res = await base44.functions.invoke("member-profile", { user_id: member.user_id });
      setProfile(res.data);
    } catch (e) {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  return {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, viewProfile,
    decide, reload: load, unmatch, block,
  };
}