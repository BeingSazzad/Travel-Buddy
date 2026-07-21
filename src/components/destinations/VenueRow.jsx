import React from "react";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function VenueRow({ venue }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <Image src={venue.img} alt={venue.name} fittingType="fill" className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{venue.name}</p>
        {venue.rating != null && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="w-3 h-3 fill-[#A1846B] text-[#A1846B]" strokeWidth={0} /> {venue.rating.toFixed(1)}
          </span>
        )}
        {venue.note && <p className="text-xs text-[#7a5c44] mt-0.5">{venue.note}</p>}
      </div>
    </div>
  );
}