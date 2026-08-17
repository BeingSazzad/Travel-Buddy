import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

import { getMockTrips, getLocalTrips, saveLocalTrip, updateLocalTrip, removeLocalTrip, isLocalTripId } from "@/lib/mock-trips";

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
      const localToAdd = getLocalTrips().filter((t) => !dbIds.has(t.id));
      setTrips([...localToAdd, ...list, ...mockToAdd]);
    } catch {
      setTrips([...getLocalTrips(), ...getMockTrips(user?.id)]);
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

  const create = useCallback((data) => {
    const localTrip = {
      id: `trip_local_${Date.now()}`,
      ...data,
      created_by_id: user?.id || "demo_user",
      created_by: { name: user?.profile_name || user?.full_name || "You" },
    };
    saveLocalTrip(localTrip);
    setTrips((prev) => [localTrip, ...prev.filter((t) => t.id !== localTrip.id)]);
    return Promise.resolve(localTrip);
  }, [user]);

  const update = useCallback(async (id, data) => {
    if (isLocalTripId(id)) {
      const next = updateLocalTrip(id, data);
      if (next) setTrips((prev) => prev.map((t) => (t.id === id ? next : t)));
      return next;
    }
    const updated = await base44.entities.Trip.update(id, data);
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    if (isLocalTripId(id) || String(id).startsWith("trip_mock_")) {
      removeLocalTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await base44.entities.Trip.delete(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { trips, loading, user, reload: load, create, update, remove };
}