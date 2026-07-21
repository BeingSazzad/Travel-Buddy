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
    const { target_user_id } = body;
    if (!target_user_id || target_user_id === user.id)
      return Response.json({ error: "target_user_id required" }, { status: 400 });

    const users = await base44.asServiceRole.entities.User.list();
    const them = users.find((u) => u.id === target_user_id);
    const myProf = buildProfile(user);
    const theirProf = buildProfile(them);

    let conv = await findConversation(base44, user.id, target_user_id);
    if (!conv) {
      conv = await base44.entities.Conversation.create({
        participant_ids: [user.id, target_user_id],
        participant_names: [myProf?.name || "", theirProf?.name || ""],
        participant_avatars: [myProf?.avatar || "", theirProf?.avatar || ""],
        last_message: "",
      });
    }
    return Response.json({ conversation_id: conv.id });
  } catch (error) {
    console.error("start-conversation error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});