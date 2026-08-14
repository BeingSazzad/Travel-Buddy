import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import { PRICE_LABELS } from "@/lib/restaurants";

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const r = restaurant;
  return (
    <OverlayMediaCard
      image={r.image}
      title={r.name}
      location={r.city}
      meta={`★ ${r.rating.toFixed(1)}`}
      badge={PRICE_LABELS[r.price]}
      saveItem={{
        type: "restaurant",
        title: r.name,
        location: r.city,
        country: r.country,
        image: r.image,
        rating: r.rating,
      }}
      onClick={() => navigate(`/restaurants/${encodeURIComponent(r.name)}`)}
    />
  );
}
