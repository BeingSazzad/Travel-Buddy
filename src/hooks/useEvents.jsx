import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSaved } from "@/lib/SavedContext";

const today = () => new Date().toISOString().slice(0, 10);

const MOCK_EVENTS = [
  {
    id: "event_mock_1",
    title: "Sunset Yoga",
    name: "Sunset Yoga",
    city: "Santorini",
    country: "Greece",
    date: "2026-08-10",
    time: "08:00 AM",
    category: "wellness",
    description: "Start your morning with a relaxing yoga session overlooking the beautiful caldera in Oia. All levels welcome!",
    attendees_count: 8,
    host_name: "Maya R.",
    host_avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    id: "event_mock_2",
    title: "Sunset Dinner in Santorini",
    name: "Sunset Dinner in Santorini",
    city: "Santorini",
    country: "Greece",
    date: "2026-08-12",
    time: "06:00 PM",
    category: "food",
    description: "Join us for an unforgettable sunset dinner with amazing women travellers. Good food, great conversations, and memories to last a lifetime.",
    attendees_count: 12,
    host_name: "Anika K.",
    host_avatar: "",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    id: "event_mock_3",
    title: "Wine & Paint Night",
    name: "Wine & Paint Night",
    city: "Lisbon",
    country: "Portugal",
    date: "2026-08-15",
    time: "06:30 PM",
    category: "social",
    description: "Unleash your inner artist! We will sip local Portuguese wine and paint the beautiful scenery of Lisbon.",
    attendees_count: 6,
    host_name: "Ava L.",
    host_avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    id: "event_mock_4",
    title: "Girls' Trip to Swiss Alps",
    name: "Girls' Trip to Swiss Alps",
    city: "Zermatt",
    country: "Switzerland",
    date: "2026-09-05",
    time: "10:00 AM",
    category: "adventure",
    description: "Let's head to the mountains for fresh air, hiking trails, and beautiful chalet evenings. 4 days of adventure!",
    attendees_count: 4,
    host_name: "Isabella K.",
    host_avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&h=300&q=80"
  }
];

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
      const dbIds = new Set(evs.map((e) => e.id));
      const mockToAdd = MOCK_EVENTS.filter((m) => !dbIds.has(m.id));
      setEvents([...evs, ...mockToAdd]);
      setAttendance(att);
      const upcoming = trips.filter((t) => (t.end_date || t.start_date || "") >= today());
      setTripCities(new Set(upcoming.map((t) => t.city).filter(Boolean)));
    } catch (e) {
      setEvents(MOCK_EVENTS);
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
  const joined = useMemo(() => events.filter((e) => joinedIds.has(e.id)), [events, joinedIds]);
  const saved = useMemo(() => events.filter((e) => savedEventTitles.has(e.title)), [events, savedEventTitles]);
  const atTrips = useMemo(() => events.filter((e) => tripCities.has(e.city)), [events, tripCities]);

  return { events, loading, rsvp, reload: load, joinedIds, byCategory, nearby, popular, joined, saved, atTrips };
}