import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Loader2 } from "lucide-react";

export default function HomeFeatured() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.FeaturedContent
      .list("sort_order", 50)
      .then((list) => setItems((list || []).filter((i) => i.active)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="px-5 py-6"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="font-display font-semibold text-lg px-5 mb-3">Featured</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-2">
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
      </div>
    </section>
  );
}