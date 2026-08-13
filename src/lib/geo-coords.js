/** Demo / offline coordinates for cities used across Seluna content */
const CITY_COORDS = {
  lisbon: [38.7223, -9.1393],
  lisboa: [38.7223, -9.1393],
  portugal: [38.7223, -9.1393],
  paris: [48.8566, 2.3522],
  france: [48.8566, 2.3522],
  bali: [-8.4095, 115.1889],
  canggu: [-8.6478, 115.1385],
  ubud: [-8.5069, 115.2625],
  indonesia: [-2.5489, 118.0149],
  copenhagen: [55.6761, 12.5683],
  københavn: [55.6761, 12.5683],
  kobenhavn: [55.6761, 12.5683],
  denmark: [55.6761, 12.5683],
  santorini: [36.3932, 25.4615],
  ammoudi: [36.4047, 25.4309],
  greece: [39.0742, 21.8243],
  berlin: [52.52, 13.405],
  germany: [51.1657, 10.4515],
  marrakech: [31.6295, -7.9811],
  morocco: [31.7917, -7.0926],
  tokyo: [35.6762, 139.6503],
  japan: [36.2048, 138.2529],
  london: [51.5074, -0.1278],
  uk: [55.3781, -3.436],
  "new york": [40.7128, -74.006],
  usa: [37.0902, -95.7129],
  sydney: [-33.8688, 151.2093],
  australia: [-25.2744, 133.7751],
  rome: [41.9028, 12.4964],
  italy: [41.8719, 12.5674],
  barcelona: [41.3851, 2.1734],
  spain: [40.4637, -3.7492],
  amsterdam: [52.3676, 4.9041],
  netherlands: [52.1326, 5.2913],
  dubai: [25.2048, 55.2708],
  istanbul: [41.0082, 28.9784],
  cairo: [30.0444, 31.2357],
  bangkok: [13.7563, 100.5018],
  singapore: [1.3521, 103.8198],
  "cape town": [-33.9249, 18.4241],
  oslo: [59.9139, 10.7522],
  norway: [60.472, 8.4689],
  seminyak: [-8.6905, 115.1682],
};

/** Neutral ocean fallback — never imply a wrong city (old default was Paris). */
const DEFAULT_CENTER = [20, 0];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/** Slight offset so multiple venues in the same city don't stack on one pin */
function jitter([lat, lon], seed) {
  const h = Math.abs(hashString(seed));
  const dLat = ((h % 80) - 40) / 8000;
  const dLon = ((h % 60) - 30) / 8000;
  return [lat + dLat, lon + dLon];
}

function normalizePlaceQuery(query) {
  return query
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * Resolve [lat, lon] from a free-text place query without any API.
 */
export function resolveCoordinates(query) {
  if (!query || typeof query !== "string") return null;
  const q = normalizePlaceQuery(query);

  // Prefer longer / more specific keys first
  const keys = Object.keys(CITY_COORDS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (q.includes(normalizePlaceQuery(key))) {
      return jitter(CITY_COORDS[key], query);
    }
  }
  return null;
}

export function defaultMapCenter() {
  return DEFAULT_CENTER;
}

/**
 * OpenStreetMap static preview — works without API keys when Leaflet isn't needed.
 */
export function staticMapUrl(lat, lon, { width = 640, height = 280, zoom = 14 } = {}) {
  const w = Math.min(width, 640);
  const h = Math.min(height, 400);
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=${zoom}&size=${w}x${h}&maptype=mapnik&markers=${lat},${lon},red-pushpin`;
}
