import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import DealCard from "@/components/deals/DealCard";
import RedeemSheet from "@/components/deals/RedeemSheet";
import ScrollFilterChips from "@/components/common/ScrollFilterChips";
import { Tag } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";
import { MOCK_DEALS } from "@/lib/mock-deals";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";

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
      .then((d) => {
        setDeals(d.length > 0 ? d : useDemoFallbacks ? MOCK_DEALS : []);
        setError(false);
      })
      .catch(() => {
        setDeals(useDemoFallbacks ? MOCK_DEALS : []);
        setError(false);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    if (category === "All") return deals;
    return deals.filter((d) => d.category === category);
  }, [deals, category]);

  return (
    <div className="page-shell">
      <div className="flex items-center gap-1.5 text-primary mb-1">
        <span className="text-xs font-medium uppercase tracking-wide">Seluna members only</span>
      </div>
      <h1 className="font-display font-bold text-lg">Deals</h1>
      <p className="text-sm text-muted-foreground mt-0.5 mb-4">Exclusive perks from partners who welcome women who travel.</p>

      <ScrollFilterChips
        items={["All", ...DEAL_CATEGORIES].map((c) => ({
          key: c,
          label: c === "All" ? "All" : label(c),
        }))}
        active={(c) => category === c}
        onSelect={setCategory}
        activeClass="chip-active"
      />

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