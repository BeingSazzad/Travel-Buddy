import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, MapPinned, Compass, Sparkles } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTrips } from "@/hooks/useTrips";
import { useMatches } from "@/hooks/useMatches";
import { tripStatus, tripsOverlap } from "@/lib/trip-utils";
import { overlapTravellerAvatars } from "@/lib/mock-trips";
import TripCard from "@/components/trips/TripCard";
import MatchSuggestions from "@/components/trips/MatchSuggestions";
import ScreenHeader from "@/components/common/ScreenHeader";
import { onRefresh } from "@/lib/refresh-bus";

const STATUS_ORDER = ["active", "upcoming", "previous"];

export default function Trips() {
  const { trips, loading, user, reload } = useTrips();
  const { matches: matchList, loading: matchesLoading } = useMatches();
  useEffect(() => onRefresh("/trips", reload), [reload]);
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.state?.tab === "nearby" ? "nearby" : "my";

  const myTrips = useMemo(() => trips.filter((t) => t.created_by_id === user?.id), [trips, user]);
  const otherTrips = useMemo(() => trips.filter((t) => t.created_by_id !== user?.id), [trips, user]);

  const overlapFor = (trip) =>
    new Set(otherTrips.filter((o) => tripsOverlap(trip, o)).map((o) => o.created_by_id)).size;

  const grouped = useMemo(() => {
    const g = { active: [], upcoming: [], previous: [] };
    myTrips.forEach((t) => g[tripStatus(t)].push(t));
    return g;
  }, [myTrips]);

  const openNew = () => navigate("/trips/new");

  return (
    <div className="page-shell">
      <ScreenHeader
        title="Trips"
        subtitle="Plan, discover, connect"
        extraActions={
          <button onClick={openNew} className="w-10 h-10 rounded-full fab-primary">
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <Tabs defaultValue={initialTab} className="mt-3">
        <TabsList className="grid grid-cols-3 w-full h-11 bg-muted/50 p-1 rounded-2xl gap-1">
          <TabsTrigger value="my" className="rounded-xl text-xs font-semibold px-2">My Trips</TabsTrigger>
          <TabsTrigger value="discover" className="rounded-xl text-xs font-semibold px-2">Discover</TabsTrigger>
          <TabsTrigger value="nearby" className="rounded-xl text-xs font-semibold px-2">Trip matches</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="mt-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : myTrips.length === 0 ? (
            <EmptyState icon={MapPinned} title="No trips yet" description="Plan your first trip to start matching with women heading the same way." actionLabel="New trip" onAction={openNew} />
          ) : (
            <div className="space-y-6">
              {STATUS_ORDER.filter((s) => grouped[s].length).map((s) => (
                <div key={s}>
                  <h2 className="font-display font-semibold text-base mb-3 capitalize">
                    {s} <span className="text-xs text-muted-foreground">({grouped[s].length})</span>
                  </h2>
                  <div className="space-y-4">
                    {grouped[s].map((t) => (
                      <TripCard
                        key={t.id}
                        trip={t}
                        overlapCount={overlapFor(t)}
                        overlapAvatars={overlapTravellerAvatars(t, otherTrips)}
                        onPress={() => navigate(`/trips/${t.id}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="mt-6">
          {otherTrips.length === 0 ? (
            <EmptyState icon={Compass} title="No trips to discover yet" description="Community trips from other women will appear here once they're planned." />
          ) : (
            <div className="space-y-4">
              {otherTrips.map((t) => {
                const mine = myTrips.some((m) => tripsOverlap(m, t));
                return (
                  <TripCard
                    key={t.id}
                    trip={t}
                    note={mine ? "Matches your dates" : undefined}
                    onPress={() => navigate(`/trips/${t.id}`)}
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="nearby" className="mt-6">
          {myTrips.length === 0 ? (
            <EmptyState icon={MapPinned} title="Add a trip to see matches" description="We'll suggest women travelling to the same place around the same time. Tap a match to view their profile." actionLabel="New trip" onAction={openNew} />
          ) : matchesLoading ? (
            <p className="text-sm text-muted-foreground">Finding matches…</p>
          ) : matchList.length === 0 ? (
            <EmptyState icon={Sparkles} title="No matches yet" description="No members are travelling to your destinations on your dates right now. Try a trip with different dates." />
          ) : (
            <MatchSuggestions matches={matchList} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
