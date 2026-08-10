import React from "react";
import EventCard from "./EventCard";

export default function EventRow({ events, joinedIds, onRsvp }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar app-gutter-x pb-1">
      {events.map((e) => (
        <div key={e.id} className="w-72 shrink-0">
          <EventCard event={e} joined={joinedIds.has(e.id)} onRsvp={onRsvp} />
        </div>
      ))}
    </div>
  );
}