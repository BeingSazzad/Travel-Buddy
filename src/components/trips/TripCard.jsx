import React from "react";
import { MapPin, Users, Calendar, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { tripStatus, formatDates, imageForCity } from "@/lib/trip-utils";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    className: "bg-black/50 backdrop-blur-md text-brand-gold border border-primary/40",
  },
  active: {
    label: "Active Now",
    className: "bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40",
  },
  previous: {
    label: "Past Trip",
    className: "bg-black/50 backdrop-blur-md text-white/70 border border-white/10",
  },
};

export default function TripCard({
  trip,
  overlapCount = null,
  onPress,
  note = "",
}) {
  const status = tripStatus(trip);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;

  const hasValidCover =
    trip.cover_image &&
    typeof trip.cover_image === "string" &&
    (trip.cover_image.startsWith("http") || trip.cover_image.startsWith("blob:"));
  const imageUrl = hasValidCover ? trip.cover_image : imageForCity(trip.city);

  const interactive = Boolean(onPress);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onPress}
      onKeyDown={interactive ? (e) => e.key === "Enter" && onPress() : undefined}
      className={cn(
        "relative h-[232px] rounded-3xl overflow-hidden border border-border/60 shadow-soft group transition-all duration-300",
        interactive && "interactive-card cursor-pointer tap-feedback hover:border-primary/40"
      )}
    >
      <Image
        src={imageUrl}
        alt={trip.name}
        fittingType="fill"
        className="absolute inset-0 w-full h-full object-cover image-zoom"
      />

      <div className="gradient-overlay" />

      <span
        className={cn(
          "absolute top-3 right-3 z-20 text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1",
          config.className
        )}
      >
        {status === "active" && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
        {config.label}
      </span>

      <div className="absolute bottom-0 inset-x-0 z-20 p-4 flex flex-col gap-2.5">
        <div>
          <h3
            className="font-display font-bold text-base text-white leading-snug drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)] group-hover:text-brand-gold transition-colors"
          >
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-white/85 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" strokeWidth={1.75} />
            <span className="truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.55)]">
              {trip.city}{trip.country ? `, ${trip.country}` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15">
          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium min-w-0">
            <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" strokeWidth={1.5} />
            <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {formatDates(trip)}
            </span>
          </div>

          {trip.travel_style && (
            <span
              className="shrink-0 text-[11px] font-semibold capitalize px-2.5 py-0.5 rounded-full bg-white/12 border border-white/25 text-white backdrop-blur-sm"
            >
              {trip.travel_style}
            </span>
          )}
        </div>

        {overlapCount != null && (
          <div className="flex items-center gap-1.5 text-xs text-white/75 font-medium">
            <Users className="w-3.5 h-3.5 text-brand-gold shrink-0" strokeWidth={1.75} />
            <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
              {overlapCount > 0
                ? `${overlapCount} ${overlapCount === 1 ? "woman" : "women"} travelling on same dates`
                : "No overlapping trips yet"}
            </span>
          </div>
        )}

        {note && (
          <div className="flex items-center gap-1.5 text-xs text-brand-gold font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            <span className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
