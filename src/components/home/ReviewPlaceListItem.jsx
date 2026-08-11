import React from "react";
import { ChevronRight, Star } from "lucide-react";
import { Image } from "@/components/ui/image";

const VENUE_LABELS = {
  cafe: "Café",
  hotel: "Hotel",
  restaurant: "Restaurant",
};

export default function ReviewPlaceListItem({ item, onClick }) {
  const label = VENUE_LABELS[item.type] || "Place";
  const rating = item.rating ?? (item.info ? parseFloat(item.info.replace(/[^\d.]/g, "")) : null);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 px-3 rounded-2xl border border-border/50 bg-card/60 interactive-card tap-feedback text-left group"
    >
      <div className="w-[52px] h-[52px] shrink-0 rounded-xl overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={item.title}
          fittingType="fill"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-display font-semibold text-sm leading-snug text-foreground truncate">
            {item.title}
          </h3>
          {rating != null && !Number.isNaN(rating) && (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-primary shrink-0">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" strokeWidth={0} />
              {rating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          <span className="text-brand-strong font-medium">{label}</span>
          <span className="mx-1">·</span>
          {item.location}
        </p>
        {item.reviewSnippet && (
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1 italic">
            “{item.reviewSnippet}”
          </p>
        )}
      </div>

      <ChevronRight
        className="w-4 h-4 shrink-0 text-primary/80 group-hover:text-primary transition-colors"
        strokeWidth={2}
      />
    </button>
  );
}
