import React from "react";
import { Bookmark, Trash2, MapPin } from "lucide-react";
import { useSaved } from "@/lib/SavedContext";
import { Image } from "@/components/ui/image";
import { SEARCH_TYPES } from "@/lib/search-data";
import EmptyState from "@/components/common/EmptyState";

export default function SavedSection() {
  const { items, loading, remove } = useSaved();

  const groups = SEARCH_TYPES
    .map((t) => ({ label: t.label, items: items.filter((i) => i.type === t.value) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mt-7">
      <h3 className="font-display font-semibold text-base mb-3">Saved</h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading saved items…</p>
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved places yet"
          description="Tap the bookmark on any café, restaurant, hotel or destination to keep it here for later."
        />
      ) : (
        <div className="space-y-5">
          {groups.map((g) => (
            <div key={g.label}>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                {g.label} ({g.items.length})
              </p>
              <div className="space-y-2">
                {g.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-card border border-border shadow-soft rounded-2xl p-2.5"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
                      <Image src={item.image} alt={item.title} fittingType="fill" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-semibold text-sm truncate">{item.title}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                        <span className="truncate">
                          {item.location}
                          {item.country && item.country !== item.location ? `, ${item.country}` : ""}
                        </span>
                      </div>
                      {item.info && (
                        <p className="text-xs text-[#A1846B] font-medium mt-0.5 truncate">{item.info}</p>
                      )}
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive active:scale-90 transition shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}