import React from "react";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { cn } from "@/lib/utils";

const FRAME =
  "relative overflow-hidden rounded-2xl border border-border/60 shadow-soft interactive-card group text-left cursor-pointer";

export default function OverlayMediaCard({
  image,
  title,
  location,
  meta,
  badge,
  saveItem,
  onClick,
  ariaLabel,
  className = "w-full h-48",
  titleClassName = "text-lg",
  imageClassName,
  endSlot,
  children,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(FRAME, className)}
    >
      <Image
        src={image}
        alt={title}
        fittingType="fill"
        className={cn("absolute inset-0 w-full h-full object-cover image-zoom", imageClassName)}
      />
      <div className="gradient-overlay" />

      {badge ? (
        <span className="absolute top-3 left-3 z-20 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
          {badge}
        </span>
      ) : null}

      {saveItem ? (
        <div
          className="absolute top-3 right-3 z-20"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <SaveButton item={saveItem} variant="overlay" />
        </div>
      ) : null}

      <div className="absolute bottom-0 inset-x-0 z-20 p-4">
        <h3 className={cn("font-display font-semibold text-white leading-tight line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]", titleClassName)}>
          {title}
        </h3>
        {(location || endSlot) ? (
          <div className="flex items-center justify-between gap-2 mt-1.5 min-w-0">
            {location ? (
              <p className="flex items-center gap-1 text-[11px] text-white/85 min-w-0">
                <MapPin className="w-3 h-3 shrink-0 text-brand-gold" strokeWidth={1.5} />
                <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">{location}</span>
              </p>
            ) : <span />}
            {endSlot}
          </div>
        ) : null}
        {meta ? (
          <p className="text-[11px] text-brand-gold font-medium mt-1 truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
            {meta}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
