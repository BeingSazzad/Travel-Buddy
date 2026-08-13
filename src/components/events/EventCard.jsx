import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { capitalize, fmtEventDate, fmtEventTime } from "@/lib/event-options";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const item = {
    type: "event",
    title: event.title,
    location: [event.city, event.country].filter(Boolean).join(", "),
    country: event.country,
    image: event.image,
    date: event.date,
    eventId: event.id,
    item_key: `event:${event.id}`,
  };

  const when = [
    fmtEventDate(event.date),
    event.time
      ? `${fmtEventTime(event.time)}${event.end_time ? `–${fmtEventTime(event.end_time)}` : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/events/${event.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/events/${event.id}`);
        }
      }}
      className="w-full rounded-3xl overflow-hidden border border-border/60 shadow-soft bg-card interactive-card group text-left cursor-pointer"
    >
      <div className="relative h-44">
        <Image
          src={event.image}
          alt={event.title}
          fittingType="fill"
          className="w-full h-full object-cover image-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
        {event.category && (
          <span className="absolute top-3 left-3 z-20 text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/15">
            {capitalize(event.category)}
          </span>
        )}
        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
          <SaveButton item={item} variant="overlay" />
        </div>
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <h3 className="font-display font-semibold text-[1.05rem] leading-snug tracking-tight line-clamp-2">
          {event.title}
        </h3>
        {when && (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate">{when}</span>
          </p>
        )}
        {event.city && (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
            <span className="truncate">
              {event.city}
              {event.country ? `, ${event.country}` : ""}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
