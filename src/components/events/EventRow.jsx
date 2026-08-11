import React from "react";
import EventCard from "./EventCard";

export default function EventRow({ events }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="flex gap-3 h-scroll pb-1">
      {events.map((e) => (
        <div key={e.id} className="w-64 shrink-0">
          <EventCard event={e} />
        </div>
      ))}
    </div>
  );
}