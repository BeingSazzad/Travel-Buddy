import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import { countTravellersHere, travellingHereLabel } from "@/lib/destination-stats";

function saveItem(destination) {
  return {
    type: "destination",
    title: destination.city,
    location: destination.city,
    country: destination.country,
    image: destination.image,
  };
}

function metaLine(destination) {
  const n = destination.stats?.members ?? countTravellersHere(destination.city);
  return travellingHereLabel(n);
}

export default function DestinationCard({ destination }) {
  const navigate = useNavigate();
  return (
    <OverlayMediaCard
      image={destination.image}
      title={destination.city}
      location={destination.country}
      meta={metaLine(destination)}
      saveItem={saveItem(destination)}
      ariaLabel={`${destination.city}, ${destination.country}`}
      onClick={() => navigate(`/destinations/${encodeURIComponent(destination.city)}`)}
    />
  );
}
