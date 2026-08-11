import { format, parseISO } from "date-fns";
import { cityImage } from "@/lib/images";

export function imageForCity(city) {
  return cityImage(city);
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