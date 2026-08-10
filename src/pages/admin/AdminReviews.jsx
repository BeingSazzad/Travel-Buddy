import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { SectionHeader, ListState } from "@/components/admin/AdminUI";
import { Star, Trash2 } from "lucide-react";

export default function AdminReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const list = await base44.entities.Review.list("-created_date", 500);
      setItems(list);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Remove this review?")) return;
    try {
      await base44.entities.Review.delete(id);
      setItems((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      alert("Could not remove review.");
    }
  };

  return (
    <div>
      <SectionHeader title="Reviews" subtitle={`${items.length} member reviews · moderate content`} />
      <ListState loading={loading} empty={items.length === 0} emptyText="No reviews yet.">
        <div className="space-y-2">
          {items.map((r) => (
            <div key={r.id} className="p-3 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{r.item_title}</p>
                <span className="flex items-center gap-1 text-xs"><Star className="w-3 h-3 text-amber-500" strokeWidth={1.5} /> {r.rating}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.author_name} · {r.item_type}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.text}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{new Date(r.created_date).toLocaleString()} · {r.helpful_count || 0} helpful</span>
                <button onClick={() => remove(r.id)} className="text-xs text-destructive flex items-center gap-1">
                  <Trash2 className="w-3 h-3" strokeWidth={1.5} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </ListState>
    </div>
  );
}