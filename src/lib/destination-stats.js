import { DESTINATIONS } from "@/lib/destinations";
import { MOCK_MEMBERS } from "@/lib/member-profile";
import { getMockTrips, memberIdForTripCreator } from "@/lib/mock-trips";
import { tripStatus } from "@/lib/trip-utils";

/**
 * Integrate this same rule on the backend:
 *
 * travelling_here = COUNT DISTINCT user_id
 *   FROM trips
 *   WHERE city matches destination (Bali ≡ Ubud)
 *     AND end_date >= today          -- all upcoming + currently there
 *     AND visibility != private      -- optional: public / friends
 *     AND user is active / not blocked
 *
 * Time window is NOT this month and NOT this year.
 * A Paris trip in September still counts in August. A July trip does not.
 *
 * Do NOT count:
 *   - home city (current_city) without a trip to this destination
 *   - past trips
 *   - the same woman twice if she has two trips to the same city
 *
 * Card copy: `${n} travelling soon` — only show on cards that are in the list.
 * Trending / Recommended destination rows omit cities with count 0.
 */

function sameCity(a, b) {
  const x = (a || "").trim().toLowerCase();
  const y = (b || "").trim().toLowerCase();
  if (!x || !y) return false;
  if (x === y) return true;
  if ((x === "bali" && y === "ubud") || (x === "ubud" && y === "bali")) return true;
  return false;
}

function tripIsLive(trip) {
  if (!trip?.start_date || !trip?.end_date) return false;
  const status = tripStatus(trip);
  return status === "upcoming" || status === "active";
}

function addTraveller(ids, city, trip, userId) {
  if (!userId || !tripIsLive(trip) || !sameCity(trip.city, city)) return;
  ids.add(String(userId));
}

export function countTravellersHere(city, liveTrips = []) {
  const ids = new Set();

  MOCK_MEMBERS.forEach((m) => {
    addTraveller(ids, city, m.trip, m.user_id);
  });

  [...getMockTrips(), ...(liveTrips || [])].forEach((t) => {
    addTraveller(ids, city, t, memberIdForTripCreator(t.created_by_id) || t.created_by_id);
  });

  return ids.size;
}

export function travellingHereLabel(count) {
  if (!count) return "";
  return count === 1 ? "1 travelling soon" : `${count} travelling soon`;
}

/** Cities that actually have upcoming/active travellers — use for Trending. */
export function destinationsWithTravellers() {
  return DESTINATIONS
    .map((d) => ({
      type: "destination",
      city: d.city,
      image: d.image,
      title: d.city,
      location: d.country,
      travellers: countTravellersHere(d.city),
    }))
    .filter((d) => d.travellers > 0)
    .sort((a, b) => b.travellers - a.travellers);
}
