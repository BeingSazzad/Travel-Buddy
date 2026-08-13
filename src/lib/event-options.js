export { CATEGORY_EVENT_IMAGES as CATEGORY_IMAGES, defaultEventImage } from "@/lib/images";

export const EVENT_CATEGORIES = [
  "coffee",
  "brunch",
  "dinner",
  "beach",
  "nightlife",
  "coworking",
  "sightseeing",
  "hiking",
  "shopping",
  "yoga",
  "wellness",
  "wine",
  "networking",
];

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export const fmtEventDate = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const fmtEventDateLong = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/** Accepts "18:00", "18:00:00", or "06:00 PM" → display like "6:00 PM". */
export const fmtEventTime = (t) => {
  if (!t) return "";
  const raw = String(t).trim();
  const ampm = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    const h = Number(ampm[1]);
    const m = ampm[2];
    return `${h}:${m} ${ampm[3].toUpperCase()}`;
  }
  const parts = raw.split(":");
  if (parts.length < 2) return raw;
  let h = Number(parts[0]);
  const m = parts[1].slice(0, 2);
  if (Number.isNaN(h)) return raw;
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
};

export const fmtEventWhen = (event) => {
  if (!event) return "";
  const datePart = [
    fmtEventDateLong(event.date),
    event.end_date && event.end_date !== event.date ? `– ${fmtEventDateLong(event.end_date)}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const timePart = [fmtEventTime(event.time), event.end_time ? fmtEventTime(event.end_time) : null]
    .filter(Boolean)
    .join(" – ");
  return [datePart, timePart].filter(Boolean).join(" · ");
};
