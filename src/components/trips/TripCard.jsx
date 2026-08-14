import React from "react";
import { MapPin } from "lucide-react";
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
        "relative h-48 rounded-3xl overflow-hidden border border-border/60 shadow-soft group transition-all duration-300",
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
          "absolute top-3 left-3 z-20 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1",
          config.className
        )}
      >
        {status === "active" && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
        {config.label}
      </span>

      <div className="absolute bottom-0 inset-x-0 z-20 p-4">
        <h3 className="font-display font-semibold text-lg text-white leading-snug drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
          {trip.name}
        </h3>
        <p className="flex items-center gap-1 mt-1 text-[11px] text-white/85 min-w-0">
          <MapPin className="w-3 h-3 shrink-0 text-brand-gold" strokeWidth={1.5} />
          <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
            {[trip.city, trip.country].filter(Boolean).join(", ")}
          </span>
        </p>
        <p className="text-[11px] text-brand-gold font-medium mt-1 truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
          {formatDates(trip)}
          {overlapCount > 0 ? ` · ${overlapCount} overlapping` : ""}
        </p>
        {note ? (
          <p className="text-[11px] text-brand-gold font-medium mt-1 truncate">{note}</p>
        ) : null}
      </div>
    </div>
  );
}
