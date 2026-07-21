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

  const swipe = useCallback(
    (dir) => {
      setDeck((d) => {
        const [first, ...rest] = d;
        if (first) act(first, dir === "right" ? "like" : "pass");
        return rest;
      });
    },
    [act]
  );

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
    swipe, reload: load,
  };
}