import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { buildProfile, formatDates } from "../../shared/member-profile.ts";

function arr(a) { return Array.isArray(a) ? a : []; }

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const likes = await base44.entities.Like.list("-created_date", 500);
    const acted = new Set(likes.map((l) => l.liked_user_id));
    const allBlocks = await base44.asServiceRole.entities.BlockedMember.list("-created_date", 1000);
    const blockedIds = new Set();
    for (const b of allBlocks) {
      if (b.created_by_id === user.id) blockedIds.add(b.blocked_user_id);
      if (b.blocked_user_id === user.id) blockedIds.add(b.created_by_id);
    }

    const allTrips = await base44.asServiceRole.entities.Trip.list("-start_date", 500);
    const users = await base44.asServiceRole.entities.User.list();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const members = [];
    for (const u of users) {
      if (u.id === user.id) continue;
      if (acted.has(u.id)) continue;
      if (blockedIds.has(u.id)) continue;
      if (u.allow_match_suggestions === false) continue;

      const upcoming = allTrips
        .filter((t) => t.created_by_id === u.id && t.visibility !== "hidden" && new Date(t.start_date) >= today)
        .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      const trip = upcoming[0] || null;
      members.push({
        ...buildProfile(u),
        trip: trip ? {
          id: trip.id,
          city: trip.city,
          country: trip.country || "",
          start_date: trip.start_date,
          end_date: trip.end_date,
          travel_style: trip.travel_style || "",
          looking_for: arr(trip.looking_for),
          dates: formatDates(trip),
        } : null,
      });
    }

    // Prioritise members with an upcoming destination, then by name.
    members.sort((a, b) => {
      if (a.trip && !b.trip) return -1;
      if (!a.trip && b.trip) return 1;
      if (a.trip && b.trip) return new Date(a.trip.start_date) - new Date(b.trip.start_date);
      return String(a.name).localeCompare(String(b.name));
    });

    return Response.json({ members });
  } catch (error) {
    console.error("discover-members error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});