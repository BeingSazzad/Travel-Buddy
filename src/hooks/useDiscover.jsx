import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const MOCK_MEMBERS = [
  {
    user_id: "mock_1",
    name: "Maya R.",
    first_name: "Maya",
    age: 26,
    current_city: "London",
    country: "UK",
    bio: "Love exploring local cafes, hiking, and capturing sunsets! Traveling to Bali soon and looking for someone to explore temples and beach clubs with. 🌴✨",
    main_photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80",
    profile_photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80"
    ],
    languages: ["English", "Spanish"],
    interests: ["Hiking", "Photography", "Food", "Adventure"],
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-15",
      end_date: "2026-08-22",
    }
  },
  {
    user_id: "mock_2",
    name: "Ava L.",
    first_name: "Ava",
    age: 28,
    current_city: "New York",
    country: "USA",
    bio: "Architect by day, food explorer by night. Excited to explore the historic streets, tiles, and seafood of Lisbon! Let's connect.",
    main_photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80",
    profile_photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80"
    ],
    languages: ["English", "Portuguese"],
    interests: ["Architecture", "Museums", "Food", "Culture"],
    trip: {
      city: "Lisbon",
      country: "Portugal",
      start_date: "2026-08-10",
      end_date: "2026-08-17",
    }
  },
  {
    user_id: "mock_3",
    name: "Sophie M.",
    first_name: "Sophie",
    age: 24,
    current_city: "Paris",
    country: "France",
    bio: "Yoga teacher. Looking for relaxing vibes, beautiful sunsets, and friendly conversations in Santorini. Let's do a beachside sunset dinner! 🧘‍♀️🌅",
    main_photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80",
    profile_photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80"
    ],
    languages: ["English", "French"],
    interests: ["Wellness", "Yoga", "Beach", "Photography"],
    trip: {
      city: "Santorini",
      country: "Greece",
      start_date: "2026-08-12",
      end_date: "2026-08-19",
    }
  },
  {
    user_id: "mock_4",
    name: "Isabella K.",
    first_name: "Isabella",
    age: 27,
    current_city: "Berlin",
    country: "Germany",
    bio: "Musician. Ready to wander around the museums, bookshops, and cozy cafes in Paris. Hit me up if you want to explore together!",
    main_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80",
    profile_photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80"
    ],
    languages: ["English", "German", "French"],
    interests: ["Music", "Shopping", "Cafes", "Art"],
    trip: {
      city: "Paris",
      country: "France",
      start_date: "2026-09-02",
      end_date: "2026-09-08",
    }
  },
  {
    user_id: "mock_5",
    name: "Emma T.",
    first_name: "Emma",
    age: 25,
    current_city: "Sydney",
    country: "Australia",
    bio: "Surfer and nature lover. Spending a week in Bali surfing and chilling by the beach. Let's hang out and catch some waves!",
    main_photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=400&q=80",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=400&q=80",
    profile_photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=400&q=80"
    ],
    languages: ["English"],
    interests: ["Surfing", "Beach", "Hiking", "Adventure"],
    trip: {
      city: "Bali",
      country: "Indonesia",
      start_date: "2026-08-20",
      end_date: "2026-08-28",
    }
  }
];

export function useDiscover() {
  const { isAuthenticated } = useAuth();
  const [deck, setDeck] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matched, setMatched] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke("discover-members", {});
      const members = res.data?.members || [];
      setDeck(members.length > 0 ? members : MOCK_MEMBERS);
    } catch (e) {
      setDeck(MOCK_MEMBERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) load();
  }, [isAuthenticated, load]);

  const act = useCallback(async (member, action) => {
    try {
      const res = await base44.functions.invoke("record-like", {
        liked_user_id: member.user_id,
        action,
      });
      if (res.data?.matched) {
        setMatched({ ...res.data.match, name: member.name, avatar: member.avatar });
      }
    } catch (e) {
      if (action === "like") {
        // Generate mock conversation ID that matches the sim_conv_mock_X pattern in Messages.jsx
        const mockConvMap = {
          "mock_1": "sim_conv_mock_1",
          "mock_2": "sim_conv_mock_2",
          "mock_3": "sim_conv_mock_3_sophie",
          "mock_4": "sim_conv_mock_3",
          "mock_5": "sim_conv_mock_4",
        };
        const convId = mockConvMap[member.user_id] || "sim_conv_mock_1";
        setMatched({
          id: "sim_match_" + member.user_id,
          match_user_id: member.user_id,
          name: member.name,
          avatar: member.main_photo || member.avatar,
          conversation_id: convId,
        });
      }
    }
  }, []);

  const decide = useCallback(
    (member, choice) => {
      setDeck((d) => d.filter((m) => m.user_id !== member.user_id));
      act(member, choice === "connect" ? "like" : "pass");
    },
    [act]
  );

  const unmatch = useCallback(async (matchId) => {
    try {
      await base44.entities.Match.delete(matchId);
    } catch (e) {
      /* ignore */
    }
  }, []);

  const block = useCallback(async (userId) => {
    try {
      await base44.entities.BlockedMember.create({ blocked_user_id: userId, reason: "block" });
    } catch (e) {
      /* already blocked */
    }
  }, []);

  const viewProfile = useCallback(async (member) => {
    try {
      setProfileLoading(true);
      const res = await base44.functions.invoke("member-profile", { user_id: member.user_id });
      setProfile(res.data);
    } catch (e) {
      const mock = MOCK_MEMBERS.find((m) => m.user_id === member.user_id);
      setProfile(mock || null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  return {
    deck, loading, matched, setMatched,
    profile, setProfile, profileLoading, viewProfile,
    decide, reload: load, unmatch, block,
  };
}