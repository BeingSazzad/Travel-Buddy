import React from "react";
import { useNavigate } from "react-router-dom";
import OverlayMediaCard from "@/components/common/OverlayMediaCard";
import GoingFaces from "@/components/common/GoingFaces";
import { countTravellersHere, travellingHereLabel, travellerAvatarsForCity } from "@/lib/destination-stats";

function saveItem(destination) {
  return {
    type: "destination",
    title: destination.city,
    location: destination.city,
    country: destination.country,
    image: destination.image,
  };
}

function metaLine(destination, liveTrips) {
  const n = destination.stats?.members ?? countTravellersHere(destination.city, liveTrips);
  return travellingHereLabel(n);
}

export default function DestinationCard({ destination, liveTrips = [] }) {
  const navigate = useNavigate();
  const n = destination.stats?.members ?? countTravellersHere(destination.city, liveTrips);
  const faces = n > 0 ? travellerAvatarsForCity(destination.city, liveTrips) : [];
  return (
    <OverlayMediaCard
      image={destination.image}
      title={destination.city}
      location={destination.country}
      meta={metaLine(destination, liveTrips)}
      saveItem={saveItem(destination)}
      ariaLabel={`${destination.city}, ${destination.country}`}
      onClick={() => navigate(`/destinations/${encodeURIComponent(destination.city)}`)}
      endSlot={n > 0 ? <GoingFaces count={n} avatars={faces} label="" /> : undefined}
    />
  );
}
