import { findMockMember } from "@/lib/member-profile";
import { memberAvatar, eventImageFor } from "@/lib/images";

export const MOCK_EVENTS = [
  {
    id: "event_mock_1",
    title: "Sunset Yoga",
    name: "Sunset Yoga",
    city: "Santorini",
    country: "Greece",
    location: "Oia Caldera",
    date: "2026-08-10",
    time: "08:00 AM",
    category: "wellness",
    description: "Start your morning with a relaxing yoga session overlooking the beautiful caldera in Oia. All levels welcome!",
    attendees_count: 8,
    max_attendees: 12,
    host_id: "mock_1",
    host_name: findMockMember("mock_1").name,
    host_avatar: memberAvatar("mock_1"),
    image: eventImageFor({ city: "Santorini", category: "wellness" }),
    visibility: "public",
  },
  {
    id: "event_mock_2",
    title: "Sunset Dinner in Santorini",
    name: "Sunset Dinner in Santorini",
    city: "Santorini",
    country: "Greece",
    location: "Ammoudi Bay",
    date: "2026-08-12",
    time: "06:00 PM",
    category: "dinner",
    description: "Join us for an unforgettable sunset dinner with amazing women travellers. Good food, great conversations, and memories to last a lifetime.",
    attendees_count: 12,
    max_attendees: 16,
    host_id: "mock_4",
    host_name: findMockMember("mock_4").name,
    host_avatar: memberAvatar("mock_4"),
    image: eventImageFor({ city: "Santorini", category: "dinner" }),
    visibility: "public",
  },
  {
    id: "event_mock_3",
    title: "Wine & Paint Night",
    name: "Wine & Paint Night",
    city: "Lisbon",
    country: "Portugal",
    location: "Alfama Studio",
    date: "2026-08-15",
    time: "06:30 PM",
    category: "wine",
    description: "Unleash your inner artist! We will sip local Portuguese wine and paint the beautiful scenery of Lisbon.",
    attendees_count: 6,
    max_attendees: 10,
    host_id: "mock_2",
    host_name: findMockMember("mock_2").name,
    host_avatar: memberAvatar("mock_2"),
    image: eventImageFor({ city: "Lisbon", category: "wine" }),
    visibility: "public",
  },
  {
    id: "event_mock_4",
    title: "Girls' Trip to Swiss Alps",
    name: "Girls' Trip to Swiss Alps",
    city: "Zermatt",
    country: "Switzerland",
    location: "Matterhorn Trail",
    date: "2026-09-05",
    end_date: "2026-09-08",
    time: "10:00 AM",
    category: "hiking",
    description: "Let's head to the mountains for fresh air, hiking trails, and beautiful chalet evenings. 4 days of adventure!",
    attendees_count: 4,
    max_attendees: 8,
    host_id: "mock_4",
    host_name: findMockMember("mock_4").name,
    host_avatar: memberAvatar("mock_4"),
    image: eventImageFor({ city: "Zermatt", category: "hiking" }),
    visibility: "public",
  },
];

/** Home / search title → mock event id */
export const EVENT_TITLE_TO_ID = {
  "Sunset Yoga": "event_mock_1",
  "Wine & Paint": "event_mock_3",
  "Wine & Paint Night": "event_mock_3",
  "Travel Mixer": "event_mock_2",
  "Coffee Crawl": "event_mock_4",
  "Sunset Dinner in Santorini": "event_mock_2",
  "Girls' Trip to Swiss Alps": "event_mock_4",
};

export function findMockEvent(id) {
  return MOCK_EVENTS.find((e) => e.id === id) || null;
}

export function eventsForCity(city) {
  if (!city) return [];
  const key = city.toLowerCase();
  return MOCK_EVENTS.filter((e) => (e.city || "").toLowerCase() === key);
}

export function resolveEventId(item) {
  if (item?.eventId || item?.id) return item.eventId || item.id;
  return EVENT_TITLE_TO_ID[item?.title] || null;
}
