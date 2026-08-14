import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";

export default function DealCard({ deal }) {
  const navigate = useNavigate();
  const expired =
    deal.expiration_date && new Date(deal.expiration_date) < new Date(new Date().toDateString());

  return (
    <OverlayMediaCard
      image={deal.image}
      title={deal.title}
      location={deal.city || ""}
      badge={expired ? "Expired" : deal.discount}
      saveItem={{
        type: "deal",
        title: deal.title,
        location: deal.city,
        country: deal.country,
        image: deal.image,
        dealId: deal.id,
      }}
      onClick={() => navigate(`/deals/${deal.id}`)}
    />
  );
}
