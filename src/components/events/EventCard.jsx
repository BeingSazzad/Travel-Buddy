import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, UserCircle } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import SaveButton from "@/components/common/SaveButton";
import { capitalize, fmtEventDate } from "@/lib/event-options";

export default function EventCard({ event, joined, onRsvp }) {
  const full = (event.attendees_count || 0) >= (event.max_attendees || 0);
  const navigate = useNavigate();
  const item = {
    type: "event",
    title: event.title,
    location: [event.city, event.country].filter(Boolean).join(", "),
    country: event.country,
    image: event.image,
    date: event.date,
  };

  return (
    <div onClick={() => navigate(`/events/${event.id}`)} className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card interactive-card group">
      <div className="relative h-40">
        <Image src={event.image} alt={event.title} fittingType="fill" className="w-full h-full image-zoom" />
        <div className="gradient-overlay-soft opacity-50" />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur text-[10px] uppercase tracking-wide font-medium text-[#7a5c44] px-2 py-1 rounded-full">
            {capitalize(event.category)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <SaveButton item={item} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base leading-snug">{event.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{fmtEventDate(event.date)}</span>
          {event.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>}
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{[event.location, event.city].filter(Boolean).join(", ")}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <span className="flex items-center gap-1"><UserCircle className="w-3.5 h-3.5" />{event.host_name || "Seluna"}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{event.attendees_count || 0}/{event.max_attendees || 0} going</span>
          </div>
          <Button
            size="sm"
            variant={joined ? "outline" : "default"}
            onClick={(e) => { e.stopPropagation(); onRsvp(event, joined ? "leave" : "join"); }}
            disabled={!joined && full}
            className={joined ? "" : "bg-foreground text-background"}
          >
            {joined ? "Leave" : full ? "Full" : "Join"}
          </Button>
        </div>
      </div>
    </div>
  );
}