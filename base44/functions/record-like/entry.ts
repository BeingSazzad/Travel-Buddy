import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import { buildProfile } from "../../shared/member-profile.ts";

async function findConversation(base44, a, b) {
  const list = await base44.asServiceRole.entities.Conversation.filter({
    "data.participant_ids": { $all: [a, b] },
  });
  return list[0] || null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { liked_user_id, action } = body;
    if (!liked_user_id || !["like", "pass"].includes(action)) {
      return Response.json({ error: "liked_user_id and action (like|pass) required" }, { status: 400 });
    }

    await base44.entities.Like.create({ liked_user_id, action });
    if (action !== "like") return Response.json({ matched: false });

    const myProf = buildProfile(user);
    const users = await base44.asServiceRole.entities.User.list();
    const them = users.find((u) => u.id === liked_user_id);
    const theirProf = buildProfile(them);

    // Existing match?
    let match = null;
    const existing = await base44.asServiceRole.entities.Match.filter({
      $or: [
        { created_by_id: user.id, "data.match_user_id": liked_user_id },
        { created_by_id: liked_user_id, "data.match_user_id": user.id },
      ],
    });
    if (existing.length) {
      match = existing[0];
    } else {
      const theirLikes = await base44.asServiceRole.entities.Like.filter({
        created_by_id: liked_user_id,
        "data.action": "like",
      });
      const mutual = theirLikes.some((l) => l.liked_user_id === user.id);
      if (!mutual) return Response.json({ matched: false });

      match = await base44.entities.Match.create({
        match_user_id: liked_user_id,
        match_name: theirProf?.name || "",
        match_avatar: theirProf?.avatar || "",
        city: theirProf?.current_city || "",
        dates: "",
      });
    }

    // Ensure a private conversation exists between the two members
    let conversation_id = null;
    let conv = await findConversation(base44, user.id, liked_user_id);
    if (!conv) {
      conv = await base44.entities.Conversation.create({
        participant_ids: [user.id, liked_user_id],
        participant_names: [myProf?.name || "", theirProf?.name || ""],
        participant_avatars: [myProf?.avatar || "", theirProf?.avatar || ""],
        match_id: match.id,
        last_message: "",
      });
    }
    conversation_id = conv.id;

    return Response.json({ matched: true, match: { ...match, conversation_id } });
  } catch (error) {
    console.error("record-like error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});