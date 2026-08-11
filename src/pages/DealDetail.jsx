import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Share2, Bookmark, Tag } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useSaved } from "@/lib/SavedContext";
import { cn } from "@/lib/utils";
import { findMockDeal } from "@/lib/mock-deals";
import { savedItemKey } from "@/lib/saved-item-key";
import RedeemSheet from "@/components/deals/RedeemSheet";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

const label = (c) => c?.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()) || "";

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useSaved();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeemOpen, setRedeemOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await base44.entities.Deal.get(id);
        if (!cancelled) setDeal(d);
      } catch {
        const mock = findMockDeal(id);
        if (!cancelled) setDeal(mock || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading deal…
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Deal not found</p>
        <button onClick={() => navigate("/deals")} className="text-sm text-primary underline">
          Back to deals
        </button>
      </div>
    );
  }

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
  const expired =
    deal.expiration_date && new Date(deal.expiration_date) < new Date(new Date().toDateString());

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: deal.title, text: `${deal.discount} at ${deal.partner}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied");
      }
    } catch {
      /* dismissed */
    }
  };

  return (
    <div className="max-w-app mx-auto min-h-dvh flex flex-col bg-background">
      <header className="sticky top-0 z-20 px-app safe-pt pb-3 flex items-center justify-between bg-background/90 backdrop-blur">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback" aria-label="Back">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onShare} className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback" aria-label="Share">
            <Share2 className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => toggle(saveItem)}
            className="w-9 h-9 rounded-full flex items-center justify-center tap-feedback"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark
              className={cn("w-5 h-5", saved ? "fill-primary text-primary" : "text-foreground")}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="relative h-56">
          <Image src={deal.image} alt={deal.partner} fittingType="fill" className="w-full h-full" />
          <div className="gradient-overlay-soft" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full gradient-brand-accent text-white text-xs font-semibold flex items-center gap-1 shadow-sm">
            <Tag className="w-3 h-3" strokeWidth={1.5} /> {deal.discount}
          </span>
          {expired && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-white text-foreground text-xs font-semibold">Expired</span>
            </div>
          )}
        </div>

        <div className="detail-body space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-primary font-medium">{deal.partner}</p>
            <h1 className="font-display font-bold text-xl mt-0.5">{deal.title}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                {deal.city}{deal.country ? `, ${deal.country}` : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
                Expires {fmtDate(deal.expiration_date)}
              </span>
            </div>
            {deal.category && (
              <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                {label(deal.category)}
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium">Member benefit</p>
            <p className="text-2xl font-display font-bold text-primary mt-1">{deal.discount}</p>
            <p className="text-xs text-muted-foreground mt-1">Exclusive to verified Seluna members.</p>
          </div>

          {deal.terms && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Terms & conditions</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{deal.terms}</p>
            </div>
          )}

          <Button
            className="w-full h-12 gradient-brand-accent text-white shadow-sm"
            disabled={expired}
            onClick={() => setRedeemOpen(true)}
          >
            {expired ? "Deal expired" : "Redeem deal"}
          </Button>
        </div>
      </div>

      {redeemOpen && <RedeemSheet deal={deal} onClose={() => setRedeemOpen(false)} />}
    </div>
  );
}
