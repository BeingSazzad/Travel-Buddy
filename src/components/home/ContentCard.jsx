import React, { useState } from "react";
import { MapPin, Bookmark } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";

export default function ContentCard({ image, title, location, info, badge, onClick }) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-56 shrink-0 rounded-2xl overflow-hidden border border-border bg-card shadow-soft cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative h-32">
        <Image src={image} alt={title} fittingType="fill" className="w-full h-full" />
        {badge && (
          <span className="absolute top-2 left-2 text-[10px] font-medium bg-white/90 backdrop-blur text-foreground px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition"
          aria-label="Save"
        >
          <Bookmark className={cn("w-4 h-4", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-display font-semibold text-sm text-foreground truncate">{title}</h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
          <span className="truncate">{location}</span>
        </div>
        {info && <p className="text-xs text-[#A1846B] font-medium mt-1">{info}</p>}
      </div>
    </div>
  );
}