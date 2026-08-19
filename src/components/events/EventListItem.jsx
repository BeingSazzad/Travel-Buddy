import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { fmtEventDate, fmtEventTime } from "@/lib/event-options";
import { eventGoingAvatars } from "@/lib/mock-events";

function formatMeta(event) {
  const parts = [];
  if (event.city) parts.push(event.city);
  if (event.date) {
    if (event.end_date && event.end_date !== event.date) {
      parts.push(`${fmtEventDate(event.date)} – ${fmtEventDate(event.end_date)}`);
    } else {
      parts.push(fmtEventDate(event.date));
    }
  }
  if (event.time) {
    parts.push(
      event.end_time
        ? `${fmtEventTime(event.time)}–${fmtEventTime(event.end_time)}`
        : fmtEventTime(event.time)
    );
  }
  return parts.join(" · ");
}

export default function EventListItem({ event }) {
  const navigate = useNavigate();
  const going = event.attendees_count || 0;
  const avatars = eventGoingAvatars(event);
  const meta = formatMeta(event);

  return (
    <button
      type="button"
      onClick={() => navigate(`/events/${event.id}`)}
      className="w-full flex items-center gap-3 py-3 px-3 rounded-3xl border border-border/60 bg-card shadow-soft interactive-card tap-feedback text-left group"
    >
      <div className="w-[52px] h-[52px] shrink-0 rounded-xl overflow-hidden bg-muted">
        <Image
          src={event.image}
          alt={event.title}
          fittingType="fill"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2">
          {event.title}
        </h3>
        {meta && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{meta}</p>
        )}
        {going > 0 && (
          <div className="flex items-center gap-2 mt-1.5 min-w-0">
            <div className="flex items-center shrink-0">
              {avatars.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                    className="w-6 h-6 rounded-full object-cover object-top border-2 border-card -ml-1.5 first:ml-0"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground truncate">{going} going</span>
          </div>
        )}
      </div>

      <ChevronRight
        className="w-4 h-4 shrink-0 text-primary/80 group-hover:text-primary transition-colors"
        strokeWidth={2}
      />
    </button>
  );
}
