import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { resolveCoordinates, defaultMapCenter, staticMapUrl } from "@/lib/geo-coords";

const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

const pinIcon = L.divIcon({
  className: "seluna-map-pin",
  html: `<div class="seluna-map-pin-dot"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function Recenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function parseCoords(coords) {
  if (!coords) return null;
  if (Array.isArray(coords) && coords.length >= 2) {
    const lat = Number(coords[0]);
    const lon = Number(coords[1]);
    if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
  }
  return null;
}

/**
 * Interactive location map with instant demo coords + optional geocode refine.
 * Pass `coords={[lat, lng]}` to pin a confirmed meeting point (skips city fallback).
 */
export default function EventMap({ query, coords: coordsProp, compact = false, label, zoom = 14 }) {
  const fixed = useMemo(() => parseCoords(coordsProp), [coordsProp]);
  const fallback = useMemo(
    () => fixed || resolveCoordinates(query),
    [fixed, query]
  );
  const [coords, setCoords] = useState(fallback);
  const [ready, setReady] = useState(Boolean(fallback));

  useEffect(() => {
    if (fixed) {
      setCoords(fixed);
      setReady(true);
      return;
    }

    const local = resolveCoordinates(query);
    if (local) {
      setCoords(local);
      setReady(true);
    } else if (!query) {
      setCoords(defaultMapCenter());
      setReady(true);
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("geocode", { query });
        const r = res.data?.results?.[0];
        if (active && r?.lat != null && r?.lon != null) {
          setCoords([r.lat, r.lon]);
        }
      } catch {
        /* demo / offline */
      } finally {
        if (active) {
          setCoords((prev) => prev || local || defaultMapCenter());
          setReady(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [query, fixed]);

  const heightClass = compact ? "h-36" : "h-44";
  const displayLabel = label;

  if (!ready || !coords) {
    return (
      <div className={`${heightClass} rounded-2xl bg-muted/60 border border-border/60 overflow-hidden relative`}>
        {fallback && (
          <img
            src={staticMapUrl(fallback[0], fallback[1], { height: compact ? 144 : 176 })}
            alt=""
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-[1px]">
          <span className="text-xs text-muted-foreground">Loading map…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className={`${heightClass} rounded-2xl overflow-hidden border border-border/70 shadow-soft seluna-map-wrap`}>
        <MapContainer
          center={coords}
          zoom={zoom}
          scrollWheelZoom={false}
          dragging={true}
          zoomControl={false}
          className="h-full w-full z-0"
        >
          <TileLayer url={TILE_URL} attribution="&copy; OpenStreetMap · &copy; CARTO" />
          <Marker position={coords} icon={pinIcon} />
          <Recenter center={coords} zoom={zoom} />
        </MapContainer>
      </div>
      {displayLabel && (
        <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground leading-snug">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <span className="line-clamp-2">{displayLabel}</span>
        </div>
      )}
    </div>
  );
}
