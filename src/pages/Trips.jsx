import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPinned, Compass, Sparkles } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTrips } from "@/hooks/useTrips";
import { useMatches } from "@/hooks/useMatches";
import { tripStatus, tripsOverlap } from "@/lib/trip-utils";
import TripCard from "@/components/trips/TripCard";
import TripForm from "@/components/trips/TripForm";
import MatchSuggestions from "@/components/trips/MatchSuggestions";

const STATUS_ORDER = ["active", "upcoming", "previous"];

export default function Trips() {
  const { trips, loading, user, create, update, remove } = useTrips();
  const { matches: matchList, loading: matchesLoading, blockMember } = useMatches();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
  const openEdit = (trip) => { setEditing(trip); setFormOpen(true); };
  const submit = async (data) => {
    if (editing) await update(editing.id, data);
    else await create(data);
  };
  const del = async (trip) => {
    if (window.confirm(`Delete "${trip.name}"?`)) await remove(trip.id);
  };

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl">Trips</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Plan, discover, connect</p>
        </div>
        <button onClick={openNew} className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center active:scale-95 transition">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <Tabs defaultValue="my">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="my">My Trips</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="nearby">Women Nearby</TabsTrigger>
        </TabsList>

        {/* My Trips */}
        <TabsContent value="my" className="mt-5">
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
                      <TripCard key={t.id} trip={t} canEdit overlapCount={overlapFor(t)} onEdit={openEdit} onDelete={del} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Discover Trips */}
        <TabsContent value="discover" className="mt-5">
          {otherTrips.length === 0 ? (
            <EmptyState icon={Compass} title="No trips to discover yet" description="Community trips from other women will appear here once they're planned." />
          ) : (
            <div className="space-y-4">
              {otherTrips.map((t) => {
                const mine = myTrips.some((m) => tripsOverlap(m, t));
                return <TripCard key={t.id} trip={t} note={mine ? "Matches your dates" : undefined} />;
              })}
            </div>
          )}
        </TabsContent>

        {/* Women Nearby */}
        <TabsContent value="nearby" className="mt-5">
          {myTrips.length === 0 ? (
            <EmptyState icon={MapPinned} title="Add a trip to find women nearby" description="We'll suggest members travelling to the same place around the same time." actionLabel="New trip" onAction={openNew} />
          ) : matchesLoading ? (
            <p className="text-sm text-muted-foreground">Finding matches…</p>
          ) : matchList.length === 0 ? (
            <EmptyState icon={Sparkles} title="No matches yet" description="No members are travelling to your destinations on your dates right now. Try a trip with different dates." />
          ) : (
            <MatchSuggestions matches={matchList} onBlock={blockMember} />
          )}
        </TabsContent>
      </Tabs>

      <TripForm open={formOpen} onOpenChange={setFormOpen} initial={editing} onSubmit={submit} />
    </div>
  );
}