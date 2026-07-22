import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import DealCard from "@/components/deals/DealCard";
import RedeemSheet from "@/components/deals/RedeemSheet";
import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";

export const DEAL_CATEGORIES = [
  "hotels", "restaurants", "cafes", "tours", "activities",
  "beach_clubs", "travel_insurance", "coworking", "transport",
];

const label = (c) => c.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export default function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("All");
  const [redeem, setRedeem] = useState(null);

  const reload = () => {
    setLoading(true);
    base44.entities.Deal.list("-expiration_date")
      .then((d) => { setDeals(d); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    if (category === "All") return deals;
    return deals.filter((d) => d.category === category);
  }, [deals, category]);

  return (
    <div className="px-5 safe-pt pb-6">
      <div className="flex items-center gap-1.5 text-[#A1846B] mb-1">
        <span className="text-xs font-medium uppercase tracking-wide">Seluna members only</span>
      </div>
      <h1 className="font-display font-semibold text-2xl">Deals</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Exclusive perks from partners who welcome women who travel.</p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 pb-2">
        {["All", ...DEAL_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs whitespace-nowrap border",
              category === c ? "bg-foreground text-background border-foreground" : "border-border text-foreground"
            )}
          >
            {c === "All" ? "All" : label(c)}
          </button>
        ))}
      </div>

      {loading ? (
        <ListSkeleton className="mt-4" count={3} />
      ) : error ? (
        <ErrorState className="mt-6" onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState className="mt-6" icon={Tag} title="No deals here yet" description="Try another category, or check back soon for new partner perks." />
      ) : (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {filtered.map((d) => <DealCard key={d.id} deal={d} onRedeem={setRedeem} />)}
        </div>
      )}

      {redeem && <RedeemSheet deal={redeem} onClose={() => setRedeem(null)} />}
    </div>
  );
}