import React from "react";
import { MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import SaveButton from "@/components/common/SaveButton";

export default function ResultRow({ item }) {
  const isMember = item.type === "member";

  return (
    <div className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-card text-left active:scale-[0.99] transition">
      <div className={cn("shrink-0 overflow-hidden border border-border", isMember ? "w-12 h-12 rounded-full" : "w-14 h-14 rounded-xl")}>
        <Image src={item.image} alt={item.title} fittingType="fill" className="w-full h-full" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold text-sm text-foreground truncate">{item.title}</h3>
          {item.rating != null && (
            <span className="flex items-center gap-0.5 text-xs text-foreground shrink-0">
              <Star className="w-3 h-3 fill-[#A1846B] text-[#A1846B]" />
              {item.rating}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
          <span className="truncate">
            {item.location}
            {item.country && item.country !== item.location ? `, ${item.country}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.info && <span className="text-xs text-[#A1846B] font-medium truncate">{item.info}</span>}
          {item.price && <span className="text-xs text-muted-foreground">{item.price}</span>}
          {item.distance != null && <span className="text-xs text-muted-foreground">{item.distance} km</span>}
        </div>
      </div>

      {!isMember && (
        <SaveButton item={item} className="shrink-0 bg-background border border-border" />
      )}
    </div>
  );
}