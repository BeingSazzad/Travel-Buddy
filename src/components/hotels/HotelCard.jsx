import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Bookmark } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSaved } from "@/lib/SavedContext";
import { cn } from "@/lib/utils";

function HotelStars({ stars }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("w-3 h-3", i < stars ? "fill-[#A1846B] text-[#A1846B]" : "text-border")} strokeWidth={0} />
      ))}
    </span>
  );
}

export default function HotelCard({ hotel }) {
  const { isSaved, toggle } = useSaved();
  const navigate = useNavigate();
  const h = hotel;
  const key = `hotel:${h.name}`;
  const saved = isSaved(key);

  return (
    <div onClick={() => navigate(`/hotels/${encodeURIComponent(h.name)}`)} className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card cursor-pointer card-press">
      <div className="relative h-40">
        <Image src={h.image} alt={h.name} fittingType="fill" className="w-full h-full" />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggle({ type: "hotel", title: h.name, location: h.city, country: h.country, image: h.image, rating: h.memberRating }); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition"
          aria-label={saved ? "Unsave" : "Save"}
        >
          <span key={saved ? "on" : "off"} className={cn("inline-flex", saved && "save-pop")}>
            <Bookmark className={cn("w-4 h-4", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
          </span>
        </button>
        <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[#7a5c44] font-medium">€{h.pricePerNight}/night</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight">{h.name}</h3>
          <span className="flex items-center gap-1 text-sm shrink-0">
            <Star className="w-3.5 h-3.5 fill-[#A1846B] text-[#A1846B]" strokeWidth={0} />
            <span className="font-medium">{h.memberRating.toFixed(1)}</span>
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{h.city}, {h.country}</span>
          <span className="mx-1">·</span>
          <span>{h.distance} km from centre</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <HotelStars stars={h.stars} />
          <span className="text-xs text-muted-foreground">{h.reviews} reviews</span>
        </div>
      </div>
    </div>
  );
}