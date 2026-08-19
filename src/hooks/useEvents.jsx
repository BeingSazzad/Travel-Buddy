import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSaved } from "@/lib/SavedContext";
import { MOCK_EVENTS, getLocalEvents, isLocalEventId, stampDemoMineHost, hydrateEventPeople } from "@/lib/mock-events";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";
import { isSameAppUser } from "@/lib/demo-user";

const today = () => new Date().toISOString().slice(0, 10);

export { MOCK_EVENTS };

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
      const dbById = new Map(evs.map((e) => [e.id, e]));
      const mockToAdd = useDemoFallbacks ? MOCK_EVENTS.filter((m) => !dbById.has(m.id)) : [];
      for (const local of getLocalEvents()) {
        const existing = dbById.get(local.id);
        if (!existing) {
          dbById.set(local.id, local);
        } else {
          dbById.set(local.id, {
            ...existing,
            host_id: local.host_id || existing.host_id,
            created_by_id: local.created_by_id || existing.created_by_id,
            host_name: local.host_name || existing.host_name,
            created_locally: true,
            lat: existing.lat ?? local.lat,
            lng: existing.lng ?? local.lng,
          });
        }
      }
      setEvents(
        [...dbById.values(), ...mockToAdd].map((e) => hydrateEventPeople(stampDemoMineHost(e, user)))
      );
      setAttendance(att);
      const upcoming = trips.filter((t) => (t.end_date || t.start_date || "") >= today());
      setTripCities(new Set(upcoming.map((t) => t.city).filter(Boolean)));
    } catch {
      setEvents(
        [...getLocalEvents(), ...(useDemoFallbacks ? MOCK_EVENTS : [])].map((e) =>
          hydrateEventPeople(stampDemoMineHost(e, user))
        )
      );
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
    const join = action === "join";
    // Optimistic update — reflect the change immediately, revert on failure.
    if (join) {
      setAttendance((prev) => (prev.some((a) => a.event_id === event.id) ? prev : [...prev, { event_id: event.id, user_id: user?.id, id: "temp" + Date.now() }]));
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, attendees_count: (e.attendees_count || 0) + 1 } : e)));
    } else {
      setAttendance((prev) => prev.filter((a) => a.event_id !== event.id));
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, attendees_count: Math.max(0, (e.attendees_count || 0) - 1) } : e)));
    }
    try {
      const res = await base44.functions.invoke("rsvp-event", { action, event_id: event.id });
      if (res.data?.full) {
        setAttendance((prev) => prev.filter((a) => a.event_id !== event.id));
        setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, attendees_count: res.data?.count ?? e.attendees_count } : e)));
        alert("This event is full.");
        return;
      }
      setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, attendees_count: res.data?.count ?? e.attendees_count } : e)));
    } catch (e) {
      if (join) {
        setAttendance((prev) => prev.filter((a) => a.event_id !== event.id));
        setEvents((prev) => prev.map((ev) => (ev.id === event.id ? { ...ev, attendees_count: Math.max(0, (ev.attendees_count || 0) - 1) } : ev)));
      } else {
        setAttendance((prev) => (prev.some((a) => a.event_id === event.id) ? prev : [...prev, { event_id: event.id, user_id: user?.id, id: "temp" + Date.now() }]));
        setEvents((prev) => prev.map((ev) => (ev.id === event.id ? { ...ev, attendees_count: (ev.attendees_count || 0) + 1 } : ev)));
      }
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
  const hosted = useMemo(() => {
    const localIds = new Set(getLocalEvents().map((e) => e.id));
    return events.filter((e) => {
      if (localIds.has(e.id) || isLocalEventId(e.id) || e.created_locally || e.demo_mine) return true;
      return (
        isSameAppUser(e.host_id, user?.id) ||
        isSameAppUser(e.created_by_id, user?.id) ||
        isSameAppUser(e.created_by?.id, user?.id)
      );
    });
  }, [events, user?.id]);
  const hostedIds = useMemo(() => new Set(hosted.map((e) => e.id)), [hosted]);
  const joined = useMemo(
    () =>
      events.filter((e) => {
        if (hostedIds.has(e.id)) return false;
        if (e.demo_going) return true;
        if (joinedIds.has(e.id)) return true;
        return (e.attendees || []).some(
          (a) => a.status === "going" && isSameAppUser(a.user_id, user?.id)
        );
      }),
    [events, joinedIds, hostedIds, user?.id]
  );
  const saved = useMemo(() => events.filter((e) => savedEventTitles.has(e.title)), [events, savedEventTitles]);
  const atTrips = useMemo(() => events.filter((e) => tripCities.has(e.city)), [events, tripCities]);

  return { events, loading, rsvp, reload: load, joinedIds, byCategory, nearby, popular, hosted, joined, saved, atTrips };
}