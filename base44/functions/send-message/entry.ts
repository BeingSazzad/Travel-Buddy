import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { conversation_id, type, text, image_url, content_type, content_data } = body;
    if (!conversation_id) return Response.json({ error: "conversation_id required" }, { status: 400 });

    const conv = await base44.entities.Conversation.get(conversation_id);
    if (!conv) return Response.json({ error: "Conversation not found" }, { status: 404 });
    const otherId = conv.participant_ids.find((p) => p !== user.id);

    // Enforce block in either direction — neither user can message the other
    const allBlocks = await base44.asServiceRole.entities.BlockedMember.list("-created_date", 1000);
    const isBlocked = allBlocks.some(
      (b) =>
        (b.created_by_id === user.id && b.blocked_user_id === otherId) ||
        (b.created_by_id === otherId && b.blocked_user_id === user.id)
    );
    if (isBlocked) return Response.json({ blocked: true });

    const t = type || "text";
    const msg = await base44.entities.Message.create({
      conversation_id,
      participant_ids: conv.participant_ids,
      sender_id: user.id,
      type: t,
      text: text || "",
      image_url: image_url || "",
      content_type: content_type || "",
      content_data: content_data || null,
      read: false,
    });

    const preview = t === "image" ? "📷 Photo" : t === "content" ? `📎 ${content_data?.title || "Shared content"}` : text;
    const now = new Date().toISOString();
    const nextUnread = { ...(conv.unread || {}), [otherId]: (conv.unread?.[otherId] || 0) + 1 };
    await base44.entities.Conversation.update(conversation_id, {
      last_message: preview,
      last_message_at: now,
      unread: nextUnread,
    });

    return Response.json({ ok: true, message: msg, last_message: preview, last_message_at: now, unread: nextUnread });
  } catch (error) {
    console.error("send-message error", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});