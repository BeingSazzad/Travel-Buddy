import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { cn } from "@/lib/utils";
import SaveButton from "@/components/common/SaveButton";
import { resolveEventId } from "@/lib/mock-events";

function subtitle(item) {
  if (item.type === "country") return item.info || null;
  if (item.type === "city") {
    return item.country && item.country !== item.title ? item.country : item.info;
  }
  if (item.type === "member") return item.info || [item.location, item.country].filter(Boolean).join(", ");

  const place = [item.location, item.country].filter(Boolean);
  const unique = [...new Set(place.filter((p) => p !== item.title))];
  if (item.type === "event" || item.type === "deal") return item.info || unique.join(" · ");
  return unique.join(" · ") || item.info || null;
}

export default function ResultRow({ item }) {
  const navigate = useNavigate();
  const isMember = item.type === "member";
  const meta = subtitle(item);

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
      className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-card/60 text-left tap-feedback cursor-pointer"
    >
      <div className={cn("shrink-0 overflow-hidden", isMember ? "w-11 h-11 rounded-full" : "w-12 h-12 rounded-xl")}>
        <Image src={item.image} alt="" fittingType="fill" className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display font-semibold text-sm text-foreground truncate">{item.title}</h3>
          {item.rating != null && (
            <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground shrink-0">
              <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
              {item.rating}
            </span>
          )}
        </div>
        {meta && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{meta}</p>
        )}
      </div>

      {!isMember && (
        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
          <SaveButton item={item} variant="ghost" />
        </div>
      )}
    </div>
  );
}
