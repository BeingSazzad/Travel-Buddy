import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { CONTINENTS, WEATHERS, TAG_FILTERS } from "@/lib/destinations";
import { useDestinations } from "@/lib/useContent";
import DestinationCard from "@/components/destinations/DestinationCard";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import FilterPicker from "@/components/common/FilterPicker";

const emptyTags = () => Object.fromEntries(TAG_FILTERS.map((t) => [t.key, false]));

export default function Destinations() {
  const [continent, setContinent] = useState("All");
  const [weather, setWeather] = useState("All");
  const [tags, setTags] = useState(emptyTags());
  const { items: destinations, loading } = useDestinations();
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    base44.entities.Trip.list().then(setTrips).catch(() => {});
    base44.entities.Event.list().then(setEvents).catch(() => {});
  }, []);

  const withStats = useMemo(() => {
    return destinations.map((d) => {
      const liveMembers = new Set(trips.filter((t) => t.city === d.city).map((t) => t.created_by_id)).size;
      const liveEvents = events.filter((e) => e.city === d.city).length;
      return {
        ...d,
        stats: {
          members: Math.max(liveMembers, d.counts?.members || 0),
          cafes: d.counts?.cafes || 0,
          restaurants: d.counts?.restaurants || 0,
          hotels: d.counts?.hotels || 0,
          events: Math.max(liveEvents, d.counts?.events || 0),
          deals: d.counts?.deals || 0,
        },
      };
    });
  }, [destinations, trips, events]);

  if (loading) return <p className="text-sm text-muted-foreground text-center pt-20">Loading…</p>;

  const featured = withStats.filter((d) => d.featured);

  const filtered = withStats.filter((d) =>
    (continent === "All" || d.continent === continent) &&
    (weather === "All" || d.weather === weather) &&
    Object.entries(tags).every(([k, v]) => !v || d.tags[k])
  );

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="px-5 safe-pt pb-6">
      <h1 className="font-display font-semibold text-2xl">Destinations</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-5">Curated cities, loved by women who travel</p>

      {/* Featured */}
      <div className="space-y-4 mb-7">
        {featured.map((d) => (
          <DestinationCard key={d.city} destination={d} large />
        ))}
      </div>

      {/* Filters */}
      <h2 className="font-display font-semibold text-base mb-2">Explore</h2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {CONTINENTS.map((c) => (
          <button
            key={c}
            onClick={() => setContinent(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs whitespace-nowrap",
              continent === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {TAG_FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => toggle(t.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs border",
              tags[t.key] ? "bg-[#A1846B] text-white border-[#A1846B]" : "border-border text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
        <FilterPicker title="Weather" value={weather} onChange={setWeather} options={WEATHERS.map((w) => ({ value: w, label: w }))} />
      </div>

      {/* Results */}
      <div className="mt-5 space-y-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No destinations match your filters"
            description="Try a different continent or remove a filter to explore more cities."
            actionLabel="Reset filters"
            onAction={() => { setTags(emptyTags()); setContinent("All"); setWeather("All"); }}
          />
        ) : (
          filtered.map((d) => <DestinationCard key={d.city} destination={d} />)
        )}
      </div>
    </div>
  );
}