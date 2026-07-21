import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSaved } from "@/lib/SavedContext";

const today = () => new Date().toISOString().slice(0, 10);

export function useEvents() {
  const { user, isAuthenticated } = useAuth();
  const { items: savedItems } = useSaved();
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [tripCities, setTripCities] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [evs, att, trips] = await Promise.all([
        base44.entities.Event.list("-created_date", 200),
        base44.entities.EventAttendance.list("-created_date", 200),
        base44.entities.Trip.list("-start_date", 100),
      ]);
      setEvents(evs);
      setAttendance(att);
      const upcoming = trips.filter((t) => (t.end_date || t.start_date || "") >= today());
      setTripCities(new Set(upcoming.map((t) => t.city).filter(Boolean)));
    } catch (e) {
      setEvents([]);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsubE = base44.entities.Event.subscribe(() => load());
    const unsubA = base44.entities.EventAttendance.subscribe(() => load());
    return () => { unsubE(); unsubA(); };
  }, [isAuthenticated, load]);

  const joinedIds = useMemo(() => new Set(attendance.map((a) => a.event_id)), [attendance]);
  const savedEventTitles = useMemo(
    () => new Set(savedItems.filter((i) => i.type === "event").map((i) => i.title)),
    [savedItems]
  );

  const rsvp = useCallback(async (event, action) => {
    try {
      const res = await base44.functions.invoke("rsvp-event", { action, event_id: event.id });
      if (res.data?.full) {
        alert("This event is full.");
        return;
      }
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, attendees_count: res.data?.count ?? e.attendees_count } : e)));
      if (action === "join") {
        setAttendance((prev) => [...prev, { event_id: event.id, user_id: user?.id, id: "temp" + Date.now() }]);
      } else {
        setAttendance((prev) => prev.filter((a) => a.event_id !== event.id));
      }
    } catch (e) {
      /* ignore */
    }
  }, [user]);

  const byCategory = useCallback(
    (cat) => (cat === "All" ? events : events.filter((e) => e.category === cat)),
    [events]
  );

  const nearby = useMemo(
    () => [...events].filter((e) => (e.date || "") >= today()).sort((a, b) => (a.date || "").localeCompare(b.date || "")),
    [events]
  );
  const popular = useMemo(
    () => [...events].sort((a, b) => (b.attendees_count || 0) - (a.attendees_count || 0)).slice(0, 10),
    [events]
  );
  const joined = useMemo(() => events.filter((e) => joinedIds.has(e.id)), [events, joinedIds]);
  const saved = useMemo(() => events.filter((e) => savedEventTitles.has(e.title)), [events, savedEventTitles]);
  const atTrips = useMemo(() => events.filter((e) => tripCities.has(e.city)), [events, tripCities]);

  return { events, loading, rsvp, joinedIds, byCategory, nearby, popular, joined, saved, atTrips };
}