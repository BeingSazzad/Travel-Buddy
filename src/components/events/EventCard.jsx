import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import GoingFaces from "@/components/common/GoingFaces";
import { fmtEventDate } from "@/lib/event-options";
import { cn } from "@/lib/utils";

/** Compact discovery card — date, title, city + going faces. */
export default function EventCard({ event, className, titleClassName }) {
  const navigate = useNavigate();
  const going = event.attendees_count || event.attendees?.length || 0;
  const avatars = (event.attendees || [])
    .slice(0, 3)
    .map((a) => a.avatar)
    .filter(Boolean);
  const city = event.city || "";

  return (
    <OverlayMediaCard
      image={event.image}
      title={event.title}
      location={city || undefined}
      badge={fmtEventDate(event.date) || undefined}
      saveItem={{
        type: "event",
        title: event.title,
        location: [event.city, event.country].filter(Boolean).join(", "),
        country: event.country,
        image: event.image,
        date: event.date,
        eventId: event.id,
        item_key: `event:${event.id}`,
      }}
      onClick={() => navigate(`/events/${event.id}`)}
      className={cn("w-full h-48", className)}
      titleClassName={cn("text-[17px] leading-snug", titleClassName)}
      endSlot={going > 0 ? <GoingFaces count={going} avatars={avatars} /> : undefined}
    />
  );
}
