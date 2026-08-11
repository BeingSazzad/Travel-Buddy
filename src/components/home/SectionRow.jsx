import React from "react";
import HorizontalScroll from "@/components/common/HorizontalScroll";

export default function SectionRow({ title, items, renderCard, onSeeAll }) {
  return (
    <section className="min-w-0 max-w-full">
      <div className="flex items-center justify-between app-px mb-3">
        <h2 className="section-header text-foreground">{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className="text-xs font-semibold text-primary tap-feedback hover:underline underline-offset-2 transition-all shrink-0">
            See all
          </button>
        )}
      </div>
      <HorizontalScroll>
        {items.map((item, i) => renderCard(item, i))}
      </HorizontalScroll>
    </section>
  );
}
