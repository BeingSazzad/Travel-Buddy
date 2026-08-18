import { base44 } from "@/api/base44Client";
import { searchPlaces } from "@/lib/geo-coords";

function normalizeResults(list) {
  return (list || [])
    .filter((r) => r?.lat != null && (r.lon != null || r.lng != null))
    .map((r) => {
      const lat = Number(r.lat);
      const lon = Number(r.lon ?? r.lng);
      return {
        lat,
        lon,
        name: r.name || "",
        display: r.display || r.name || "",
      };
    })
    .filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
}

async function searchPhoton(query) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.features || []).map((f) => {
    const [lon, lat] = f.geometry?.coordinates || [];
    const p = f.properties || {};
    const name = p.name || p.street || "";
    const addr = [p.housenumber, p.street, p.city || p.locality, p.country]
      .filter(Boolean)
      .join(", ");
    return {
      lat: Number(lat),
      lon: Number(lon),
      name: name || addr,
      display: name && addr ? `${name} — ${addr}` : name || addr,
    };
  }).filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
}

/**
 * Meeting-point search: Base44 geocode (Google if keyed, else Photon/Nominatim),
 * then browser Photon, then local demo pins.
 */
export async function findMeetingPlaces(meetingPoint, { city = "", country = "" } = {}) {
  const meeting = (meetingPoint || "").trim();
  const query = [meeting, city, country].filter(Boolean).join(", ");
  if (!meeting) return [];

  try {
    const res = await base44.functions.invoke("geocode", { query });
    const remote = normalizeResults(res.data?.results);
    if (remote.length) return remote;
  } catch {
    /* demo / offline */
  }

  try {
    const photon = normalizeResults(await searchPhoton(query));
    if (photon.length) return photon;
  } catch {
    /* ignore */
  }

  return searchPlaces(meeting, { city, country }).map((r) => ({
    lat: r.lat,
    lon: r.lon,
    name: meeting,
    display: r.display,
  }));
}
