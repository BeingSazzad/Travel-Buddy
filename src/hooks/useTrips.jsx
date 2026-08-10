import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const getMockTrips = (userId) => [
  {
    id: "trip_mock_1",
    name: "Lisbon Getaway",
    city: "Lisbon",
    country: "Portugal",
    start_date: "2026-08-10",
    end_date: "2026-08-17",
    description: "Ready for historic streets, gorgeous tiles, and pastel de nata! Join me for sightseeing and seafood dinners.",
    created_by_id: userId,
    created_by: { name: "Anika K." },
    members_count: 5,
    status: "upcoming"
  },
  {
    id: "trip_mock_2",
    name: "Bali Retreat",
    city: "Ubud",
    country: "Indonesia",
    start_date: "2026-08-20",
    end_date: "2026-08-28",
    description: "Relaxing yoga retreat in Ubud followed by beach clubs in Seminyak.",
    created_by_id: userId,
    created_by: { name: "Anika K." },
    members_count: 4,
    status: "draft"
  },
  {
    id: "trip_mock_3",
    name: "Paris Fashion Tour",
    city: "Paris",
    country: "France",
    start_date: "2026-09-02",
    end_date: "2026-09-08",
    description: "Wandering through museums, vintage shopping, and drinking espresso at cute cafes in Paris.",
    created_by_id: "other_user_1",
    created_by: { name: "Isabella K.", main_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
    members_count: 3,
    status: "upcoming"
  },
  {
    id: "trip_mock_4",
    name: "Explore Bali Temples",
    city: "Bali",
    country: "Indonesia",
    start_date: "2026-08-15",
    end_date: "2026-08-22",
    description: "Exploring waterfalls, local culture, and temples around Ubud. Let's travel together!",
    created_by_id: "other_user_2",
    created_by: { name: "Maya R.", main_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" },
    members_count: 6,
    status: "upcoming"
  }
];

export function useTrips() {
  const { isAuthenticated, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await base44.entities.Trip.list("-start_date", 200);
      const dbIds = new Set(list.map((t) => t.id));
      const mockToAdd = getMockTrips(user?.id).filter((m) => !dbIds.has(m.id));
      setTrips([...list, ...mockToAdd]);
    } catch (e) {
      setTrips(getMockTrips(user?.id));
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated) load();
    else setTrips([]);
  }, [isAuthenticated, load]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const unsub = base44.entities.Trip.subscribe(() => load());
    return unsub;
  }, [isAuthenticated, load]);

  const create = useCallback((data) => base44.entities.Trip.create(data), []);
  const update = useCallback((id, data) => base44.entities.Trip.update(id, data), []);
  const remove = useCallback((id) => base44.entities.Trip.delete(id), []);

  return { trips, loading, user, reload: load, create, update, remove };
}