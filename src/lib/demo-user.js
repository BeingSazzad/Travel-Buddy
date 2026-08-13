/** Shared demo account used when the backend is unavailable. */
import { memberAvatar, memberPhotos } from "./images";

export const DEMO_USER = {
  id: "mock-user-123",
  email: "clara.nielsen@proton.me",
  role: "user",
  first_name: "Clara",
  last_name: "Nielsen",
  profile_name: "Clara Nielsen",
  date_of_birth: "1996-03-14",
  current_city: "Copenhagen",
  country: "Denmark",
  nationality: "Denmark",
  languages_spoken: ["English", "Danish"],
  biography:
    "Product designer who travels for food markets, design museums, and slow mornings with good coffee. Lisbon in August, then Ubud for a reset.",
  travel_style: ["city break", "wellness"],
  interests: ["cafes", "culture", "photography", "hiking", "food", "yoga"],
  profile_photos: memberPhotos("clara"),
  main_photo: memberAvatar("clara"),
  location_visibility: "approximate",
  show_age: true,
  show_upcoming_trips: true,
  allow_match_suggestions: true,
  allow_event_invitations: true,
  allow_notifications: true,
  profile_completed: true,
  is_email_verified: true,
  identity_verified: true,
  age_verified: true,
  accepted_terms_at: new Date().toISOString(),
  accepted_privacy_at: new Date().toISOString(),
  accepted_community_guidelines_at: new Date().toISOString(),
  subscription_status: "active",
  subscription_plan: "Monthly",
  subscription_current_period_end: "2026-09-11T00:00:00.000Z",
};

export const DEMO_USER_DISPLAY_NAME = DEMO_USER.profile_name;

/** Legacy ids used for the same demo account in mock data */
export const DEMO_USER_IDS = new Set([DEMO_USER.id, "demo_user"]);

export function isSameAppUser(userId, otherId) {
  if (!userId || !otherId) return false;
  if (userId === otherId) return true;
  return DEMO_USER_IDS.has(userId) && DEMO_USER_IDS.has(otherId);
}
