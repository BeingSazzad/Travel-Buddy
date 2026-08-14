import React from "react";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function HomeDealCard({ item, onClick }) {
  return (
    <OverlayMediaCard
      image={item.image}
      title={item.title}
      location={item.location}
      badge={item.info || item.discount || "Deal"}
      saveItem={{
        type: "deal",
        title: item.title,
        location: item.location,
        image: item.image,
        dealId: item.dealId,
        item_key: item.dealId ? `deal:${item.dealId}` : undefined,
      }}
      onClick={onClick}
      className="w-[196px] h-[220px] shrink-0"
      titleClassName="text-sm"
    />
  );
}
