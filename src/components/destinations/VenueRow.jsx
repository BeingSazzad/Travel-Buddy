import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";

const VENUE_ROUTES = {
  cafe: (name) => `/cafes/${encodeURIComponent(name)}`,
  restaurant: (name) => `/restaurants/${encodeURIComponent(name)}`,
  hotel: (name) => `/hotels/${encodeURIComponent(name)}`,
  deal: (venue) => (venue.dealId ? `/deals/${venue.dealId}` : "/deals"),
};

export default function VenueRow({ venue, venueType }) {
  const navigate = useNavigate();
  const route =
    venueType === "deal"
      ? VENUE_ROUTES.deal(venue)
      : VENUE_ROUTES[venueType]?.(venue.name);

  const content = (
    <>
      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-muted">
        <Image src={venue.img} alt={venue.name} fittingType="fill" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm truncate">{venue.name}</p>
        {venue.rating != null && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="w-3 h-3 fill-brand-gold text-brand-gold" strokeWidth={0} />
            <span className="font-semibold tabular-nums text-foreground">{venue.rating.toFixed(1)}</span>
          </span>
        )}
        {venue.note && <p className="text-xs text-muted-foreground mt-0.5 truncate">{venue.note}</p>}
      </div>
    </>
  );

  const shell =
    "w-full flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-2.5 text-left shadow-soft";

  if (!route) {
    return <div className={shell}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(route)}
      className={`${shell} interactive-card tap-feedback`}
    >
      {content}
    </button>
  );
}
