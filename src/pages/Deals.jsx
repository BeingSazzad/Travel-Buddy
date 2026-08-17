import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import DealCard from "@/components/deals/DealCard";
import ScrollFilterChips from "@/components/common/ScrollFilterChips";
import { Tag } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import ListSkeleton from "@/components/common/ListSkeleton";
import ScreenHeader from "@/components/common/ScreenHeader";
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
      <ScreenHeader
        title="Deals"
        subtitle="Exclusive perks from partners who welcome women who travel."
        showBack
      />
      <p className="text-xs font-medium uppercase tracking-wide text-primary -mt-2 mb-4">
        Seluna members only
      </p>

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
          {filtered.map((d) => <DealCard key={d.id} deal={d} />)}
        </div>
      )}
    </div>
  );
}