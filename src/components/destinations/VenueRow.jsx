import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";

const VENUE_ROUTES = {
  cafe: (name) => `/cafes/${encodeURIComponent(name)}`,
  restaurant: (name) => `/restaurants/${encodeURIComponent(name)}`,
  hotel: (name) => `/hotels/${encodeURIComponent(name)}`,
  deal: () => "/deals",
};

export default function VenueRow({ venue, venueType }) {
  const navigate = useNavigate();
  const route = venueType === "deal"
    ? VENUE_ROUTES.deal()
    : VENUE_ROUTES[venueType]?.(venue.name);

  const content = (
    <>
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
        <Image src={venue.img} alt={venue.name} fittingType="fill" className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{venue.name}</p>
        {venue.rating != null && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="w-3 h-3 fill-primary text-primary" strokeWidth={0} /> {venue.rating.toFixed(1)}
          </span>
        )}
        {venue.note && <p className="text-xs text-brand-strong mt-0.5">{venue.note}</p>}
      </div>
    </>
  );

  if (!route) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-2">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(route)}
      className="w-full flex items-center gap-3 rounded-2xl border border-border bg-card p-2 text-left active:scale-[0.99] transition"
    >
      {content}
    </button>
  );
}
