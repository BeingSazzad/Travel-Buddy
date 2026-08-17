import React from "react";
import EventCard from "./EventCard";
import { cn } from "@/lib/utils";

/** Horizontal scroll — ~1.6 cards visible so titles stay readable. */
export default function EventList({ events, className = "" }) {
  if (!events?.length) return null;
  return (
    <div className={cn("flex gap-3 h-scroll pb-1", className)}>
      {events.map((event) => (
        <div key={event.id} className="w-[62%] max-w-[240px] shrink-0">
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}
