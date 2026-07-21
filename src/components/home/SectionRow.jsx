import React from "react";

export default function SectionRow({ title, items, renderCard }) {
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between px-5 mb-3">
        <h2 className="font-display font-semibold text-lg text-foreground">{title}</h2>
        <button className="text-xs font-medium text-[#A1846B]">See all</button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
        {items.map((item, i) => renderCard(item, i))}
      </div>
    </section>
  );
}