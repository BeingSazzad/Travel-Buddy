import React from "react";

export default function SectionRow({ title, items, renderCard, onSeeAll }) {
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between app-px mb-3">
        <h2 className="font-display font-semibold text-base text-foreground">{title}</h2>
        {onSeeAll && (
          <button onClick={onSeeAll} className="text-xs font-semibold text-[#A1846B] tap-feedback hover:underline underline-offset-2 transition-all">
            See all
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar app-gutter-x pb-1">
        {items.map((item, i) => renderCard(item, i))}
      </div>
    </section>
  );
}