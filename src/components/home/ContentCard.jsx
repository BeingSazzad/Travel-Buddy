import React from "react";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

const TYPE_BADGE = {
  deal: "Deal",
  event: "Event",
  trip: "Trip",
};

export default function ContentCard({ item, onClick }) {
  const badge = TYPE_BADGE[item.type];

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[180px] h-[240px] shrink-0 rounded-3xl overflow-hidden border border-border/60 shadow-soft interactive-card group z-10 text-left"
    >
      <Image
        src={item.image}
        alt={item.title}
        fittingType="fill"
        className="absolute inset-0 w-full h-full object-cover image-zoom"
      />

      <div className="gradient-overlay" />

      {item.type !== "member" && (
        <div className="absolute top-3 right-3 z-20">
          <SaveButton item={item} variant="overlay" />
        </div>
      )}

      {badge && (
        <span className="absolute top-3 left-3 z-20 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
          {badge}
        </span>
      )}

      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end">
        <h3 className="font-display font-semibold text-sm text-white leading-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
          {item.title}
        </h3>

        {item.location && (
          <div className="flex items-center gap-1 mt-1 text-[11px] text-white/85 min-w-0">
            <MapPin className="w-3 h-3 shrink-0 text-brand-gold" strokeWidth={1.5} />
            <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">{item.location}</span>
          </div>
        )}

        {item.info && (
          <p className="text-[11px] text-brand-gold font-medium mt-1 truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
            {item.info}
          </p>
        )}
      </div>
    </button>
  );
}
