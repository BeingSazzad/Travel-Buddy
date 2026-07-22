import React, { useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";
import { Handshake } from "lucide-react";

export default function Partners() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Deal.list("-created_date", 500);
        setDeals(list);
      } catch (e) {
        setDeals([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const partners = useMemo(() => {
    const map = {};
    deals.forEach((d) => {
      const key = d.partner || "Unknown";
      if (!map[key]) map[key] = { name: key, count: 0, categories: new Set(), cities: new Set() };
      map[key].count += 1;
      if (d.category) map[key].categories.add(d.category);
      if (d.city) map[key].cities.add(d.city);
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [deals]);

  return (
    <div>
      <SectionHeader title="Partners" subtitle={`${partners.length} partner brands offering deals`} />
      <ListState loading={loading} empty={partners.length === 0} emptyText="No partners yet — create deals to list partners.">
        <div className="space-y-2">
          {partners.map((p) => (
            <div key={p.name} className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-card">
              <div className="w-10 h-10 rounded-xl bg-[#A1846B]/10 flex items-center justify-center">
                <Handshake className="w-4 h-4 text-[#7a5c44]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {[...p.cities].join(", ")} · {[...p.categories].join(", ")}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {p.count} deal{p.count > 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}