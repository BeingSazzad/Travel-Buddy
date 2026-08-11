import React from "react";
import EventListItem from "./EventListItem";

export default function EventList({ events, className = "" }) {
  if (!events?.length) return null;
  return (
    <div className={`space-y-2 ${className}`}>
      {events.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}
    </div>
  );
}
