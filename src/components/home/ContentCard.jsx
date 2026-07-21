import React from "react";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

export default function ContentCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative w-56 shrink-0 rounded-2xl overflow-hidden border border-border bg-card shadow-soft cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="relative h-32">
        <Image src={item.image} alt={item.title} fittingType="fill" className="w-full h-full" />
        {item.badge && (
          <span className="absolute top-2 left-2 text-[10px] font-medium bg-white/90 backdrop-blur text-foreground px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        {item.type !== "member" && <SaveButton item={item} className="absolute top-2 right-2" />}
      </div>

      <div className="p-3">
        <h3 className="font-display font-semibold text-sm text-foreground truncate">{item.title}</h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
          <span className="truncate">{item.location}</span>
        </div>
        {item.info && <p className="text-xs text-[#A1846B] font-medium mt-1">{item.info}</p>}
      </div>
    </div>
  );
}