import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import EventCard from "@/components/events/EventCard";
import EventRow from "@/components/events/EventRow";
import { EVENT_CATEGORIES, capitalize } from "@/lib/event-options";

export default function Events() {
  const { loading, rsvp, joinedIds, byCategory, nearby, popular, joined, saved, atTrips } = useEvents();
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const filtered = category === "All" ? null : byCategory(category);

  const Section = ({ title, events }) => (
    <section className="mt-6">
      <h2 className="font-display font-semibold text-base mb-3">{title}</h2>
      <EventRow events={events} joinedIds={joinedIds} onRsvp={rsvp} />
    </section>
  );

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl">Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Join or host a meetup</p>
        </div>
        <button
          onClick={() => navigate("/events/new")}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center active:scale-95 transition"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
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
        <p className="text-sm text-muted-foreground mt-8">Loading events…</p>
      ) : filtered ? (
        filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground mt-8">No {capitalize(category)} events yet.</p>
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
            <div className="rounded-2xl border border-dashed border-border p-8 text-center mt-6">
              <p className="font-display font-semibold">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">Host the first meetup in your city.</p>
              <button
                onClick={() => navigate("/events/new")}
                className="mt-4 px-4 py-2 rounded-full bg-foreground text-background text-sm"
              >
                Host an event
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}