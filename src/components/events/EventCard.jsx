import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import GoingFaces from "@/components/common/GoingFaces";
import TripActionsMenu from "@/components/trips/TripActionsMenu";
import { fmtEventDate } from "@/lib/event-options";
import { eventGoingAvatars } from "@/lib/mock-events";
import { cn } from "@/lib/utils";

/** Compact event card. `manage` = host view (faces + edit). Discover shows a count only. */
export default function EventCard({ event, className, titleClassName, manage = false, onDelete }) {
  const navigate = useNavigate();
  const going = event.attendees_count || event.attendees?.length || 0;
  const avatars = eventGoingAvatars(event);
  const city = event.city || "";
  const saveItem = {
    type: "event",
    title: event.title,
    location: [event.city, event.country].filter(Boolean).join(", "),
    country: event.country,
    image: event.image,
    date: event.date,
    eventId: event.id,
    item_key: `event:${event.id}`,
  };

  return (
    <OverlayMediaCard
      image={event.image}
      title={event.title}
      location={city || undefined}
      badge={fmtEventDate(event.date) || undefined}
      saveItem={manage ? undefined : saveItem}
      topRight={
        manage ? (
          <TripActionsMenu
            overlay
            align="end"
            ariaLabel="Event options"
            editLabel="Edit event"
            deleteLabel="Delete event"
            onEdit={() => navigate(`/events/new?edit=${event.id}`)}
            onDelete={() => onDelete?.(event)}
          />
        ) : undefined
      }
      onClick={() => navigate(`/events/${event.id}`)}
      className={cn("w-full h-48", className)}
      titleClassName={cn("text-[17px] leading-snug", titleClassName)}
      endSlot={
        going > 0 ? (
          manage ? (
            <GoingFaces count={going} avatars={avatars} />
          ) : (
            <span className="text-[11px] text-white font-semibold whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
              {going} going
            </span>
          )
        ) : undefined
      }
    />
  );
}
