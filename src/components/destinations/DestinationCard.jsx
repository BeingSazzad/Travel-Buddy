import React from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { cn } from "@/lib/utils";

function saveItem(destination) {
  return {
    type: "destination",
    title: destination.city,
    location: destination.city,
    country: destination.country,
    image: destination.image,
  };
}

function metaLine(destination) {
  const members = destination.stats?.members;
  const events = destination.stats?.events;
  const parts = [];
  if (members) parts.push(`${members} women`);
  if (events) parts.push(`${events} events`);
  return parts.join(" · ");
}

export default function DestinationCard({ destination, variant = "list" }) {
  const navigate = useNavigate();
  const featured = variant === "featured";
  const meta = metaLine(destination);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${destination.city}, ${destination.country}`}
      onClick={() => navigate(`/destinations/${encodeURIComponent(destination.city)}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/destinations/${encodeURIComponent(destination.city)}`);
        }
      }}
      className={cn(
        "relative overflow-hidden border border-border/10 shadow-soft interactive-card group text-left cursor-pointer",
        featured
          ? "w-[11.25rem] h-[14rem] shrink-0 rounded-3xl"
          : "w-full h-48 rounded-3xl border border-border/60"
      )}
    >
      <Image
        src={destination.image}
        alt={destination.city}
        fittingType="fill"
        className="absolute inset-0 w-full h-full object-cover image-zoom"
      />
      <div className={featured ? "gradient-overlay" : "gradient-overlay-soft"} />

      <div
        className="absolute top-3 right-3 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <SaveButton item={saveItem(destination)} variant="overlay" />
      </div>

      <div className={cn("absolute bottom-0 inset-x-0 z-20", featured ? "p-3.5" : "p-4")}>
        <h3
          className={cn(
            "font-display font-semibold text-white leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]",
            featured ? "text-lg" : "text-xl"
          )}
        >
          {destination.city}
        </h3>
        <p className="text-[11px] text-white/85 truncate mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
          {destination.country}
        </p>
        {!featured && meta && (
          <p className="text-[11px] text-white/75 mt-1.5 truncate">{meta}</p>
        )}
      </div>
    </div>
  );
}
