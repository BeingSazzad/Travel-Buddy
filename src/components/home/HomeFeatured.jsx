import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Loader2 } from "lucide-react";
import HorizontalScroll from "@/components/common/HorizontalScroll";
import { onRefresh } from "@/lib/refresh-bus";
import { DEMO_FEATURED } from "@/lib/home-data";
import { useDemoFallbacks } from "@/lib/demo-fallbacks";

export default function HomeFeatured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const list = await base44.entities.FeaturedContent.list("sort_order", 50);
      const active = (list || []).filter((i) => i.active);
      setItems(active.length ? active : useDemoFallbacks ? DEMO_FEATURED : []);
    } catch {
      setItems(useDemoFallbacks ? DEMO_FEATURED : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);
  useEffect(() => onRefresh("/", reload), [reload]);

  if (loading) return <div className="app-px py-6"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
  if (items.length === 0) return null;

  return (
    <section className="min-w-0 max-w-full">
      <h2 className="section-header app-px mb-3 text-foreground">Featured</h2>
      <HorizontalScroll>
        {items.map((f) => {
          const inner = (
            <div className="w-64 shrink-0 rounded-2xl overflow-hidden border border-border bg-card shadow-soft">
              <div className="h-32">
                <Image src={f.image} alt={f.title} fittingType="fill" className="w-full h-full" />
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-sm truncate">{f.title}</p>
                {f.subtitle && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{f.subtitle}</p>}
              </div>
            </div>
          );
          return f.link ? (
            <Link key={f.id} to={f.link}>{inner}</Link>
          ) : (
            <div key={f.id}>{inner}</div>
          );
        })}
      </HorizontalScroll>
    </section>
  );
}
