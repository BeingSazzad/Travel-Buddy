import React from "react";
import { MapPin, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

export default function HomeDealCard({ item, onClick }) {
  const discount = item.info || item.discount || "Deal";
  const saveItem = {
    type: "deal",
    title: item.title,
    location: item.location,
    image: item.image,
    dealId: item.dealId,
    item_key: item.dealId ? `deal:${item.dealId}` : undefined,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[210px] shrink-0 rounded-3xl overflow-hidden border border-border/60 bg-card shadow-soft interactive-card group text-left"
    >
      <div className="relative h-[110px]">
        <Image
          src={item.image}
          alt={item.title}
          fittingType="fill"
          className="w-full h-full object-cover image-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
        <span className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full gradient-brand-accent text-white border border-white/15 shadow-sm">
          <Tag className="w-3 h-3" strokeWidth={2} />
          {discount}
        </span>
        <div className="absolute top-2.5 right-2.5 z-20" onClick={(e) => e.stopPropagation()}>
          <SaveButton item={saveItem} variant="overlay" />
        </div>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2">
          {item.title}
        </h3>
        <p className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
          <span className="truncate">{item.location}</span>
        </p>
        {item.partner && (
          <p className="text-[10px] text-primary font-semibold mt-1 truncate uppercase tracking-wider">
            {item.partner}
          </p>
        )}
      </div>
    </button>
  );
}
