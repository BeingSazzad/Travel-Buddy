import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import GoingFaces from "@/components/common/GoingFaces";
import { fmtEventDate, fmtEventTime } from "@/lib/event-options";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const going = event.attendees_count || event.attendees?.length || 0;
  const avatars = (event.attendees || [])
    .slice(0, 3)
    .map((a) => a.avatar)
    .filter(Boolean);
  const location = [event.city, event.country].filter(Boolean).join(", ");
  const start = fmtEventTime(event.time || event.start_time);
  const badge = [fmtEventDate(event.date), start].filter(Boolean).join(" · ");
  const meet = event.location && event.location !== event.city ? event.location : "";

  return (
    <OverlayMediaCard
      image={event.image}
      title={event.title}
      location={location}
      meta={meet || undefined}
      badge={badge}
      saveItem={{
        type: "event",
        title: event.title,
        location,
        country: event.country,
        image: event.image,
        date: event.date,
        eventId: event.id,
        item_key: `event:${event.id}`,
      }}
      onClick={() => navigate(`/events/${event.id}`)}
      endSlot={going > 0 ? <GoingFaces count={going} avatars={avatars} /> : undefined}
    />
  );
}
