import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrips } from "@/hooks/useTrips";
import { findMockTrip } from "@/lib/mock-trips";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import TripForm from "@/components/trips/TripForm";
import { PageLoading, PageNotFound } from "@/components/common/PageStatus";

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trips, update } = useTrips();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromList = trips.find((t) => t.id === id);
    const mock = findMockTrip(id, user?.id);
    const found = fromList || mock;
    if (found) {
      setTrip(found);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const t = await base44.entities.Trip.get(id);
        if (!cancelled) setTrip(t);
      } catch {
        if (!cancelled) setTrip(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, trips, user?.id]);

  if (loading) return <PageLoading />;
  if (!trip) {
    return (
      <PageNotFound
        title="Trip not found"
        backLabel="Back to trips"
        onBack={() => navigate("/trips")}
      />
    );
  }

  return (
    <TripForm
      initial={trip}
      onCancel={() => navigate(`/trips/${id}`)}
      onSubmit={async (data) => {
        await update(id, data);
        navigate(`/trips/${id}`);
      }}
    />
  );
}
