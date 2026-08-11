import { memberAvatar, memberPhotos } from "@/lib/images";
import { normalizeProfileRecord, profilePhotos } from "@/lib/profile-display";

export const MOCK_MEMBERS = [
  {
    user_id: "mock_1",
    name: "Maya Rivera",
    first_name: "Maya",
    age: 26,
    current_city: "London",
    country: "UK",
    bio: "Love exploring local cafes, hiking, and capturing sunsets! Traveling to Bali soon and looking for someone to explore temples and beach clubs with. 🌴✨",
    main_photo: memberAvatar("mock_1"),
    avatar: memberAvatar("mock_1"),
    profile_photos: memberPhotos("mock_1"),
    languages: ["English", "Spanish"],
    interests: ["Hiking", "Photography", "Food", "Adventure"],
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-15",
      end_date: "2026-08-22",
    },
  },
  {
    user_id: "mock_2",
    name: "Ava Laurent",
    first_name: "Ava",
    age: 28,
    current_city: "New York",
    country: "USA",
    bio: "Architect by day, food explorer by night. Excited to explore the historic streets, tiles, and seafood of Lisbon! Let's connect.",
    main_photo: memberAvatar("mock_2"),
    avatar: memberAvatar("mock_2"),
    profile_photos: memberPhotos("mock_2"),
    languages: ["English", "Portuguese"],
    interests: ["Architecture", "Museums", "Food", "Culture"],
    trip: {
      city: "Lisbon",
      country: "Portugal",
      start_date: "2026-08-10",
      end_date: "2026-08-17",
    },
  },
  {
    user_id: "mock_3",
    name: "Sophie Martin",
    first_name: "Sophie",
    age: 24,
    current_city: "Paris",
    country: "France",
    bio: "Yoga teacher. Looking for relaxing vibes, beautiful sunsets, and friendly conversations in Santorini. Let's do a beachside sunset dinner! 🧘‍♀️🌅",
    main_photo: memberAvatar("mock_3"),
    avatar: memberAvatar("mock_3"),
    profile_photos: memberPhotos("mock_3"),
    languages: ["English", "French"],
    interests: ["Wellness", "Yoga", "Beach", "Photography"],
    trip: {
      city: "Santorini",
      country: "Greece",
      start_date: "2026-08-12",
      end_date: "2026-08-19",
    },
  },
  {
    user_id: "mock_4",
    name: "Isabella Chen",
    first_name: "Isabella",
    age: 27,
    current_city: "Berlin",
    country: "Germany",
    bio: "Musician. Ready to wander around the museums, bookshops, and cozy cafes in Paris. Hit me up if you want to explore together!",
    main_photo: memberAvatar("mock_4"),
    avatar: memberAvatar("mock_4"),
    profile_photos: memberPhotos("mock_4"),
    languages: ["English", "German", "French"],
    interests: ["Music", "Shopping", "Cafes", "Art"],
    trip: {
      city: "Paris",
      country: "France",
      start_date: "2026-09-02",
      end_date: "2026-09-08",
    },
  },
  {
    user_id: "mock_5",
    name: "Emma Thompson",
    first_name: "Emma",
    age: 25,
    current_city: "Sydney",
    country: "Australia",
    bio: "Surfer and nature lover. Spending a week in Bali surfing and chilling by the beach. Let's hang out and catch some waves!",
    main_photo: memberAvatar("mock_5"),
    avatar: memberAvatar("mock_5"),
    profile_photos: memberPhotos("mock_5"),
    languages: ["English"],
    interests: ["Surfing", "Beach", "Hiking", "Adventure"],
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-20",
      end_date: "2026-08-28",
    },
  },
];

/** Mutual matches — friends list, messaging, "Remove friend" */
export const DEMO_FRIEND_MEMBER_IDS = ["mock_2", "mock_4"];

/** They liked you — connection requests, not in discover deck */
export const DEMO_INCOMING_REQUEST_IDS = ["mock_3", "mock_5"];

/** Match deck — not friends, no pending incoming request */
export function getDiscoverDeckMembers() {
  const excluded = new Set([...DEMO_FRIEND_MEMBER_IDS, ...DEMO_INCOMING_REQUEST_IDS]);
  return MOCK_MEMBERS.filter((m) => !excluded.has(m.user_id));
}

const MOCK_CONV_MAP = {
  mock_1: "sim_conv_mock_1",
  mock_2: "sim_conv_mock_2",
  mock_3: "sim_conv_mock_3_sophie",
  mock_4: "sim_conv_mock_3",
  mock_5: "sim_conv_mock_4",
};

export function getMockConversationId(memberId) {
  return MOCK_CONV_MAP[memberId] || `sim_conv_${memberId}`;
}

export function findMockMember(userId) {
  return MOCK_MEMBERS.find((m) => m.user_id === userId);
}

export function memberDisplayName(userId) {
  const m = findMockMember(userId);
  return m?.name || "Seluna member";
}

const MOCK_CHAT_SUMMARIES = [
  { convId: "sim_conv_mock_2", memberId: "mock_2", last_message: "Sure! Let's discuss the itinerary.", daysAgo: 1, unread: 0 },
  { convId: "sim_conv_mock_3", memberId: "mock_4", last_message: "That sounds great!", daysAgo: 4, unread: 0 },
];

export function getMockConversations(userId) {
  const uid = userId || "me";
  return MOCK_CHAT_SUMMARIES.map((s) => {
    const m = findMockMember(s.memberId);
    const at = s.hoursAgo != null
      ? new Date(Date.now() - s.hoursAgo * 3600000).toISOString()
      : new Date(Date.now() - s.daysAgo * 86400000).toISOString();
    return {
      id: s.convId,
      participant_ids: [uid, s.memberId],
      participant_names: ["You", m?.name || "Seluna member"],
      participant_avatars: ["", m?.avatar || ""],
      last_message: s.last_message,
      last_message_at: at,
      unread: { [uid]: s.unread || 0 },
      created_date: new Date().toISOString(),
    };
  });
}

export function getMockFriends() {
  return DEMO_FRIEND_MEMBER_IDS.map((memberId) => {
    const m = findMockMember(memberId);
    if (!m) return null;
    return {
      name: m.name,
      loc: `${m.current_city}, ${m.country}`,
      img: m.avatar,
      convId: getMockConversationId(m.user_id),
      memberId: m.user_id,
    };
  }).filter(Boolean);
}

export function getMockConnectionRequests() {
  return DEMO_INCOMING_REQUEST_IDS.map((id) => {
    const m = findMockMember(id);
    if (!m) return null;
    const hoursAgo = id === "mock_3" ? 2 : 26;
    return {
      user_id: m.user_id,
      name: m.name,
      avatar: m.avatar,
      current_city: m.current_city,
      country: m.country,
      trip: m.trip,
      created_date: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
    };
  }).filter(Boolean);
}

export function normalizeMemberData(data) {
  if (!data) return null;
  const raw = data.profile || data;
  if (!raw || typeof raw !== "object") return null;
  const p = normalizeProfileRecord(raw);
  const trips = data.trips || (p.trip ? [p.trip] : []);
  const photos = profilePhotos(p);
  const memberId = p.user_id || p.id || data.user_id || "";
  if (!memberId && !p.name && photos.length === 0) return null;
  return { profile: p, trips, photos, memberId };
}
