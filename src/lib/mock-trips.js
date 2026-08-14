import { findMockMember, MOCK_MEMBERS, DEMO_FRIEND_MEMBER_IDS } from "@/lib/member-profile";
import { DEMO_USER_DISPLAY_NAME } from "@/lib/demo-user";
import { imageForCity } from "@/lib/trip-utils";

/** Maps demo trip creator ids to member profile ids */
export const TRIP_CREATOR_MEMBER_MAP = {
  other_user_1: "mock_4",
  other_user_2: "mock_1",
  other_user_3: "mock_2",
};

export function memberIdForTripCreator(creatorId) {
  if (TRIP_CREATOR_MEMBER_MAP[creatorId]) return TRIP_CREATOR_MEMBER_MAP[creatorId];
  if (typeof creatorId === "string" && creatorId.startsWith("mock_")) return creatorId;
  return creatorId;
}

/** Fields match CreateTrip / TripForm payload exactly. */
export function getMockTrips(userId = "demo_user") {
  return [
    {
      id: "trip_mock_1",
      name: "Lisbon Getaway",
      city: "Lisbon",
      country: "Portugal",
      start_date: "2026-08-10",
      end_date: "2026-08-17",
      description:
        "Ready for historic streets, gorgeous tiles, and pastel de nata! Join me for sightseeing and seafood dinners.",
      travel_style: "city break",
      looking_for: ["dinner", "sightseeing", "culture"],
      visibility: "public",
      created_by_id: userId,
      created_by: { name: DEMO_USER_DISPLAY_NAME },
      cover_image: imageForCity("Lisbon"),
    },
    {
      id: "trip_mock_2",
      name: "Bali Retreat",
      city: "Ubud",
      country: "Indonesia",
      start_date: "2026-08-20",
      end_date: "2026-08-28",
      description: "Relaxing yoga retreat in Ubud followed by beach clubs in Seminyak.",
      travel_style: "wellness",
      looking_for: ["yoga", "beach"],
      visibility: "public",
      created_by_id: userId,
      created_by: { name: DEMO_USER_DISPLAY_NAME },
      cover_image: imageForCity("Ubud"),
    },
    {
      id: "trip_mock_3",
      name: "Paris Fashion Tour",
      city: "Paris",
      country: "France",
      start_date: "2026-09-02",
      end_date: "2026-09-08",
      description:
        "Wandering through museums, vintage shopping, and drinking espresso at cute cafes in Paris.",
      travel_style: "cultural",
      looking_for: ["shopping", "museums", "coffee"],
      visibility: "public",
      created_by_id: "other_user_1",
      created_by: {
        name: findMockMember("mock_4").name,
        main_photo: findMockMember("mock_4").avatar,
      },
      cover_image: imageForCity("Paris"),
    },
    {
      id: "trip_mock_4",
      name: "Explore Bali Temples",
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-15",
      end_date: "2026-08-22",
      description: "Exploring waterfalls, local culture, and temples around Ubud. Let's travel together!",
      travel_style: "adventure",
      looking_for: ["sightseeing", "hiking", "culture"],
      visibility: "public",
      created_by_id: "other_user_2",
      created_by: {
        name: findMockMember("mock_1").name,
        main_photo: findMockMember("mock_1").avatar,
      },
      cover_image: imageForCity("Bali"),
    },
    {
      id: "trip_mock_5",
      name: "Girls' weekend in Copenhagen",
      city: "Copenhagen",
      country: "Denmark",
      start_date: "2026-08-14",
      end_date: "2026-08-18",
      description: "Cozy cafes, canal walks, and design museums with a small group of women travellers.",
      travel_style: "city break",
      looking_for: ["coffee", "culture", "museums"],
      visibility: "public",
      created_by_id: "other_user_3",
      created_by: {
        name: findMockMember("mock_2").name,
        main_photo: findMockMember("mock_2").avatar,
      },
      cover_image: imageForCity("Copenhagen"),
    },
    {
      id: "trip_mock_6",
      name: "Tokyo neon week",
      city: "Tokyo",
      country: "Japan",
      start_date: "2026-09-04",
      end_date: "2026-09-11",
      description: "Shimokitazawa cafés, teamLab, and evening walks in Shinjuku.",
      travel_style: "city break",
      looking_for: ["coffee", "culture", "food"],
      visibility: "public",
      created_by_id: "mock_7",
      created_by: { name: findMockMember("mock_7")?.name, main_photo: findMockMember("mock_7")?.avatar },
      cover_image: imageForCity("Tokyo"),
    },
    {
      id: "trip_mock_7",
      name: "Marrakech riad days",
      city: "Marrakech",
      country: "Morocco",
      start_date: "2026-09-12",
      end_date: "2026-09-18",
      description: "Souks with a guide, hammam afternoon, and rooftop sunsets.",
      travel_style: "cultural",
      looking_for: ["culture", "wellness"],
      visibility: "public",
      created_by_id: "mock_13",
      created_by: { name: findMockMember("mock_13")?.name, main_photo: findMockMember("mock_13")?.avatar },
      cover_image: imageForCity("Marrakech"),
    },
    {
      id: "trip_mock_8",
      name: "Tulum reset",
      city: "Tulum",
      country: "Mexico",
      start_date: "2026-08-22",
      end_date: "2026-08-28",
      description: "Cenotes, sunrise yoga, and slow beach days.",
      travel_style: "wellness",
      looking_for: ["yoga", "beach"],
      visibility: "public",
      created_by_id: "mock_14",
      created_by: { name: findMockMember("mock_14")?.name, main_photo: findMockMember("mock_14")?.avatar },
      cover_image: imageForCity("Tulum"),
    },
    {
      id: "trip_mock_9",
      name: "Cape Town coast",
      city: "Cape Town",
      country: "South Africa",
      start_date: "2026-09-08",
      end_date: "2026-09-15",
      description: "Hikes, Atlantic light, and a Stellenbosch afternoon.",
      travel_style: "adventure",
      looking_for: ["hiking", "wine"],
      visibility: "public",
      created_by_id: "mock_15",
      created_by: { name: findMockMember("mock_15")?.name, main_photo: findMockMember("mock_15")?.avatar },
      cover_image: imageForCity("Cape Town"),
    },
  ];
}

