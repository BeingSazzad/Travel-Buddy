import { format, parseISO } from "date-fns";

const CITY_IMAGES = {
  lisbon: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  ubud: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
  paris: "https://images.unsplash.com/photo-1517248135467-4c7edcad2f99?auto=format&fit=crop&w=800&q=80",
  copenhagen: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  marrakech: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeed?auto=format&fit=crop&w=800&q=80",
  berlin: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
  oslo: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  norway: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad2f99?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
];

export function imageForCity(city) {
  const key = (city || "").trim().toLowerCase();
  for (const [k, img] of Object.entries(CITY_IMAGES)) {
    if (key.includes(k)) return img;
  }
  return DEFAULT_IMAGES[Math.abs(hashString(key)) % DEFAULT_IMAGES.length];
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function tripStatus(trip) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = parseISO(trip.start_date);
  const e = parseISO(trip.end_date);
  if (today < s) return "upcoming";
  if (today > e) return "previous";
  return "active";
}

export function formatDates(trip) {
  const s = parseISO(trip.start_date);
  const e = parseISO(trip.end_date);
  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  if (sameMonth) return `${format(s, "MMM d")} – ${format(e, "d, yyyy")}`;
  return `${format(s, "MMM d")} – ${format(e, "MMM d, yyyy")}`;
}

export function tripsOverlap(a, b) {
  const s1 = parseISO(a.start_date), e1 = parseISO(a.end_date);
  const s2 = parseISO(b.start_date), e2 = parseISO(b.end_date);
  return s1 <= e2 && s2 <= e1;
}