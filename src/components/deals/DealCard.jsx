import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Share2, Clock, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";
import SaveButton from "@/components/common/SaveButton";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function DealCard({ deal, onRedeem }) {
  const navigate = useNavigate();
  const saveItem = {
    type: "deal",
    title: deal.title,
    location: deal.city,
    country: deal.country,
    image: deal.image,
    dealId: deal.id,
  };

  const expired =
    deal.expiration_date && new Date(deal.expiration_date) < new Date(new Date().toDateString());

  const onShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: deal.title,
          text: `${deal.discount} at ${deal.partner}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${deal.title} — ${deal.discount} at ${deal.partner}`);
        alert("Deal copied");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/deals/${deal.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/deals/${deal.id}`);
        }
      }}
      className="rounded-3xl overflow-hidden border border-border/60 shadow-soft bg-card interactive-card group text-left cursor-pointer"
    >
      <div className="relative h-44">
        <Image
          src={deal.image}
          alt={deal.partner}
          fittingType="fill"
          className="w-full h-full object-cover image-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />
        <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full gradient-brand-accent text-white border border-white/15 shadow-sm">
          <Tag className="w-3 h-3" strokeWidth={1.5} />
          {deal.discount}
        </span>
        <div className="absolute top-3 right-3 z-20 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <SaveButton item={saveItem} variant="overlay" />
          <button
            type="button"
            onClick={onShare}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/30 flex items-center justify-center tap-feedback"
            aria-label="Share deal"
          >
            <Share2 className="w-4 h-4 text-white" strokeWidth={1.75} />
          </button>
        </div>
        {expired && (
          <div className="absolute inset-0 z-10 bg-foreground/50 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-white text-foreground text-xs font-semibold">
              Expired
            </span>
          </div>
        )}
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">{deal.partner}</p>
        <h3 className="font-display font-semibold text-[1.05rem] leading-snug tracking-tight mt-0.5">
          {deal.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
          <span className="truncate">
            {deal.city}
            {deal.country ? `, ${deal.country}` : ""}
          </span>
          {deal.expiration_date && (
            <>
              <span className="text-muted-foreground/50">·</span>
              <Clock className="w-3.5 h-3.5 shrink-0 text-primary/80" strokeWidth={1.5} />
              <span className="shrink-0">{fmtDate(deal.expiration_date)}</span>
            </>
          )}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRedeem?.(deal);
          }}
          disabled={expired}
          className="w-full mt-3.5 h-10 rounded-full gradient-brand-accent text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed tap-feedback shadow-sm"
        >
          {expired ? "Expired" : "Redeem deal"}
        </button>
      </div>
    </div>
  );
}
