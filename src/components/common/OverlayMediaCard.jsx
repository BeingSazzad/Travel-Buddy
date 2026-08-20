import React from "react";
import { MapPin, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";
import { cn } from "@/lib/utils";

const FRAME =
  "relative overflow-hidden rounded-[1.25rem] border border-white/10 shadow-soft interactive-card group text-left cursor-pointer ring-1 ring-black/5";

export default function OverlayMediaCard({
  image,
  title,
  location,
  meta,
  rating,
  reviews,
  badge,
  saveItem,
  topRight,
  onClick,
  ariaLabel,
  className = "w-full h-48",
  titleClassName = "text-[17px]",
  imageClassName,
  endSlot,
  children,
}) {
  const ratingLabel =
    rating != null && Number.isFinite(Number(rating))
      ? Number(rating).toFixed(1)
      : null;
  const reviewCount =
    reviews != null && Number.isFinite(Number(reviews)) && Number(reviews) > 0
      ? Number(reviews)
      : null;

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
        className={cn(
          "absolute inset-0 w-full h-full object-cover image-zoom transition-transform duration-700 ease-out",
          imageClassName
        )}
      />

      {/* Atmospheric scrim — photo stays vivid up top, type sits in deep velvet bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,10,9,0.42) 0%, rgba(12,10,9,0.08) 28%, rgba(12,10,9,0.15) 48%, rgba(12,10,9,0.72) 72%, rgba(12,10,9,0.94) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 70%)",
        }}
      />

      {badge ? (
        <span className="absolute top-3.5 left-3.5 z-20 max-w-[70%] truncate text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/25 shadow-sm">
          {badge}
        </span>
      ) : null}

      {topRight || saveItem ? (
        <div
          className="absolute top-3.5 right-3.5 z-20"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {topRight || <SaveButton item={saveItem} variant="overlay" className="w-9 h-9" />}
        </div>
      ) : null}

      <div className="absolute bottom-0 inset-x-0 z-20 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-display font-semibold text-white leading-[1.2] line-clamp-2 tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]",
              titleClassName
            )}
          >
            {title}
          </h3>
          {ratingLabel ? (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-2 py-1 mt-0.5 shadow-sm">
              <Star className="w-3 h-3 fill-brand-gold text-brand-gold" strokeWidth={0} />
              <span className="text-[11px] font-semibold tabular-nums text-white">{ratingLabel}</span>
              {reviewCount != null ? (
                <>
                  <span className="text-white/40 text-[10px]">·</span>
                  <span className="text-[10px] font-medium tabular-nums text-white/80">
                    {reviewCount.toLocaleString()}
                  </span>
                </>
              ) : null}
            </span>
          ) : null}
        </div>

        {(location || endSlot || meta) ? (
          <div className="flex items-center justify-between gap-3 mt-2.5 min-w-0">
            <div className="min-w-0 space-y-1">
              {location ? (
                <p className="flex items-center gap-1.5 text-[12px] text-white/85 min-w-0">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-gold" strokeWidth={1.75} />
                  <span className="truncate">{location}</span>
                </p>
              ) : null}
              {!ratingLabel && meta ? (
                <p className="text-[11px] text-brand-gold/95 font-medium truncate pl-5">{meta}</p>
              ) : meta && ratingLabel ? (
                <p className="text-[11px] text-white/70 truncate pl-5">{meta}</p>
              ) : null}
            </div>
            {endSlot}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
