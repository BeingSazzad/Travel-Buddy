import { findMockMember, MOCK_MEMBERS } from "@/lib/member-profile";
import { memberAvatar, eventImageFor } from "@/lib/images";
import { DEMO_USER, DEMO_USER_DISPLAY_NAME } from "@/lib/demo-user";

function demoMineHost() {
  return {
    host_id: DEMO_USER.id,
    created_by_id: DEMO_USER.id,
    host_name: DEMO_USER_DISPLAY_NAME,
    host_avatar: DEMO_USER.main_photo,
    demo_mine: true,
  };
}

function hostFields(id) {
  const m = findMockMember(id);
  return {
    host_id: id,
    host_name: m?.name || "Seluna host",
    host_avatar: memberAvatar(id),
  };
}

function attendeeFromMember(id) {
  const m = findMockMember(id);
  return {
    user_id: id,
    name: m?.name || "Member",
    avatar: m?.avatar || memberAvatar(id),
    city: m?.current_city,
    status: "going",
    attendance_id: `att_${id}`,
  };
}

function goingAttendees(ids, count) {
  const target = count ?? ids.length;
  const seen = new Set(ids);
  const extra = [];
  for (const m of MOCK_MEMBERS) {
    if (ids.length + extra.length >= target) break;
    if (seen.has(m.user_id)) continue;
    seen.add(m.user_id);
    extra.push(m.user_id);
  }
  return [...ids, ...extra].slice(0, target).map(attendeeFromMember);
}

/** Fill unnamed +N slots with member profiles so Who's coming is a real list. */
export function padGoingAttendees(attendees, totalCount) {
  const list = Array.isArray(attendees) ? [...attendees] : [];
  const going = list.filter((a) => a.status === "going" || !a.status);
  const target = Math.max(Number(totalCount) || 0, going.length);
  if (going.length >= target) return list;
  const used = new Set(list.map((a) => a.user_id).filter(Boolean));
  for (const m of MOCK_MEMBERS) {
    if (going.length >= target) break;
    if (used.has(m.user_id)) continue;
    used.add(m.user_id);
    const extra = attendeeFromMember(m.user_id);
    list.push(extra);
    going.push(extra);
  }
  return list;
}

export function stampDemoMineHost(event, user) {
  if (!event?.demo_mine || !user?.id) return event;
  return {
    ...event,
    host_id: user.id,
    created_by_id: user.id,
    host_name: user.profile_name || user.full_name || event.host_name,
  };
}

export function isDemoEventId(id) {
  const s = String(id || "");
  return s.startsWith("event_local_") || s.startsWith("event_mock") || s.startsWith("event_demo_");
}

