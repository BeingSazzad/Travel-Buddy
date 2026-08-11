import { findMockMember } from "@/lib/member-profile";
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
      travel_style: "social",
      looking_for: ["food", "culture", "sightseeing"],
      created_by_id: userId,
      created_by: { name: DEMO_USER_DISPLAY_NAME },
      members_count: 5,
      status: "upcoming",
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
      travel_style: "relaxed",
      looking_for: ["wellness", "beach"],
      created_by_id: userId,
      created_by: { name: DEMO_USER_DISPLAY_NAME },
      members_count: 4,
      status: "draft",
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
      looking_for: ["shopping", "museums", "cafes"],
      created_by_id: "other_user_1",
      created_by: { name: findMockMember("mock_4").name, main_photo: findMockMember("mock_4").avatar },
      members_count: 3,
      status: "upcoming",
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
      looking_for: ["temples", "hiking", "culture"],
      created_by_id: "other_user_2",
      created_by: { name: findMockMember("mock_1").name, main_photo: findMockMember("mock_1").avatar },
      members_count: 6,
      status: "upcoming",
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
      travel_style: "social",
      looking_for: ["cafes", "culture", "design"],
      created_by_id: "other_user_3",
      created_by: { name: findMockMember("mock_2").name, main_photo: findMockMember("mock_2").avatar },
      members_count: 4,
      status: "upcoming",
      cover_image: imageForCity("Copenhagen"),
    },
  ];
}

export function findMockTrip(id, userId = "demo_user") {
  return getMockTrips(userId).find((t) => t.id === id);
}
