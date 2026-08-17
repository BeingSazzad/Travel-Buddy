import { findMockMember } from "@/lib/member-profile";
import { memberAvatar, eventImageFor } from "@/lib/images";

function hostFields(id) {
  const m = findMockMember(id);
  return {
    host_id: id,
    host_name: m?.name || "Seluna host",
    host_avatar: memberAvatar(id),
  };
}

function goingAttendees(ids) {
  return ids.map((id) => {
    const m = findMockMember(id);
    return {
      user_id: id,
      name: m?.name || "Member",
      avatar: memberAvatar(id),
      status: "going",
      attendance_id: `att_${id}`,
    };
  });
}

/**
 * Mock events match CreateEvent payload fields:
 * title, category, description, date, time, end_time, city, country, location,
 * lat, lng, image, max_attendees, visibility, pricing, external_link, age_min, age_max, languages
 */
export const MOCK_EVENTS = [
  {
    id: "event_mock_1",
    title: "Sunset Yoga",
    name: "Sunset Yoga",
    city: "Santorini",
    country: "Greece",
    location: "Oia Caldera viewpoint",
    lat: 36.4618,
    lng: 25.3753,
    date: "2026-08-10",
    time: "08:00",
    end_time: "09:30",
    category: "wellness",
    description:
      "Start your morning with a relaxing yoga session overlooking the caldera in Oia. All levels welcome — bring a mat if you have one.",
    attendees_count: 3,
    max_attendees: 12,
    ...hostFields("mock_1"),
    image: eventImageFor({ city: "Santorini", category: "wellness" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_1", "mock_2", "mock_4"]),
  },
  {
    id: "event_mock_2",
    title: "Sunset Dinner in Santorini",
    name: "Sunset Dinner in Santorini",
    city: "Santorini",
    country: "Greece",
    location: "Ammoudi Bay",
    lat: 36.4047,
    lng: 25.4309,
    date: "2026-08-12",
    time: "18:00",
    end_time: "21:00",
    category: "dinner",
    description:
      "Join us for an unforgettable sunset dinner with other women travellers. Good food, easy conversation, and a walk along the bay afterwards.",
    attendees_count: 12,
    max_attendees: 16,
    ...hostFields("mock_4"),
    image: eventImageFor({ city: "Santorini", category: "dinner" }),
    visibility: "public",
    pricing: "paid_external",
    external_link: "https://example.com/tickets",
    languages: ["English", "Greek"],
    age_min: 21,
    age_max: 45,
    attendees: goingAttendees(["mock_4", "mock_1", "mock_2"]),
  },
  {
    id: "event_mock_3",
    title: "Wine & Paint Night",
    name: "Wine & Paint Night",
    city: "Lisbon",
    country: "Portugal",
    location: "Alfama Studio",
    lat: 38.7129,
    lng: -9.1307,
    date: "2026-08-15",
    time: "18:30",
    end_time: "21:00",
    category: "wine",
    description:
      "Unleash your inner artist — sip local Portuguese wine and paint Lisbon scenery together. Materials included.",
    attendees_count: 6,
    max_attendees: 10,
    ...hostFields("mock_2"),
    image: eventImageFor({ city: "Lisbon", category: "wine" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Portuguese"],
    attendees: goingAttendees(["mock_2", "mock_1"]),
  },
  {
    id: "event_mock_4",
    title: "Matterhorn morning hike",
    name: "Matterhorn morning hike",
    city: "Zermatt",
    country: "Switzerland",
    location: "Matterhorn Trail meet point",
    lat: 45.9763,
    lng: 7.6586,
    date: "2026-09-05",
    time: "10:00",
    end_time: "14:00",
    category: "hiking",
    description:
      "A half-day group hike with views of the Matterhorn. Moderate pace — wear sturdy shoes and bring water.",
    attendees_count: 4,
    max_attendees: 8,
    ...hostFields("mock_4"),
    image: eventImageFor({ city: "Zermatt", category: "hiking" }),
    visibility: "approval",
    pricing: "free",
    languages: ["English", "German"],
    attendees: goingAttendees(["mock_4", "mock_1"]),
  },
  {
    id: "event_mock_5",
    title: "Canal-side coffee",
    name: "Canal-side coffee",
    city: "Copenhagen",
    country: "Denmark",
    location: "Nyhavn",
    lat: 55.6797,
    lng: 12.5918,
    date: "2026-08-16",
    time: "10:30",
    end_time: "12:00",
    category: "coffee",
    description:
      "Slow Saturday coffee with other women in town — then a walk along the harbour if the weather’s kind.",
    attendees_count: 7,
    max_attendees: 10,
    ...hostFields("mock_2"),
    image: eventImageFor({ city: "Copenhagen", category: "cafes" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Danish"],
    attendees: goingAttendees(["mock_2", "mock_4", "mock_1"]),
  },
  {
    id: "event_mock_6",
    title: "Ubud temple morning",
    name: "Ubud temple morning",
    city: "Bali",
    country: "Indonesia",
    location: "Tirta Empul",
    lat: -8.4152,
    lng: 115.3153,
    date: "2026-08-21",
    time: "08:00",
    end_time: "11:00",
    category: "sightseeing",
    description:
      "Visit a water temple together, then brunch in Ubud. Sarongs provided — respectful dress required.",
    attendees_count: 9,
    max_attendees: 12,
    ...hostFields("mock_1"),
    image: eventImageFor({ city: "Bali", category: "culture" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_1", "mock_2", "mock_4"]),
  },
  {
    id: "event_mock_7",
    title: "Paris café crawl",
    name: "Paris café crawl",
    city: "Paris",
    country: "France",
    location: "Café de Flore, Saint-Germain",
    lat: 48.8542,
    lng: 2.3326,
    date: "2026-08-20",
    time: "10:30",
    end_time: "12:30",
    category: "cafes",
    description:
      "A slow Saint-Germain coffee walk with other women in town — Flore to Boot Café, then a stroll along the Seine if the weather's kind.",
    attendees_count: 7,
    max_attendees: 12,
    ...hostFields("mock_3"),
    image: eventImageFor({ city: "Paris", category: "cafes" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "French"],
    attendees: goingAttendees(["mock_3", "mock_4", "mock_2"]),
  },
];

/** Home / search title → mock event id */
export const EVENT_TITLE_TO_ID = {
  "Sunset Yoga": "event_mock_1",
  "Wine & Paint": "event_mock_3",
  "Wine & Paint Night": "event_mock_3",
  "Travel Mixer": "event_mock_2",
  "Coffee Crawl": "event_mock_5",
  "Sunset Dinner in Santorini": "event_mock_2",
  "Girls' Trip to Swiss Alps": "event_mock_4",
  "Matterhorn morning hike": "event_mock_4",
  "Canal-side coffee": "event_mock_5",
  "Ubud temple morning": "event_mock_6",
  "Paris café crawl": "event_mock_7",
};

export function findMockEvent(id) {
  return MOCK_EVENTS.find((e) => e.id === id) || null;
}

export function eventsForCity(city, country) {
  if (!city) return [];
  const key = city.toLowerCase();
  const existing = MOCK_EVENTS.filter((e) => (e.city || "").toLowerCase() === key);
  if (existing.length) return existing;

  const hostA = findMockMember("mock_2");
  const hostB = findMockMember("mock_4");
  return [
    {
      id: `event_demo_${key}_cafe`,
      title: `Café morning in ${city}`,
      name: `Café morning in ${city}`,
      city,
      country: country || "",
      location: `${city} centre café`,
      date: "2026-08-18",
      time: "10:00",
      end_time: "11:30",
      category: "coffee",
      description: `Meet other women travelling through ${city} for coffee and a slow morning walk.`,
      attendees_count: 6,
      max_attendees: 10,
      ...hostFields(hostA.user_id),
      image: eventImageFor({ city, category: "cafes" }),
      visibility: "public",
      pricing: "free",
      languages: ["English"],
      attendees: goingAttendees([hostA.user_id, "mock_1"]),
    },
    {
      id: `event_demo_${key}_dinner`,
      title: `Dinner with fellow travellers`,
      name: `Dinner with fellow travellers`,
      city,
      country: country || "",
      location: `${city} restaurant district`,
      date: "2026-08-22",
      time: "19:00",
      end_time: "21:30",
      category: "dinner",
      description: `A small group dinner for women visiting ${city} — good food and easy conversation.`,
      attendees_count: 8,
      max_attendees: 12,
      ...hostFields(hostB.user_id),
      image: eventImageFor({ city, category: "dinner" }),
      visibility: "public",
      pricing: "free",
      languages: ["English"],
      attendees: goingAttendees([hostB.user_id, "mock_2"]),
    },
  ];
}

export function resolveEventId(item) {
  if (item?.eventId || item?.id) return item.eventId || item.id;
  return EVENT_TITLE_TO_ID[item?.title] || null;
}
