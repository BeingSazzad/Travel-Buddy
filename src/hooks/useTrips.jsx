import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

import { getMockTrips } from "@/lib/mock-trips";

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
    } catch {
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