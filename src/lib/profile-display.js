/** Normalize profile fields for display — bridges setup form ↔ profile views */

export function getProfileAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

export function profileDisplayName(profile) {
  if (!profile) return "Seluna member";
  return (
    profile.profile_name ||
    profile.name ||
    profile.full_name ||
    profile.first_name ||
    "Seluna member"
  );
}

export function profileBiography(profile) {
  if (!profile) return "";
  return (profile.biography || profile.bio || "").trim();
}

export function profileLanguages(profile) {
  if (!profile) return [];
  const raw = profile.languages_spoken || profile.languages || [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [];
}

export function profileTravelStyles(profile) {
  if (!profile) return [];
  const raw = profile.travel_style || [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [];
}

export function profileInterests(profile) {
  if (!profile) return [];
  const raw = profile.interests || [];
  return Array.isArray(raw) ? raw.filter(Boolean) : [];
}

export function profilePhotos(profile) {
  if (!profile) return [];
  const photos = profile.profile_photos || profile.photos || [];
  return Array.isArray(photos) ? photos.filter(Boolean) : [];
}

export function profileMainPhoto(profile, fallback = "") {
  return profile?.main_photo || profile?.avatar || profilePhotos(profile)[0] || fallback;
}

/** Location string respecting privacy when viewing someone else's profile */
export function profileLocationText(profile, { viewerIsOwner = false } = {}) {
  if (!profile) return "";
  const city = profile.current_city?.trim();
  const country = profile.country?.trim();
  const nationality = profile.nationality?.trim();

  if (viewerIsOwner) {
    const parts = [city, country].filter(Boolean);
    return parts.join(", ");
  }

  const visibility = profile.location_visibility || "approximate";
  if (visibility === "hidden") return "";
  if (visibility === "approximate") return country || "";
  return [city, country].filter(Boolean).join(", ");
}

export function profileNationality(profile, { viewerIsOwner = false } = {}) {
  if (!profile?.nationality) return "";
  if (!viewerIsOwner && profile.location_visibility === "hidden") return "";
  return profile.nationality;
}

export function profileAge(profile, { viewerIsOwner = false } = {}) {
  if (!profile) return null;
  if (!viewerIsOwner && profile.show_age === false) return null;
  if (profile.age != null && profile.age >= 0) return profile.age;
  return getProfileAge(profile.date_of_birth);
}

export function profileHandle(user) {
  if (user?.profile_handle) return user.profile_handle.replace(/^@/, "");
  if (user?.email) return user.email.split("@")[0].replace(/\./g, "");
  const base = (user?.profile_name || user?.first_name || "member").toLowerCase();
  const last = (user?.last_name || "").charAt(0).toLowerCase();
  return `${base}${last}`.replace(/\s/g, "");
}

/** Map auth / API user record → member profile card shape */
export function normalizeProfileRecord(profile) {
  if (!profile || typeof profile !== "object") return null;
  return {
    ...profile,
    name: profileDisplayName(profile),
    bio: profileBiography(profile),
    biography: profileBiography(profile),
    languages: profileLanguages(profile),
    languages_spoken: profileLanguages(profile),
    travel_style: profileTravelStyles(profile),
    interests: profileInterests(profile),
    profile_photos: profilePhotos(profile),
    age: profileAge(profile, { viewerIsOwner: true }),
  };
}
