import React from "react";
import { MapPin, Users, Pencil, Trash2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import { tripStatus, formatDates, imageForCity } from "@/lib/trip-utils";

const STATUS_STYLES = {
  upcoming: "bg-white/90 text-foreground",
  active: "bg-[#A1846B] text-white",
  previous: "bg-white/70 text-muted-foreground",
};

export default function TripCard({ trip, overlapCount, canEdit, onEdit, onDelete, note }) {
  const status = tripStatus(trip);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card">
      <div className="h-40 relative">
        <Image src={trip.cover_image || imageForCity(trip.city)} alt={trip.name} fittingType="fill" className="w-full h-full" />
        <span className={cn("absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize", STATUS_STYLES[status])}>
          {status}
        </span>
        {canEdit && (
          <div className="absolute top-3 left-3 flex gap-2">
            <button onClick={() => onEdit(trip)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition" aria-label="Edit">
              <Pencil className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button onClick={() => onDelete(trip)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition" aria-label="Delete">
              <Trash2 className="w-4 h-4 text-destructive" strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-base">{trip.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
          <span className="truncate">{trip.city}{trip.country ? `, ${trip.country}` : ""}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{formatDates(trip)}</span>
          {trip.travel_style && (
            <span className="text-[11px] font-medium text-[#A1846B] capitalize px-2 py-0.5 rounded-full bg-[#A1846B]/10">
              {trip.travel_style}
            </span>
          )}
        </div>

        {overlapCount != null && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-[#A1846B]" strokeWidth={1.5} />
            <span>
              {overlapCount > 0
                ? `${overlapCount} ${overlapCount === 1 ? "woman" : "women"} with overlapping dates`
                : "No overlapping trips yet"}
            </span>
          </div>
        )}

        {note && <p className="text-[11px] text-[#A1846B] font-medium mt-2">{note}</p>}
      </div>
    </div>
  );
}