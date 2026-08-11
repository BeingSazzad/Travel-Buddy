export { CATEGORY_EVENT_IMAGES as CATEGORY_IMAGES, defaultEventImage } from "@/lib/images";

export const EVENT_CATEGORIES = [
  "coffee", "brunch", "dinner", "beach", "nightlife", "coworking",
  "sightseeing", "hiking", "shopping", "yoga", "wellness", "wine", "networking",
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