export function findMockTrip(id, userId = "demo_user") {
  return getMockTrips(userId).find((t) => t.id === id);
}

export function cityKeyMatch(cityA, cityB) {
  const a = (cityA || "").toLowerCase();
  const b = (cityB || "").toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  if ((a === "bali" && b === "ubud") || (a === "ubud" && b === "bali")) return true;
  return false;
}

/** Unique people with a trip to this city (profiles + demo trips + live trips). No padded totals. */
export function travellersForCity(city, liveTrips = []) {
  const ids = new Set();
  MOCK_MEMBERS.forEach((m) => {
    if (cityKeyMatch(m.trip?.city, city)) ids.add(m.user_id);
  });
  [...getMockTrips(), ...(liveTrips || [])].forEach((t) => {
    if (!cityKeyMatch(t.city, city)) return;
    ids.add(memberIdForTripCreator(t.created_by_id) || t.created_by_id);
  });
  return ids.size;
}

export function travellingHereLabel(count) {
  if (!count) return "";
  return count === 1 ? "1 travelling here" : `${count} travelling here`;
}

export function mockTripsForCity(city, userId = "demo_user") {
  const key = (city || "").toLowerCase();
  if (!key) return [];
  return getMockTrips(userId).filter((t) => {
    const c = (t.city || "").toLowerCase();
    if (c === key) return true;
    if (key === "bali" && c === "ubud") return true;
    if (key === "ubud" && c === "bali") return true;
    return false;
  });
}

/** Always return visitors for a destination page — trips first, then member itineraries, then friends planning a visit */
export function demoVisitorsForCity(city, userId = "demo_user") {
  const trips = mockTripsForCity(city, userId);
  if (trips.length) return trips;

  const key = (city || "").toLowerCase();
  const fromProfiles = MOCK_MEMBERS.filter((m) => {
    const c = (m.trip?.city || "").toLowerCase();
    return c === key || (key === "bali" && c === "ubud") || (key === "ubud" && c === "bali");
  }).map((m) => ({
    id: `visit_${m.user_id}`,
    created_by_id: m.user_id,
    start_date: m.trip.start_date,
    end_date: m.trip.end_date,
    city: m.trip.city,
    country: m.trip.country,
  }));
  if (fromProfiles.length) return fromProfiles;

  return DEMO_FRIEND_MEMBER_IDS.slice(0, 2).map((id, i) => {
    const start = new Date();
    start.setDate(start.getDate() + 10 + i * 4);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return {
      id: `visit_plan_${id}_${key}`,
      created_by_id: id,
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      city,
    };
  });
}
