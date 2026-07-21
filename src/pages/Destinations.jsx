import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { DESTINATIONS, CONTINENTS, WEATHERS, TAG_FILTERS } from "@/lib/destinations";
import DestinationCard from "@/components/destinations/DestinationCard";
import { cn } from "@/lib/utils";

const emptyTags = () => Object.fromEntries(TAG_FILTERS.map((t) => [t.key, false]));

export default function Destinations() {
  const [continent, setContinent] = useState("All");
  const [weather, setWeather] = useState("All");
  const [tags, setTags] = useState(emptyTags());
  const [trips, setTrips] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    base44.entities.Trip.list().then(setTrips).catch(() => {});
    base44.entities.Event.list().then(setEvents).catch(() => {});
  }, []);

  const withStats = useMemo(() => {
    return DESTINATIONS.map((d) => {
      const liveMembers = new Set(trips.filter((t) => t.city === d.city).map((t) => t.created_by_id)).size;
      const liveEvents = events.filter((e) => e.city === d.city).length;
      return {
        ...d,
        stats: {
          members: Math.max(liveMembers, d.counts.members),
          cafes: d.counts.cafes,
          restaurants: d.counts.restaurants,
          hotels: d.counts.hotels,
          events: Math.max(liveEvents, d.counts.events),
          deals: d.counts.deals,
        },
      };
    });
  }, [trips, events]);

  const featured = withStats.filter((d) => d.featured);

  const filtered = withStats.filter((d) =>
    (continent === "All" || d.continent === continent) &&
    (weather === "All" || d.weather === weather) &&
    Object.entries(tags).every(([k, v]) => !v || d.tags[k])
  );

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  return (
    <div className="px-5 pt-12 pb-6">
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
        <select
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
          className="px-3 py-1.5 rounded-full text-xs border border-border bg-background text-foreground"
        >
          {WEATHERS.map((w) => <option key={w} value={w}>Weather: {w}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="mt-5 space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">No destinations match your filters.</p>
        ) : (
          filtered.map((d) => <DestinationCard key={d.city} destination={d} />)
        )}
      </div>
    </div>
  );
}