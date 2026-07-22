import React from "react";
import { MapPin, Bookmark, Share2, Clock, Tag } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useSaved } from "@/lib/SavedContext";
import { cn } from "@/lib/utils";

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

export default function DealCard({ deal, onRedeem }) {
  const { isSaved, toggle } = useSaved();
  const key = `deal:${deal.id}`;
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
    <div className="rounded-2xl overflow-hidden border border-border shadow-soft bg-card">
      <div className="relative h-36">
        <Image src={deal.image} alt={deal.partner} fittingType="fill" className="w-full h-full" />
        <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[#A1846B] text-white text-xs font-semibold flex items-center gap-1">
          <Tag className="w-3 h-3" strokeWidth={1.5} /> {deal.discount}
        </span>
        <div className="absolute top-2 right-2 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); toggle({ type: "deal", title: deal.title, location: deal.city, country: deal.country, image: deal.image, item_key: key }); }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <span key={saved ? "on" : "off"} className={cn("inline-flex", saved && "save-pop")}>
              <Bookmark className={cn("w-4 h-4", saved ? "fill-[#A1846B] text-[#A1846B]" : "text-foreground")} strokeWidth={1.5} />
            </span>
          </button>
          <button onClick={onShare} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center active:scale-90 transition">
            <Share2 className="w-4 h-4 text-foreground" strokeWidth={1.5} />
          </button>
        </div>
        {expired && <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center"><span className="px-3 py-1 rounded-full bg-white text-foreground text-xs font-semibold">Expired</span></div>}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-[#A1846B] font-medium">{deal.partner}</p>
        <h3 className="font-semibold text-base leading-tight mt-0.5">{deal.title}</h3>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} /> {deal.city}{deal.country ? `, ${deal.country}` : ""}
          <span className="mx-1">·</span>
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} /> {fmtDate(deal.expiration_date)}
        </div>
        <button
          onClick={() => onRedeem(deal)}
          disabled={expired}
          className="w-full mt-3 h-10 rounded-full bg-foreground text-background text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {expired ? "Expired" : "Redeem deal"}
        </button>
      </div>
    </div>
  );
}