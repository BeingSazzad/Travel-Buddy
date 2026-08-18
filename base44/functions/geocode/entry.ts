import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

function mapPhoton(data) {
  const features = data?.features || [];
  return features.slice(0, 5).map((f) => {
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

function mapNominatim(data) {
  if (!Array.isArray(data)) return [];
  return data.slice(0, 5).map((row) => ({
    lat: parseFloat(row.lat),
    lon: parseFloat(row.lon),
    name: row.name || row.display_name?.split(",")[0] || "",
    display: row.display_name,
  })).filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
}

function mapGooglePlaces(data) {
  const rows = data?.results || [];
  return rows.slice(0, 5).map((row) => {
    const loc = row.geometry?.location || {};
    return {
      lat: Number(loc.lat),
      lon: Number(loc.lng),
      name: row.name || "",
      display: row.formatted_address
        ? `${row.name || ""} — ${row.formatted_address}`.replace(/^ — /, "")
        : row.name,
    };
  }).filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon));
}

async function searchGoogle(query) {
  const key = Deno.env.get("GOOGLE_MAPS_API_KEY") || Deno.env.get("GOOGLE_PLACES_API_KEY");
  if (!key) return [];
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${key}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") return [];
  return mapGooglePlaces(data);
}

async function searchPhoton(query) {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;
  const res = await fetch(url, { headers: { "User-Agent": "Seluna/1.0 (contact@seluna.app)" } });
  if (!res.ok) return [];
  return mapPhoton(await res.json());
}

async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": "Seluna/1.0 (contact@seluna.app)" } });
  if (!res.ok) return [];
  return mapNominatim(await res.json());
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const q = (body.query || "").trim();
    if (!q) return Response.json({ results: [] });

    let results = await searchGoogle(q);
    if (!results.length) results = await searchPhoton(q);
    if (!results.length) results = await searchNominatim(q);

    return Response.json({ results });
  } catch (error) {
    console.error("geocode error", error);
    return Response.json({ results: [] }, { status: 500 });
  }
});
