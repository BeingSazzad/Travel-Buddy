import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const h = hotel;
  return (
    <OverlayMediaCard
      image={h.image}
      title={h.name}
      location={h.city}
      meta={`★ ${h.memberRating.toFixed(1)}`}
      badge={`€${h.pricePerNight}/night`}
      saveItem={{
        type: "hotel",
        title: h.name,
        location: h.city,
        country: h.country,
        image: h.image,
        rating: h.memberRating,
      }}
      onClick={() => navigate(`/hotels/${encodeURIComponent(h.name)}`)}
    />
  );
}
