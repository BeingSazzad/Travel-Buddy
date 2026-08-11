import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Bookmark } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSaved } from "@/lib/SavedContext";
import { cn } from "@/lib/utils";
import { PRICE_LABELS } from "@/lib/restaurants";

export default function RestaurantCard({ restaurant }) {
  const { isSaved, toggle } = useSaved();
  const navigate = useNavigate();
  const r = restaurant;
  const key = `restaurant:${r.name}`;
  const saved = isSaved(key);

  return (
    <div onClick={() => navigate(`/restaurants/${encodeURIComponent(r.name)}`)} className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card interactive-card group">
      <div className="relative h-40">
        <Image src={r.image} alt={r.name} fittingType="fill" className="w-full h-full image-zoom" />
        <div className="gradient-overlay-soft" />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle({ type: "restaurant", title: r.name, location: r.city, country: r.country, image: r.image, rating: r.rating }); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center tap-feedback"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <span key={saved ? "on" : "off"} className={cn("inline-flex", saved && "save-pop")}>
            <Bookmark className={cn("w-4 h-4", saved ? "fill-primary text-primary" : "text-foreground")} strokeWidth={1.5} />
          </span>
        </button>
        <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-brand-strong font-medium">
          {PRICE_LABELS[r.price]}
        </span>
        <span className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded-full bg-primary text-white">{r.cuisine}</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight">{r.name}</h3>
          <span className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-primary text-primary" strokeWidth={0} />
            <span className="font-medium">{r.rating.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{r.city}, {r.country}</span>
          <span className="mx-1">·</span>
          <span>{r.distance} km</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{r.reviews} reviews</p>
      </div>
    </div>
  );
}