export function padDemoAttendees(eventId, attendees, totalCount) {
  if (!isDemoEventId(eventId) && !findMockEvent(eventId)) return attendees || [];
  return padGoingAttendees(attendees, totalCount);
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
    attendees: goingAttendees(["mock_1", "mock_2", "mock_4"], 3),
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
    attendees: goingAttendees(["mock_4", "mock_1", "mock_2"], 12),
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
    attendees: goingAttendees(["mock_2", "mock_1"], 6),
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
    attendees: goingAttendees(["mock_4", "mock_1"], 4),
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
    attendees: goingAttendees(["mock_2", "mock_4", "mock_1"], 7),
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
    attendees: goingAttendees(["mock_1", "mock_2", "mock_4"], 9),
    demo_going: true,
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
    attendees: goingAttendees(["mock_3", "mock_4", "mock_2"], 7),
    demo_going: true,
  },
  {
    id: "event_mock_8",
    title: "Tulum sunrise yoga",
    name: "Tulum sunrise yoga",
    city: "Tulum",
    country: "Mexico",
    location: "Playa Paraíso",
    lat: 20.227,
    lng: -87.428,
    date: "2026-08-24",
    time: "07:00",
    end_time: "08:15",
    category: "yoga",
    description:
      "Beach mats at first light — slow flow, then a swim. All levels. Bring water and a towel.",
    attendees_count: 8,
    max_attendees: 14,
    ...hostFields("mock_14"),
    image: eventImageFor({ city: "Tulum", category: "yoga" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Spanish"],
    attendees: goingAttendees(["mock_14", "mock_5", "mock_2"], 8),
    demo_going: true,
  },
  {
    id: "event_mock_9",
    title: "Canggu beach sunset",
    name: "Canggu beach sunset",
    city: "Canggu",
    country: "Indonesia",
    location: "Batu Bolong Beach",
    lat: -8.659,
    lng: 115.13,
    date: "2026-08-25",
    time: "17:30",
    end_time: "19:00",
    category: "beach",
    description:
      "Golden hour on the sand with other women in Canggu — swim if the tide is kind, then a coconut on the beach.",
    attendees_count: 11,
    max_attendees: 16,
    ...hostFields("mock_16"),
    image: eventImageFor({ city: "Canggu", category: "beach" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_16", "mock_1", "mock_6"], 11),
  },
  {
    id: "event_mock_10",
    title: "Ubud coworking hour",
    name: "Ubud coworking hour",
    city: "Ubud",
    country: "Indonesia",
    location: "Hubud, Campuhan",
    lat: -8.5069,
    lng: 115.2625,
    date: "2026-08-24",
    time: "09:30",
    end_time: "12:00",
    category: "coworking",
    description:
      "Quiet laptops, then a walk to lunch. Come if you’re working remotely in Ubud this week.",
    attendees_count: 5,
    max_attendees: 8,
    ...hostFields("mock_6"),
    image: eventImageFor({ city: "Ubud", category: "coworking" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_6", "mock_16", "mock_2"], 5),
  },
  {
    id: "event_mock_11",
    title: "Seminyak dinner table",
    name: "Seminyak dinner table",
    city: "Seminyak",
    country: "Indonesia",
    location: "Kayu Aya, Seminyak",
    lat: -8.691,
    lng: 115.168,
    date: "2026-08-26",
    time: "19:00",
    end_time: "21:30",
    category: "dinner",
    description:
      "One long table, shared plates, easy conversation. Split the bill — no dress code.",
    attendees_count: 9,
    max_attendees: 12,
    ...hostFields("mock_1"),
    image: eventImageFor({ city: "Seminyak", category: "dinner" }),
    visibility: "public",
    pricing: "paid_external",
    external_link: "https://example.com/seminyak-dinner",
    languages: ["English"],
    age_min: 21,
    attendees: goingAttendees(["mock_1", "mock_16", "mock_4"], 9),
  },
  {
    id: "event_mock_12",
    title: "Berlin night walk",
    name: "Berlin night walk",
    city: "Berlin",
    country: "Germany",
    location: "Prenzlauer Berg, Kulturbrauerei",
    lat: 52.5393,
    lng: 13.4137,
    date: "2026-08-28",
    time: "20:00",
    end_time: "22:30",
    category: "nightlife",
    description:
      "Street lights, a bar or two, and a small group of women who actually want to talk. We leave by 22:30.",
    attendees_count: 7,
    max_attendees: 10,
    ...hostFields("mock_3"),
    image: eventImageFor({ city: "Berlin", category: "nightlife" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "German"],
    age_min: 21,
    attendees: goingAttendees(["mock_3", "mock_5", "mock_8"], 7),
  },
  {
    id: "event_mock_13",
    title: "Oslo fjord brunch",
    name: "Oslo fjord brunch",
    city: "Oslo",
    country: "Norway",
    location: "Aker Brygge",
    lat: 59.909,
    lng: 10.726,
    date: "2026-08-29",
    time: "11:00",
    end_time: "13:00",
    category: "brunch",
    description:
      "Harbour brunch, then a slow walk if the weather holds. Come hungry.",
    attendees_count: 6,
    max_attendees: 10,
    ...hostFields("mock_12"),
    image: eventImageFor({ city: "Oslo", category: "brunch" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Norwegian"],
    attendees: goingAttendees(["mock_12", "mock_2", "mock_5"], 6),
  },
  {
    id: "event_mock_14",
    title: "London founder coffee",
    name: "London founder coffee",
    city: "London",
    country: "United Kingdom",
    location: "Shoreditch High Street",
    lat: 51.5234,
    lng: -0.0781,
    date: "2026-08-30",
    time: "10:00",
    end_time: "11:30",
    category: "networking",
    description:
      "Women building things while travelling — coffee, intros, no pitches. Sit with whoever’s free.",
    attendees_count: 8,
    max_attendees: 12,
    ...hostFields("mock_5"),
    image: eventImageFor({ city: "London", category: "networking" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_5", "mock_8", "mock_3"], 8),
  },
  {
    id: "event_mock_15",
    title: "Paris vintage Sunday",
    name: "Paris vintage Sunday",
    city: "Paris",
    country: "France",
    location: "Marché aux Puces, Saint-Ouen",
    lat: 48.9036,
    lng: 2.3408,
    date: "2026-09-06",
    time: "11:00",
    end_time: "14:00",
    category: "shopping",
    description:
      "Flea-market wander with a small group — try things on, skip the rush. Meet at the Porte de Clignancourt exit.",
    attendees_count: 6,
    max_attendees: 10,
    ...hostFields("mock_4"),
    image: eventImageFor({ city: "Paris", category: "shopping" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "French"],
    attendees: goingAttendees(["mock_4", "mock_3", "mock_11"], 6),
  },
  {
    id: "event_mock_16",
    title: "Tokyo ramen night",
    name: "Tokyo ramen night",
    city: "Tokyo",
    country: "Japan",
    location: "Shimokitazawa, south exit",
    lat: 35.6614,
    lng: 139.668,
    date: "2026-09-07",
    time: "19:00",
    end_time: "21:00",
    category: "dinner",
    description:
      "One counter, one bowl, easy company. We’ll queue together — come as you are.",
    attendees_count: 5,
    max_attendees: 6,
    ...hostFields("mock_7"),
    image: eventImageFor({ city: "Tokyo", category: "dinner" }),
    visibility: "approval",
    pricing: "free",
    languages: ["English", "Korean"],
    attendees: goingAttendees(["mock_7", "mock_8", "mock_6"], 5),
  },
  {
    id: "event_mock_17",
    title: "Marrakech souk morning",
    name: "Marrakech souk morning",
    city: "Marrakech",
    country: "Morocco",
    location: "Jemaa el-Fnaa, café terrace",
    lat: 31.6258,
    lng: -7.9891,
    date: "2026-09-13",
    time: "09:30",
    end_time: "12:00",
    category: "sightseeing",
    description:
      "Guided walk through the medina — spices, riads, and a mint-tea pause. Daytime only.",
    attendees_count: 10,
    max_attendees: 12,
    ...hostFields("mock_13"),
    image: eventImageFor({ city: "Marrakech", category: "sightseeing" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Arabic"],
    attendees: goingAttendees(["mock_13", "mock_4", "mock_11"], 10),
  },
  {
    id: "event_mock_18",
    title: "Cape Town coastal hike",
    name: "Cape Town coastal hike",
    city: "Cape Town",
    country: "South Africa",
    location: "Lions Head trailhead",
    lat: -33.9349,
    lng: 18.389,
    date: "2026-09-10",
    time: "07:30",
    end_time: "11:00",
    category: "hiking",
    description:
      "Early start, moderate pace, Atlantic views. Sturdy shoes and water — we turn around together.",
    attendees_count: 7,
    max_attendees: 10,
    ...hostFields("mock_15"),
    image: eventImageFor({ city: "Cape Town", category: "hiking" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_15", "mock_1", "mock_5"], 7),
  },
  {
    id: "event_mock_19",
    title: "Rome Trastevere dinner",
    name: "Rome Trastevere dinner",
    city: "Rome",
    country: "Italy",
    location: "Piazza di Santa Maria in Trastevere",
    lat: 41.8897,
    lng: 12.4706,
    date: "2026-09-04",
    time: "19:30",
    end_time: "22:00",
    category: "dinner",
    description:
      "Carbonara, a shared table, and a walk when the streets empty. Small group.",
    attendees_count: 8,
    max_attendees: 10,
    ...hostFields("mock_11"),
    image: eventImageFor({ city: "Rome", category: "dinner" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Italian"],
    attendees: goingAttendees(["mock_11", "mock_2", "mock_4"], 8),
  },
  {
    id: "event_mock_mine_1",
    title: "Nyhavn morning coffee",
    name: "Nyhavn morning coffee",
    city: "Copenhagen",
    country: "Denmark",
    location: "Nyhavn harbour, by the yellow houses",
    lat: 55.6797,
    lng: 12.5918,
    date: "2026-08-23",
    time: "10:00",
    end_time: "11:30",
    category: "coffee",
    description:
      "Slow Saturday coffee on the canal with other women in town — then a walk toward the harbour baths if the sun stays out.",
    attendees_count: 5,
    max_attendees: 8,
    ...demoMineHost(),
    image: eventImageFor({ city: "Copenhagen", category: "cafes" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "Danish"],
    attendees: goingAttendees(["mock_2", "mock_12", "mock_4"], 5),
  },
  {
    id: "event_mock_mine_2",
    title: "Lisbon wine & tiles",
    name: "Lisbon wine & tiles",
    city: "Lisbon",
    country: "Portugal",
    location: "Miradouro de Santa Catarina",
    lat: 38.7096,
    lng: -9.1484,
    date: "2026-08-26",
    time: "18:30",
    end_time: "21:00",
    category: "wine",
    description:
      "Sunset viewpoint, a glass of vinho verde, and easy conversation. Small group — come as you are.",
    attendees_count: 6,
    max_attendees: 10,
    ...demoMineHost(),
    image: eventImageFor({ city: "Lisbon", category: "wine" }),
    visibility: "approval",
    pricing: "free",
    languages: ["English", "Portuguese"],
    attendees: goingAttendees(["mock_11", "mock_2", "mock_1"], 6),
  },
  {
    id: "event_mock_mine_3",
    title: "Ubud jungle brunch",
    name: "Ubud jungle brunch",
    city: "Bali",
    country: "Indonesia",
    location: "Campuhan Ridge, Ubud",
    lat: -8.5039,
    lng: 115.2546,
    date: "2026-09-02",
    time: "09:00",
    end_time: "11:30",
    category: "brunch",
    description:
      "Ridge walk first, then brunch in the rice fields. Calm pace — all levels welcome.",
    attendees_count: 4,
    max_attendees: 8,
    ...demoMineHost(),
    image: eventImageFor({ city: "Bali", category: "cafes" }),
    visibility: "public",
    pricing: "free",
    languages: ["English"],
    attendees: goingAttendees(["mock_16", "mock_1", "mock_2"], 4),
  },
  {
    id: "event_mock_mine_4",
    title: "Paris espresso hour",
    name: "Paris espresso hour",
    city: "Paris",
    country: "France",
    location: "Le Marais, Place des Vosges",
    lat: 48.8556,
    lng: 2.3655,
    date: "2026-09-05",
    time: "16:00",
    end_time: "17:30",
    category: "coffee",
    description:
      "A quiet square, one espresso, and whoever wants to wander toward the Seine after.",
    attendees_count: 4,
    max_attendees: 8,
    ...demoMineHost(),
    image: eventImageFor({ city: "Paris", category: "coffee" }),
    visibility: "public",
    pricing: "free",
    languages: ["English", "French"],
    attendees: goingAttendees(["mock_4", "mock_3", "mock_11"], 4),
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
  "Nyhavn morning coffee": "event_mock_mine_1",
  "Lisbon wine & tiles": "event_mock_mine_2",
  "Ubud jungle brunch": "event_mock_mine_3",
  "Paris espresso hour": "event_mock_mine_4",
  "Tulum sunrise yoga": "event_mock_8",
  "Canggu beach sunset": "event_mock_9",
  "Ubud coworking hour": "event_mock_10",
  "Seminyak dinner table": "event_mock_11",
  "Berlin night walk": "event_mock_12",
  "Oslo fjord brunch": "event_mock_13",
  "London founder coffee": "event_mock_14",
  "Paris vintage Sunday": "event_mock_15",
  "Tokyo ramen night": "event_mock_16",
  "Marrakech souk morning": "event_mock_17",
  "Cape Town coastal hike": "event_mock_18",
  "Rome Trastevere dinner": "event_mock_19",
};

const LOCAL_EVENTS_KEY = "seluna_user_events";

export function getLocalEvents() {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveLocalEvent(event) {
  if (!event?.id) return event;
  const next = [event, ...getLocalEvents().filter((e) => e.id !== event.id)];
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(next));
  return event;
}

export function updateLocalEvent(id, data) {
  const list = getLocalEvents();
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return null;
  const next = { ...list[idx], ...data, id };
  const updated = [...list];
  updated[idx] = next;
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
  return next;
}

export function removeLocalEvent(id) {
  const next = getLocalEvents().filter((e) => e.id !== id);
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(next));
}

export function isLocalEventId(id) {
  return typeof id === "string" && id.startsWith("event_local_");
}

export function findMockEvent(id) {
  return getLocalEvents().find((e) => e.id === id) || MOCK_EVENTS.find((e) => e.id === id) || null;
}

/** Attach real member headshots so list cards never show a count with empty faces. */
export function hydrateEventPeople(event) {
  if (!event) return event;
  const mock =
    findMockEvent(event.id) || MOCK_EVENTS.find((m) => m.title === event.title || m.name === event.name);
  const raw = event.attendees?.length ? event.attendees : mock?.attendees || [];
  const count = Math.max(event.attendees_count || 0, mock?.attendees_count || 0, raw.length);
  const attendees = padGoingAttendees(raw, count);
  return {
    ...event,
    attendees,
    attendees_count: count || attendees.length,
    host_avatar: event.host_avatar || mock?.host_avatar || attendees[0]?.avatar,
    host_name: event.host_name || mock?.host_name,
  };
}

export function eventGoingAvatars(event, limit = 3) {
  const people = hydrateEventPeople(event);
  const urls = (people.attendees || [])
    .filter((a) => a.status !== "pending")
    .map((a) => a.avatar)
    .filter(Boolean);
  if (urls.length) return urls.slice(0, limit);
  if (people.host_avatar) return [people.host_avatar];
  return MOCK_MEMBERS.slice(0, Math.min(limit, Math.max(people.attendees_count || 0, 1))).map(
    (m) => m.avatar
  );
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
      attendees: goingAttendees([hostA.user_id, "mock_1"], 6),
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
      attendees: goingAttendees([hostB.user_id, "mock_2"], 8),
    },
  ];
}

export function resolveEventId(item) {
  if (item?.eventId || item?.id) return item.eventId || item.id;
  return EVENT_TITLE_TO_ID[item?.title] || null;
}
