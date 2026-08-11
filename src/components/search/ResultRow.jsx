import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import SaveButton from "@/components/common/SaveButton";
import { resolveEventId } from "@/lib/mock-events";

export default function ResultRow({ item }) {
  const navigate = useNavigate();
  const isMember = item.type === "member";

  const handleClick = () => {
    if (item.type === "cafe") navigate(`/cafes/${encodeURIComponent(item.title)}`);
    else if (item.type === "restaurant") navigate(`/restaurants/${encodeURIComponent(item.title)}`);
    else if (item.type === "hotel") navigate(`/hotels/${encodeURIComponent(item.title)}`);
    else if (item.type === "destination") navigate(`/destinations/${encodeURIComponent(item.location || item.title)}`);
    else if (item.type === "city") navigate(`/destinations/${encodeURIComponent(item.location || item.title)}`);
    else if (item.type === "country") navigate("/destinations");
    else if (item.type === "event") {
      const eventId = resolveEventId(item);
      navigate(eventId ? `/events/${eventId}` : "/events");
    } else if (item.type === "member") {
      navigate(item.memberId ? `/members/${item.memberId}` : "/discover");
    } else if (item.type === "deal") {
      navigate(item.dealId ? `/deals/${item.dealId}` : "/deals");
    } else if (item.type === "trip") {
      navigate(item.tripId ? `/trips/${item.tripId}` : "/trips");
    } else navigate("/search");
  };

  return (
    <div
      onClick={handleClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-card text-left active:scale-[0.99] transition cursor-pointer"
    >
      <div className={cn("shrink-0 overflow-hidden border border-border", isMember ? "w-12 h-12 rounded-full" : "w-14 h-14 rounded-xl")}>
        <Image src={item.image} alt={item.title} fittingType="fill" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display font-semibold text-sm text-foreground truncate">{item.title}</h3>
          {item.rating != null && (
            <span className="flex items-center gap-0.5 text-xs text-foreground shrink-0 font-medium">
              <Star className="w-3 h-3 fill-primary text-primary" />
              {item.rating}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0 text-primary" strokeWidth={1.5} />
          <span className="truncate">
            {item.location}
            {item.country && item.country !== item.location ? `, ${item.country}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.info && <span className="text-xs text-primary font-medium truncate">{item.info}</span>}
          {item.price && <span className="text-xs text-muted-foreground">{item.price}</span>}
          {item.distance != null && <span className="text-xs text-muted-foreground">{item.distance} km</span>}
        </div>
      </div>

      {!isMember && (
        <div onClick={(e) => e.stopPropagation()}>
          <SaveButton item={item} className="shrink-0 bg-background border border-border" />
        </div>
      )}
    </div>
  );
}