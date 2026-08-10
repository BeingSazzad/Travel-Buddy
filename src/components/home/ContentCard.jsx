import React from "react";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

export default function ContentCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[180px] h-[240px] shrink-0 rounded-[24px] overflow-hidden border border-border/10 shadow-soft interactive-card group z-10 text-left"
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
          <SaveButton
            item={item}
            className="bg-black/35 backdrop-blur-md border border-white/15 hover:bg-black/50 text-white rounded-full p-1 tap-feedback"
          />
        </div>
      )}

      {item.type && (
        <span className="absolute top-3 left-3 z-20 text-[10px] uppercase tracking-wider font-semibold gradient-brand-accent text-white px-2.5 py-1 rounded-full shadow-sm">
          {item.type === "deal" ? "DEAL" : item.type === "event" ? "EVENT" : item.type === "trip" ? "TRIP" : "EXPLORE"}
        </span>
      )}

      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end">
        <h3 className="font-display font-semibold text-sm text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          {item.title}
        </h3>

        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/85">
          <MapPin className="w-3 h-3 shrink-0 text-[#F5C99A]" strokeWidth={1.5} />
          <span className="truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{item.location}</span>
        </div>

        {item.info && (
          <p className="text-[10px] text-[#F5C99A] font-semibold mt-1 tracking-wide uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {item.info}
          </p>
        )}
      </div>
    </button>
  );
}
