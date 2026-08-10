import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, CalendarOff, CalendarHeart } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import { useEvents } from "@/hooks/useEvents";
import { onRefresh } from "@/lib/refresh-bus";
import EventCard from "@/components/events/EventCard";
import EventRow from "@/components/events/EventRow";
import ListSkeleton from "@/components/common/ListSkeleton";
import { EVENT_CATEGORIES, capitalize } from "@/lib/event-options";

export default function Events() {
  const { loading, rsvp, reload, joinedIds, byCategory, nearby, popular, joined, saved, atTrips } = useEvents();
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  useEffect(() => onRefresh("/events", reload), [reload]);

  const filtered = category === "All" ? null : byCategory(category);

  const Section = ({ title, events }) => (
    <section className="mt-6">
      <h2 className="font-display font-semibold text-base mb-3">{title}</h2>
      <EventRow events={events} joinedIds={joinedIds} onRsvp={rsvp} />
    </section>
  );

  return (
    <div className="px-5 safe-pt pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-lg">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Join or host a meetup</p>
        </div>
        <button
          onClick={() => navigate("/events/new")}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center active:scale-95 transition"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar app-gutter-x pb-2">
        {["All", ...EVENT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${category === c ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
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
          <div className="space-y-4 mt-5">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} joined={joinedIds.has(e.id)} onRsvp={rsvp} />
            ))}
          </div>
        )
      ) : (
        <>
          {nearby.length > 0 && <Section title="Nearby" events={nearby} />}
          {atTrips.length > 0 && <Section title="At your trip destinations" events={atTrips} />}
          {popular.length > 0 && <Section title="Popular" events={popular} />}
          {joined.length > 0 && <Section title="Joined by you" events={joined} />}
          {saved.length > 0 && <Section title="Saved events" events={saved} />}
          {nearby.length === 0 && atTrips.length === 0 && (
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