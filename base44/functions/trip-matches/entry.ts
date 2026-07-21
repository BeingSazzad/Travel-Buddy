import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

const STYLE_ALIASES = { "city breaks": "city break", "beach holidays": "beach" };

function arr(a) { return Array.isArray(a) ? a : []; }
function lc(s) { return (s || "").toString().toLowerCase().trim(); }
function normStyle(s) { return STYLE_ALIASES[lc(s)] || lc(s); }
function intersect(a, b) {
  const set = new Set(arr(a).map(lc));
  return arr(b).filter((x) => set.has(lc(x)));
}
function tripsOverlap(a, b) {
  const s1 = new Date(a.start_date), e1 = new Date(a.end_date);
  const s2 = new Date(b.start_date), e2 = new Date(b.end_date);
  return s1 <= e2 && s2 <= e1;
}
function monthName(d) { return new Date(d).toLocaleString("en-US", { month: "long" }); }
function formatDates(t) {
  const s = new Date(t.start_date), e = new Date(t.end_date);
  const M = (d) => d.toLocaleString("en-US", { month: "short" });
  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  return sameMonth
    ? `${M(s)} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`
    : `${M(s)} ${s.getDate()} – ${M(e)} ${e.getDate()}, ${e.getFullYear()}`;
}
function formatList(items) {
  const a = items.filter(Boolean);
  if (a.length === 0) return "";
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(", ")} and ${a[a.length - 1]}`;
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function ageFrom(dob) {
  if (!dob) return null;
  const d = new Date(dob), t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
  return a >= 0 ? a : null;
}
function displayName(u) {
  return u.profile_name || u.first_name || (u.email ? u.email.split("@")[0] : "Traveler");
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const allTrips = await base44.asServiceRole.entities.Trip.list("-start_date", 500);
    const myTrips = allTrips.filter((t) => t.created_by_id === user.id);
    if (myTrips.length === 0) return Response.json({ suggestions: [], hasTrips: false });

    const blocked = await base44.asServiceRole.entities.BlockedMember.filter({ created_by_id: user.id });
    const blockedIds = new Set(blocked.map((b) => b.blocked_user_id));

    const users = await base44.asServiceRole.entities.User.list();
    const userMap = new Map(users.map((u) => [u.id, u]));

    const otherTrips = allTrips.filter(
      (t) =>
        t.created_by_id !== user.id &&
        !blockedIds.has(t.created_by_id) &&
        t.visibility !== "hidden"
    );

    const byUser = new Map();
    for (const t of otherTrips) {
      const them = userMap.get(t.created_by_id);
      if (!them) continue;
      if (them.allow_match_suggestions === false) continue;
      if (them.show_upcoming_trips === false) continue;
      if (!byUser.has(t.created_by_id)) byUser.set(t.created_by_id, { user: them, trips: [] });
      byUser.get(t.created_by_id).trips.push(t);
    }

    const suggestions = [];
    for (const [uid, { user: them, trips }] of byUser) {
      let best = null;
      for (const their of trips) {
        for (const mine of myTrips) {
          if (lc(their.city) === lc(mine.city) && tripsOverlap(their, mine)) {
            const sharedActs = intersect(mine.looking_for, their.looking_for);
            const styleMatch =
              mine.travel_style && their.travel_style && normStyle(mine.travel_style) === normStyle(their.travel_style)
                ? mine.travel_style
                : null;
            const sub = 2 + sharedActs.length + (styleMatch ? 2 : 0);
            if (!best || sub > best.sub) best = { mine, their, sharedActs, styleMatch, sub };
          }
        }
      }
      if (!best) continue;

      const sharedLangs = [...new Set(intersect(user.languages_spoken, them.languages_spoken))];
      const sharedInterests = [...new Set(intersect(user.interests, them.interests))];
      const sharedStylesUser = [...new Set(intersect(user.travel_style, them.travel_style))];

      const reasons = [];
      reasons.push({ type: "destination", label: `Travelling to ${best.their.city}` });
      reasons.push({ type: "dates", label: "Overlapping dates" });
      if (best.styleMatch) reasons.push({ type: "style", label: `${best.styleMatch} travel style` });
      for (const a of best.sharedActs) reasons.push({ type: "activity", label: a });
      for (const l of sharedLangs) reasons.push({ type: "language", label: l });
      for (const i of sharedInterests) reasons.push({ type: "interest", label: i });

      const parts = [];
      parts.push(`You are both travelling to ${best.their.city} in ${monthName(best.their.start_date)}`);
      const interList = [...best.sharedActs, ...sharedInterests];
      if (interList.length) parts.push(`interested in ${formatList(interList)}`);
      if (sharedLangs.length) parts.push(`both speak ${formatList(sharedLangs)}`);
      if (best.styleMatch || sharedStylesUser.length) {
        const st = best.styleMatch || sharedStylesUser[0];
        parts.push(`share a ${st} travel style`);
      }
      let explanation = parts[0];
      if (parts.length > 1) explanation += " and " + parts.slice(1).join(", ");
      explanation += ".";

      const score =
        2 +
        best.sharedActs.length * 1 +
        (best.styleMatch ? 2 : 0) +
        sharedLangs.length +
        sharedInterests.length * 1.5 +
        (sharedStylesUser.length ? 1 : 0);
      const matchPercent = Math.min(99, Math.round(40 + score * 8));

      const locVis = them.location_visibility || "approximate";
      let locationText = "";
      if (locVis !== "hidden") {
        locationText = locVis === "exact_city" ? them.current_city || "" : them.country || "";
      }

      suggestions.push({
        user_id: them.id,
        name: displayName(them),
        avatar: them.main_photo || arr(them.profile_photos)[0] || "",
        age: them.show_age !== false ? ageFrom(them.date_of_birth) : null,
        locationText,
        city: best.their.city,
        country: best.their.country,
        dates: formatDates(best.their),
        score,
        matchPercent,
        explanation,
        reasons,
      });
    }

    suggestions.sort((a, b) => b.score - a.score);
    return Response.json({ suggestions, hasTrips: true });
  } catch (error) {
    console.error("trip-matches error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});