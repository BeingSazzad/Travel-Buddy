import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { cn } from "@/lib/utils";

function HotelStars({ stars }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${stars}-star hotel`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn("w-3 h-3", i < stars ? "fill-brand-gold text-brand-gold" : "text-border")}
          strokeWidth={0}
        />
      ))}
    </span>
  );
}

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const h = hotel;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/hotels/${encodeURIComponent(h.name)}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/hotels/${encodeURIComponent(h.name)}`);
        }
      }}
      className="rounded-3xl overflow-hidden border border-border/60 shadow-soft bg-card interactive-card group text-left cursor-pointer"
    >
      <div className="relative h-44">
        <Image src={h.image} alt={h.name} fittingType="fill" className="w-full h-full object-cover image-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
          <SaveButton
            item={{
              type: "hotel",
              title: h.name,
              location: h.city,
              country: h.country,
              image: h.image,
              rating: h.memberRating,
            }}
            variant="overlay"
          />
        </div>
        <span className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/15 font-medium">
          €{h.pricePerNight}/night
        </span>
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <h3 className="font-display font-semibold text-[1.05rem] leading-snug tracking-tight">
          {h.name}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-sm min-w-0">
          <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold shrink-0" strokeWidth={0} />
          <span className="font-semibold tabular-nums">{h.memberRating.toFixed(1)}</span>
          <span className="text-muted-foreground/50">·</span>
          <span className="text-muted-foreground truncate">
            {h.reviews.toLocaleString()} reviews
          </span>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
          <span className="truncate">
            {h.city}, {h.country}
            <span className="text-muted-foreground/50"> · </span>
            {h.distance} km from centre
          </span>
        </p>

        <div className="mt-2">
          <HotelStars stars={h.stars} />
        </div>
      </div>
    </div>
  );
}
