import React from "react";
import EventCard from "./EventCard";
import { cn } from "@/lib/utils";

/** One full-width event card per row. */
export default function EventList({ events, className = "" }) {
  if (!events?.length) return null;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
