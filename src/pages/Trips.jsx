import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTrips } from "@/hooks/useTrips";
import { tripStatus, tripsOverlap } from "@/lib/trip-utils";
import TripCard from "@/components/trips/TripCard";
import TripForm from "@/components/trips/TripForm";

const STATUS_ORDER = ["active", "upcoming", "previous"];

export default function Trips() {
  const { trips, loading, user, create, update, remove } = useTrips();
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

  const nearby = useMemo(() => {
    const map = {};
    otherTrips.forEach((o) => {
      const m = myTrips.find((mt) => tripsOverlap(mt, o));
      if (m) {
        const key = o.created_by_id;
        if (!map[key]) {
          map[key] = { handle: (o.created_by || "traveler").split("@")[0], trips: [] };
        }
        map[key].trips.push({ ...o, match: m.name });
      }
    });
    return Object.values(map);
  }, [myTrips, otherTrips]);

  const openNew = () => { setEditing(null); setFormOpen(true); };
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
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-display font-semibold">No trips yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first trip to start planning.</p>
              <Button className="mt-4" onClick={openNew}>New trip</Button>
            </div>
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
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-display font-semibold">No trips to discover yet</p>
              <p className="text-sm text-muted-foreground mt-1">Community trips from other women will appear here.</p>
            </div>
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
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-display font-semibold">Add a trip to find women nearby</p>
              <p className="text-sm text-muted-foreground mt-1">We'll show women whose travel dates overlap with yours.</p>
            </div>
          ) : nearby.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="font-display font-semibold">No overlapping trips yet</p>
              <p className="text-sm text-muted-foreground mt-1">No other women are travelling on your dates right now.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {nearby.map((w, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#A1846B]/15 flex items-center justify-center text-[#A1846B] font-medium text-sm">
                      {(w.handle || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">@{w.handle}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {w.trips.length} overlapping {w.trips.length === 1 ? "trip" : "trips"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pl-3 border-l-2 border-[#A1846B]/20 ml-3">
                    {w.trips.map((t) => (
                      <TripCard key={t.id} trip={t} note={`Matches your "${t.match}"`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TripForm open={formOpen} onOpenChange={setFormOpen} initial={editing} onSubmit={submit} />
    </div>
  );
}