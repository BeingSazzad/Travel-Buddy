import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useTrips() {
  const { isAuthenticated, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await base44.entities.Trip.list("-start_date", 200);
      setTrips(list);
    } catch (e) {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, []);

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