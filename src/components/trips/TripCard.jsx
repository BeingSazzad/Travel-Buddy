import React from "react";
import { MapPin, Users, Pencil, Trash2, Calendar, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { tripStatus, formatDates, imageForCity } from "@/lib/trip-utils";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    className: "bg-black/50 backdrop-blur-md text-[#F5C99A] border border-[#A1846B]/40",
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
  canEdit = false,
  onEdit = () => {},
  onDelete = () => {},
  note = "",
}) {
  const status = tripStatus(trip);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;

  // Use reliable image URL fallback if cover_image is missing or empty
  const hasValidCover = trip.cover_image && typeof trip.cover_image === "string" && trip.cover_image.startsWith("http");
  const imageUrl = hasValidCover ? trip.cover_image : imageForCity(trip.city);

  return (
    <div className="rounded-[24px] overflow-hidden border border-border/80 shadow-soft bg-card group hover:border-[#A1846B]/40 transition-all duration-300">
      {/* Cover Image Container */}
      <div className="h-44 relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={trip.name}
          fittingType="fill"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-transparent" />

        {/* Status Pill */}
        <span
          className={cn(
            "absolute top-3 right-3 text-[11px] font-semibold px-3 py-1 rounded-full shadow-md flex items-center gap-1",
            config.className
          )}
        >
          {status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          {config.label}
        </span>

        {/* Edit & Delete Floating Buttons */}
        {canEdit && (
          <div className="absolute top-3 left-3 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 hover:bg-black/70 transition"
              aria-label="Edit trip"
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(trip); }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-400 active:scale-90 hover:bg-black/70 transition"
              aria-label="Delete trip"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        )}
      </div>

      {/* Card Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-bold text-base text-foreground leading-snug group-hover:text-[#A1846B] transition-colors">
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#A1846B] shrink-0" strokeWidth={1.75} />
            <span className="truncate">{trip.city}{trip.country ? `, ${trip.country}` : ""}</span>
          </div>
        </div>

        {/* Dates & Travel Style */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#A1846B]/80" strokeWidth={1.5} />
            <span>{formatDates(trip)}</span>
          </div>

          {trip.travel_style && (
            <span className="text-[11px] font-semibold text-[#A1846B] capitalize px-2.5 py-0.5 rounded-full bg-[#A1846B]/12 border border-[#A1846B]/20">
              {trip.travel_style}
            </span>
          )}
        </div>

        {/* Overlapping Companions Banner */}
        {overlapCount != null && (
          <div className="rounded-xl bg-[#A1846B]/8 border border-[#A1846B]/15 p-2.5 flex items-center gap-2 text-xs font-medium text-foreground">
            <Users className="w-4 h-4 text-[#A1846B] shrink-0" strokeWidth={1.75} />
            <span className="flex-1 text-xs">
              {overlapCount > 0
                ? `${overlapCount} ${overlapCount === 1 ? "woman" : "women"} travelling on same dates`
                : "No overlapping trips yet"}
            </span>
          </div>
        )}

        {note && (
          <div className="flex items-center gap-1.5 text-xs text-[#A1846B] font-semibold">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}