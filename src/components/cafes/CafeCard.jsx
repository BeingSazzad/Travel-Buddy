import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import { PRICE_LABELS } from "@/lib/cafes";

export default function CafeCard({ cafe }) {
  const navigate = useNavigate();
  return (
    <OverlayMediaCard
      image={cafe.image}
      title={cafe.name}
      location={cafe.city}
      meta={`★ ${cafe.rating.toFixed(1)}`}
      badge={PRICE_LABELS[cafe.price]}
      saveItem={{
        type: "cafe",
        title: cafe.name,
        location: cafe.city,
        country: cafe.country,
        image: cafe.image,
        rating: cafe.rating,
      }}
      onClick={() => navigate(`/cafes/${encodeURIComponent(cafe.name)}`)}
    />
  );
}
