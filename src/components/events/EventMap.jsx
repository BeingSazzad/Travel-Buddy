import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function EventMap({ query }) {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if (!query) return;
    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("geocode", { query });
        const r = res.data?.results?.[0];
        if (active && r) setCoords([r.lat, r.lon]);
      } catch (e) {
        /* ignore */
      }
    })();
    return () => { active = false; };
  }, [query]);

  if (!coords)
    return (
      <div className="h-44 rounded-2xl bg-muted flex items-center justify-center text-xs text-muted-foreground">
        Locating on map…
      </div>
    );

  return (
    <div className="h-44 rounded-2xl overflow-hidden border border-border">
      <MapContainer center={coords} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        <Marker position={coords} icon={icon} />
        <Recenter center={coords} />
      </MapContainer>
    </div>
  );
}