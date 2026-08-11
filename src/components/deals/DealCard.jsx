import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Bookmark, Share2, Clock, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSaved } from "@/lib/SavedContext";
import { cn } from "@/lib/utils";
import { savedItemKey } from "@/lib/saved-item-key";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

export default function DealCard({ deal, onRedeem }) {
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const saveItem = {
    type: "deal",
    title: deal.title,
    location: deal.city,
    country: deal.country,
    image: deal.image,
    dealId: deal.id,
  };
  const key = savedItemKey(saveItem);
  const saved = isSaved(key);

  const expired = deal.expiration_date && new Date(deal.expiration_date) < new Date(new Date().toDateString());

  const onShare = async (e) => {
    e.stopPropagation();
    try {
      if (navigator.share) await navigator.share({ title: deal.title, text: `${deal.discount} at ${deal.partner}`, url: window.location.href });
      else { await navigator.clipboard.writeText(`${deal.title} — ${deal.discount} at ${deal.partner}`); alert("Deal copied"); }
    } catch (err) {}
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/deals/${deal.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/deals/${deal.id}`)}
      className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card interactive-card group cursor-pointer tap-feedback"
    >
      <div className="relative h-36">
        <Image src={deal.image} alt={deal.partner} fittingType="fill" className="w-full h-full image-zoom" />
        <div className="gradient-overlay-soft" />
        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full gradient-brand-accent text-white text-xs font-semibold flex items-center gap-1 shadow-sm z-20">
          <Tag className="w-3 h-3" strokeWidth={1.5} /> {deal.discount}
        </span>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle(saveItem);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center tap-feedback"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <span key={saved ? "on" : "off"} className={cn("inline-flex", saved && "save-pop")}>
              <Bookmark className={cn("w-4 h-4", saved ? "fill-primary text-primary" : "text-foreground")} strokeWidth={1.5} />
            </span>
          </button>
          <button onClick={onShare} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center tap-feedback">
            <Share2 className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          </button>
        </div>
        {expired && <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center"><span className="px-3 py-1 rounded-full bg-white text-foreground text-xs font-semibold">Expired</span></div>}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-primary font-medium">{deal.partner}</p>
        <h3 className="font-semibold text-base leading-tight mt-0.5">{deal.title}</h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {deal.city}{deal.country ? `, ${deal.country}` : ""}
          <span className="mx-1">·</span>
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> {fmtDate(deal.expiration_date)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRedeem(deal);
          }}
          disabled={expired}
          className="w-full mt-3 h-10 rounded-full gradient-brand-accent text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed tap-feedback shadow-sm hover:shadow-md transition-shadow"
        >
          {expired ? "Expired" : "Redeem deal"}
        </button>
      </div>
    </div>
  );
}