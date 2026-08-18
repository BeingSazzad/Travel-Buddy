import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CalendarOff, CalendarHeart } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import { onRefresh } from "@/lib/refresh-bus";
import EventList from "@/components/events/EventList";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
import { EVENT_CATEGORIES, capitalize } from "@/lib/event-options";

export default function Events() {
  const { loading, reload, byCategory, nearby, popular, hosted, joined, saved, atTrips } = useEvents();
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  useEffect(() => onRefresh("/events", reload), [reload]);

  const filtered = category === "All" ? null : byCategory(category);
  const hostedIds = new Set(hosted.map((e) => e.id));
  const upcomingFeed = nearby.filter((e) => !hostedIds.has(e.id));

  const Section = ({ title, events }) => (
    <section className="mt-6">
      <h2 className="section-header mb-3">{title}</h2>
      <EventList events={events} />
    </section>
  );

  return (
    <div className="page-shell">
      <ScreenHeader
        title="Events"
        subtitle="Join or host a meetup"
        extraActions={
          <button
            onClick={() => navigate("/events/new")}
            className="w-10 h-10 rounded-full fab-primary"
          >
            <Plus className="w-5 h-5" strokeWidth={1.5} />
          </button>
        }
      />

      <div className="flex gap-2 h-scroll pb-3 -mx-0">
        {["All", ...EVENT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border ${category === c ? "chip-active" : "chip-inactive"}`}
          >
            {c === "All" ? "All" : capitalize(c)}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton className="mt-5" count={3} />
      ) : filtered ? (
        filtered.length === 0 ? (
          <EmptyState className="mt-6" icon={CalendarOff} title={`No ${capitalize(category)} events yet`} description={`Be the first to host a ${capitalize(category)} meetup in your area.`} />
        ) : (
          <EventList events={filtered} className="mt-5" />
        )
      ) : (
        <>
          {hosted.length > 0 && (
            <section className="mt-5">
              <h2 className="font-display font-semibold text-base mb-3">Hosting</h2>
              <EventList events={hosted} />
            </section>
          )}
          {upcomingFeed.length > 0 && (
            <section className={hosted.length > 0 ? "mt-6" : "mt-5"}>
              <h2 className="font-display font-semibold text-base mb-3">Upcoming events</h2>
              <EventList events={upcomingFeed.slice(0, 5)} />
            </section>
          )}
          {atTrips.length > 0 && <Section title="At your trip destinations" events={atTrips} />}
          {popular.length > 0 && <Section title="Popular" events={popular} />}
          {joined.length > 0 && <Section title="Joined by you" events={joined} />}
          {saved.length > 0 && <Section title="Saved events" events={saved} />}
          {hosted.length === 0 && nearby.length === 0 && atTrips.length === 0 && (
            <EmptyState
              className="mt-6"
              icon={CalendarHeart}
              title="No events nearby"
              description="Be the first to host a meetup in your city."
              actionLabel="Host an event"
              onAction={() => navigate("/events/new")}
            />
          )}
        </>
      )}
    </div>
  );
}