import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function RestaurantCard({ restaurant }) {
  const navigate = useNavigate();
  const r = restaurant;
  const place = [r.city, r.distance != null ? `${r.distance} km` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <OverlayMediaCard
      image={r.image}
      title={r.name}
      location={place}
      rating={r.rating}
      reviews={r.reviews}
      className="w-full h-48"
      titleClassName="text-[17px]"
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
