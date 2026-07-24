import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const DEFAULT_FILTERS = {
  ageMin: 18,
  ageMax: 99,
  location: "",
  destination: "",
  dateFrom: "",
  dateTo: "",
  interests: [],
  languages: [],
};

function matchesFilters(m, f) {
  if (m.age != null && (m.age < f.ageMin || m.age > f.ageMax)) return false;
  if (f.location) {
    const q = f.location.toLowerCase();
    const hay = [m.current_city, m.country].filter(Boolean).join(" ").toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (f.destination) {
    const q = f.destination.toLowerCase();
    const t = m.trip;
    const hay = t ? [t.city, t.country].filter(Boolean).join(" ").toLowerCase() : "";
    if (!hay.includes(q)) return false;
  }
  if ((f.dateFrom || f.dateTo) && !m.trip) return false;
  if (f.dateFrom && m.trip?.start_date && new Date(m.trip.start_date) < new Date(f.dateFrom)) return false;
  if (f.dateTo && m.trip?.start_date && new Date(m.trip.start_date) > new Date(f.dateTo)) return false;
  if (f.interests.length && !f.interests.some((i) => m.interests?.includes(i))) return false;
  if (f.languages.length && !f.languages.some((l) => m.languages?.includes(l))) return false;
  return true;
}

export function useDiscover() {
  const { isAuthenticated } = useAuth();
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMatchId, setProfileMatchId] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("discover-members", {});
      setRaw(res.data?.members || []);
    } catch (e) {
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const deck = useMemo(() => raw.filter((m) => matchesFilters(m, filters)), [raw, filters]);
  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.ageMin > 18 || filters.ageMax < 99) n++;
    if (filters.location) n++;
    if (filters.destination) n++;
    if (filters.dateFrom || filters.dateTo) n++;
    if (filters.interests.length) n++;
    if (filters.languages.length) n++;
    return n;
  }, [filters]);

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
    (member, dir) => {
      setRaw((d) => d.filter((m) => m.user_id !== member.user_id));
      act(member, dir === "right" ? "like" : "pass");
    },
    [act]
  );

  const viewProfile = useCallback(async (member, matchId = null) => {
    setProfileMatchId(matchId);
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

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, profileMatchId, viewProfile,
    decide, reload: load,
    filters, setFilters, resetFilters, activeFilterCount,
  };
}