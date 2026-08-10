import React from "react";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

export default function ContentCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative w-[180px] h-[240px] shrink-0 rounded-[24px] overflow-hidden border border-border/10 shadow-soft cursor-pointer card-press z-10"
    >
      {/* Full Card Image */}
      <Image src={item.image} alt={item.title} fittingType="fill" className="absolute inset-0 w-full h-full object-cover" />

      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

      {/* Floating Save Button */}
      {item.type !== "member" && (
        <div className="absolute top-3 right-3 z-20">
          <SaveButton item={item} className="bg-black/30 backdrop-blur-md border border-white/10 hover:bg-black/50 text-white rounded-full p-1" />
        </div>
      )}

      {/* Floating Top-Left Badge (e.g. Event/Deal category tag) */}
      {item.type && (
        <span className="absolute top-3 left-3 z-20 text-[10px] uppercase tracking-wider font-semibold bg-[#B58E72] text-white px-2.5 py-1 rounded-full shadow-sm">
          {item.type === "deal" ? "DEAL" : item.type === "event" ? "EVENT" : item.type === "trip" ? "TRIP" : "EXPLORE"}
        </span>
      )}

      {/* Bottom Text Overlay */}
      <div className="absolute bottom-0 inset-x-0 p-4 z-20 flex flex-col justify-end">
        <h3 className="font-display font-semibold text-sm text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          {item.title}
        </h3>

        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-white/80">
          <MapPin className="w-3 h-3 shrink-0 text-[#B58E72]" strokeWidth={1.5} />
          <span className="truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{item.location}</span>
        </div>

        {item.info && (
          <p className="text-[10px] text-[#B58E72] font-semibold mt-1 tracking-wide uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {item.info}
          </p>
        )}
      </div>
    </div>
  );
}