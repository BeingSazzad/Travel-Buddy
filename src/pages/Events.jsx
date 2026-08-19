import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, CalendarHeart, Compass, UserCheck } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEvents } from "@/hooks/useEvents";
import { onRefresh } from "@/lib/refresh-bus";
import EventList from "@/components/events/EventList";
import ScrollFilterChips from "@/components/common/ScrollFilterChips";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
import { EVENT_CATEGORIES, capitalize } from "@/lib/event-options";

const CATEGORY_CHIPS = [
  { key: "all", label: "All" },
  ...EVENT_CATEGORIES.map((c) => ({ key: c, label: capitalize(c) })),
];

const TABS = ["discover", "going", "mine"];

function filterCategory(list, category) {
  if (!category || category === "all") return list;
  return list.filter((e) => e.category === category);
}

export default function Events() {
  const { loading, reload, nearby, hosted, joined, atTrips } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();
  useEffect(() => onRefresh("/events", reload), [reload]);

  const tab = TABS.includes(searchParams.get("tab")) ? searchParams.get("tab") : "discover";
  const setTab = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "discover") next.delete("tab");
    else next.set("tab", value);
    setSearchParams(next, { replace: true });
  };

  const hostedIds = useMemo(() => new Set(hosted.map((e) => e.id)), [hosted]);
  const goingIds = useMemo(() => new Set(joined.map((e) => e.id)), [joined]);

  const discoverFeed = useMemo(
    () =>
      filterCategory(
        nearby.filter((e) => !hostedIds.has(e.id) && !goingIds.has(e.id)),
        category
      ),
    [nearby, hostedIds, goingIds, category]
  );
  const tripFeed = useMemo(
    () =>
      filterCategory(
        atTrips.filter((e) => !hostedIds.has(e.id) && !goingIds.has(e.id)),
        category
      ),
    [atTrips, hostedIds, goingIds, category]
  );

  return (
    <div className="page-shell">
      <ScreenHeader
        title="Events"
        subtitle="Find a meetup, or host one"
        extraActions={
          <button
            type="button"
            onClick={() => navigate("/events/new")}
            className="w-10 h-10 rounded-full fab-primary"
            aria-label="Host an event"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mt-1">
        <TabsList className="grid grid-cols-3 w-full h-11 bg-muted/50 p-1 rounded-2xl gap-1">
          <TabsTrigger value="discover" className="rounded-xl text-xs font-semibold px-2">
            Discover
          </TabsTrigger>
          <TabsTrigger value="going" className="rounded-xl text-xs font-semibold px-2">
            Going
          </TabsTrigger>
          <TabsTrigger value="mine" className="rounded-xl text-xs font-semibold px-2">
            My events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-4">
          <div className="mb-4">
            <ScrollFilterChips items={CATEGORY_CHIPS} active={category} onSelect={setCategory} />
          </div>

          {loading ? (
            <ListSkeleton count={3} />
          ) : discoverFeed.length === 0 && tripFeed.length === 0 ? (
            <EmptyState
              icon={Compass}
              title={category === "all" ? "No events to discover" : `No ${capitalize(category)} events`}
              description="Host a meetup, or check back as more women publish plans."
              actionLabel="Host an event"
              onAction={() => navigate("/events/new")}
            />
          ) : (
            <>
              {tripFeed.length > 0 && (
                <section className="mb-6">
                  <h2 className="section-header mb-3">Near your trips</h2>
                  <EventList events={tripFeed} />
                </section>
              )}
              {discoverFeed.length > 0 && (
                <section>
                  {tripFeed.length > 0 && <h2 className="section-header mb-3">Upcoming</h2>}
                  <EventList events={discoverFeed} />
                </section>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="going" className="mt-5">
          {loading ? (
            <ListSkeleton count={3} />
          ) : joined.length === 0 ? (
            <EmptyState
              icon={UserCheck}
              title="You’re not going to any events yet"
              description="Join a meetup from Discover — it will land here."
              actionLabel="Discover events"
              onAction={() => setTab("discover")}
            />
          ) : (
            <EventList events={joined} />
          )}
        </TabsContent>

        <TabsContent value="mine" className="mt-5">
          {loading ? (
            <ListSkeleton count={3} />
          ) : hosted.length === 0 ? (
            <EmptyState
              icon={CalendarHeart}
              title="No events you’re hosting"
              description="Create a meetup and manage it from this tab."
              actionLabel="Host an event"
              onAction={() => navigate("/events/new")}
            />
          ) : (
            <EventList events={hosted} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
