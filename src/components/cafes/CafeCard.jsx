import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { PRICE_LABELS } from "@/lib/cafes";

export default function CafeCard({ cafe }) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/cafes/${encodeURIComponent(cafe.name)}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/cafes/${encodeURIComponent(cafe.name)}`);
        }
      }}
      className="rounded-3xl overflow-hidden border border-border/60 shadow-soft bg-card interactive-card group text-left cursor-pointer"
    >
      <div className="relative h-44">
        <Image src={cafe.image} alt={cafe.name} fittingType="fill" className="w-full h-full object-cover image-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
          <SaveButton
            item={{
              type: "cafe",
              title: cafe.name,
              location: cafe.city,
              country: cafe.country,
              image: cafe.image,
              rating: cafe.rating,
            }}
            variant="overlay"
          />
        </div>
        <span className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/15 font-medium">
          {PRICE_LABELS[cafe.price]}
        </span>
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <h3 className="font-display font-semibold text-[1.05rem] leading-snug tracking-tight">
          {cafe.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm min-w-0">
          <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold shrink-0" strokeWidth={0} />
          <span className="font-semibold tabular-nums">{cafe.rating.toFixed(1)}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground truncate">
            {cafe.reviews.toLocaleString()} reviews
          </span>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
          <span className="truncate">
            {cafe.city}, {cafe.country}
            <span className="text-muted-foreground/50"> · </span>
            {cafe.distance} km
          </span>
        </p>
      </div>
    </div>
  );
}
