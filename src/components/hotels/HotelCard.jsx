import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const h = hotel;
  const place = [h.city, h.distance != null ? `${h.distance} km` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <OverlayMediaCard
      image={h.image}
      title={h.name}
      location={place}
      rating={h.memberRating}
      reviews={h.reviews}
      className="w-full h-48"
      titleClassName="text-[17px]"
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
