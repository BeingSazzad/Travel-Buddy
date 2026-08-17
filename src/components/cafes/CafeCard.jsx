import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function CafeCard({ cafe }) {
  const navigate = useNavigate();
  const place = [cafe.city, cafe.distance != null ? `${cafe.distance} km` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <OverlayMediaCard
      image={cafe.image}
      title={cafe.name}
      location={place}
      rating={cafe.rating}
      reviews={cafe.reviews}
      className="w-full h-48"
      titleClassName="text-[17px]"
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
