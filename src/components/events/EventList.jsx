import React from "react";
import EventCard from "./EventCard";

export default function EventList({ events, className = "" }) {
  if (!events?.length) return null;
  return (
    <div className={`space-y-3 ${className}`}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
