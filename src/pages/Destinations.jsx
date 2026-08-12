import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { CONTINENTS, WEATHERS, TAG_FILTERS } from "@/lib/destinations";
import { useDestinations } from "@/lib/useContent";
import DestinationCard from "@/components/destinations/DestinationCard";
import ScrollFilterChips from "@/components/common/ScrollFilterChips";
import ScreenHeader from "@/components/common/ScreenHeader";
import ListSkeleton from "@/components/common/ListSkeleton";
import EmptyState from "@/components/common/EmptyState";
import VenueFilterSheet, { VenueListToolbar, countVenueFilters } from "@/components/common/VenueFilterSheet";
import { MapPin } from "lucide-react";

const emptyTags = () => Object.fromEntries(TAG_FILTERS.map((t) => [t.key, false]));

export default function Destinations() {
  const [continent, setContinent] = useState("All");
  const [weather, setWeather] = useState("All");
  const [tags, setTags] = useState(emptyTags());
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);
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

  const toggle = (k) => setTags((t) => ({ ...t, [k]: !t[k] }));

  const activeFilterCount = countVenueFilters(tags, [weather]);

  const resetFilters = () => {
    setTags(emptyTags());
    setWeather("All");
  };

  const filtersIdle = continent === "All" && weather === "All" && activeFilterCount === 0;

  const featured = useMemo(
    () => withStats.filter((d) => d.featured),
    [withStats]
  );

  const filtered = useMemo(() => {
    let list = withStats.filter((d) =>
      (continent === "All" || d.continent === continent) &&
      (weather === "All" || d.weather === weather) &&
      Object.entries(tags).every(([k, v]) => !v || d.tags[k])
    );
    list = [...list].sort((a, b) =>
      sort === "az"
        ? a.city.localeCompare(b.city)
        : (b.stats?.members || 0) - (a.stats?.members || 0)
    );
    return list;
  }, [withStats, continent, weather, tags, sort]);

  const listItems = useMemo(
    () => (filtersIdle ? filtered.filter((d) => !d.featured) : filtered),
    [filtered, filtersIdle]
  );

  if (loading) {
    return (
      <div className="page-shell">
        <ScreenHeader title="Destinations" subtitle="Cities loved by women who travel" className="mb-4" />
        <ListSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <ScreenHeader title="Destinations" subtitle="Cities loved by women who travel" />

      {filtersIdle && featured.length > 0 && (
        <section className="mb-5">
          <h2 className="section-header text-foreground mb-3">Featured</h2>
          <div className="h-scroll min-w-0 max-w-full">
            <div className="flex gap-3 pb-1">
              {featured.map((d) => (
                <DestinationCard key={d.city} destination={d} variant="featured" />
              ))}
            </div>
          </div>
        </section>
      )}

      <ScrollFilterChips
        items={CONTINENTS.map((c) => ({ key: c, label: c }))}
        active={(c) => continent === c}
        onSelect={setContinent}
      />

      <div className="mt-3">
        <VenueListToolbar
          resultLabel={
            filtersIdle
              ? "More cities"
              : `${listItems.length} ${listItems.length === 1 ? "city" : "cities"}`
          }
          sort={sort}
          onSortChange={setSort}
          sortOptions={[
            { value: "popular", label: "Popular" },
            { value: "az", label: "A–Z" },
          ]}
          filterOpen={filterOpen}
          onFilterOpen={setFilterOpen}
          activeFilterCount={activeFilterCount}
        />
      </div>

      <VenueFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Destination filters"
        description="Narrow by vibe and weather"
        tagLabel="Vibe"
        tagItems={TAG_FILTERS}
        tagActive={tags}
        onTagToggle={toggle}
        activeCount={activeFilterCount}
        onReset={resetFilters}
        pickers={[
          { title: "Weather", value: weather, onChange: setWeather, options: WEATHERS.map((w) => ({ value: w, label: w })) },
        ]}
      />

      <div className="space-y-3.5">
        {listItems.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No destinations match"
            description="Try a different continent or reset filters to see more cities."
            actionLabel="Reset filters"
            onAction={() => {
              resetFilters();
              setContinent("All");
            }}
          />
        ) : (
          listItems.map((d) => <DestinationCard key={d.city} destination={d} />)
        )}
      </div>
    </div>
  );
}
