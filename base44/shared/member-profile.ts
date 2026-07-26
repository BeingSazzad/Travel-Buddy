function arr(a) { return Array.isArray(a) ? a : []; }

export function ageFrom(dob) {
  if (!dob) return null;
  const d = new Date(dob), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
  return a >= 0 ? a : null;
}

export function displayName(u) {
  return u.profile_name || u.first_name || (u.email ? u.email.split("@")[0] : "Traveler");
}

export function formatDates(t) {
  const s = new Date(t.start_date), e = new Date(t.end_date);
  const M = (d) => d.toLocaleString("en-US", { month: "short" });
  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  return sameMonth
    ? `${M(s)} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`
    : `${M(s)} ${s.getDate()} – ${M(e)} ${e.getDate()}, ${e.getFullYear()}`;
}

export function buildProfile(u) {
  if (!u) return null;
  const locVis = u.location_visibility || "approximate";
  let currentCity = "";
  if (locVis !== "hidden") currentCity = u.current_city || "";
  return {
    user_id: u.id,
    name: displayName(u),
    avatar: u.main_photo || arr(u.profile_photos)[0] || "",
    photos: arr(u.profile_photos),
    age: u.show_age !== false ? ageFrom(u.date_of_birth) : null,
    country: u.country || "",
    current_city: currentCity,
    languages: arr(u.languages_spoken),
    bio: u.biography || "",
    interests: arr(u.interests),
    travel_style: arr(u.travel_style),
    verified: !!u.identity_verified && !!u.age_verified,
  };
}