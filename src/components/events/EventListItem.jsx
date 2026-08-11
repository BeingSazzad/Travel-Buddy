import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { memberAvatar } from "@/lib/images";
import { fmtEventDate } from "@/lib/event-options";

const FALLBACK_ATTENDEE_IDS = ["mock_1", "mock_2", "mock_3"];

function attendeeAvatars(event) {
  const avatars = [];
  if (event.host_avatar) avatars.push(event.host_avatar);
  FALLBACK_ATTENDEE_IDS.forEach((id) => {
    if (avatars.length < 3) avatars.push(memberAvatar(id));
  });
  return avatars.slice(0, 3);
}

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
  if (event.time) parts.push(event.time);
  return parts.join(" · ");
}

export default function EventListItem({ event }) {
  const navigate = useNavigate();
  const going = event.attendees_count || 0;
  const avatars = attendeeAvatars(event);
  const meta = formatMeta(event);

  return (
    <button
      type="button"
      onClick={() => navigate(`/events/${event.id}`)}
      className="w-full flex items-center gap-3 py-3 px-3 rounded-2xl border border-border/50 bg-card/60 interactive-card tap-feedback text-left group"
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
                  className="w-5 h-5 rounded-full object-cover border-2 border-card -ml-1.5 first:ml-0"
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
