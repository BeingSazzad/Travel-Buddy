import React from "react";
import EventCard from "./EventCard";

/** One full-width event card per row. */
export default function EventRow({ events }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  );
}
