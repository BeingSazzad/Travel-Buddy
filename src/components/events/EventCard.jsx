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
      className="w-full rounded-2xl overflow-hidden border border-border shadow-soft bg-card interactive-card group text-left cursor-pointer"
    >
      <div className="relative h-36">
        <Image src={event.image} alt={event.title} fittingType="fill" className="w-full h-full image-zoom" />
        <div className="gradient-overlay-soft" />
        {event.category && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shadow-md bg-primary text-white border border-brand-gold/35">
              {capitalize(event.category)}
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <SaveButton item={item} variant="overlay" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2">{event.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          <span className="shrink-0">
            {fmtEventDate(event.date)}
            {event.time ? ` · ${fmtEventTime(event.time)}` : ""}
            {event.end_time ? `–${fmtEventTime(event.end_time)}` : ""}
          </span>
          {event.city && (
            <>
              <span className="text-border shrink-0">·</span>
              <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span className="truncate">{event.city}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
