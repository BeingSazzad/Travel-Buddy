import React from "react";
import EventCard from "./EventCard";

/** Horizontal row — same sizing as EventList for readable titles. */
export default function EventRow({ events }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="flex gap-3 h-scroll pb-1">
      {events.map((e) => (
        <div key={e.id} className="w-[62%] max-w-[240px] shrink-0">
          <EventCard event={e} />
        </div>
      ))}
    </div>
  );
}
