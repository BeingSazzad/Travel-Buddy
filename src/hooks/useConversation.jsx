import { useCallback, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useConversation(conversationId) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const convRef = useRef(null);
  useEffect(() => { convRef.current = conversation; }, [conversation]);

  const load = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const conv = await base44.entities.Conversation.get(conversationId);
      setConversation(conv);
      const msgs = await base44.entities.Message.filter({ conversation_id: conversationId }, "created_date", 200);

      // Mark incoming unread messages as read
      const incomingUnread = msgs.filter((m) => m.sender_id !== user?.id && !m.read);
      if (incomingUnread.length) {
        await base44.entities.Message.bulkUpdate(incomingUnread.map((m) => ({ id: m.id, read: true }))).catch(() => {});
      }
      setMessages(msgs.map((m) => (m.sender_id !== user?.id ? { ...m, read: true } : m)));

      // Clear my unread badge
      const myUnread = conv.unread?.[user?.id] || 0;
      if (myUnread > 0) {
        await base44.entities.Conversation.update(conversationId, {
          unread: { ...(conv.unread || {}), [user.id]: 0 },
        }).catch(() => {});
        setConversation({ ...conv, unread: { ...(conv.unread || {}), [user.id]: 0 } });
      }
    } catch (e) {
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => { load(); }, [load]);

  // Realtime messages
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.entities.Message.subscribe((event) => {
      const m = event.data;
      if (m?.conversation_id !== conversationId) return;
      if (event.type === "delete") {
        setMessages((prev) => prev.filter((x) => x.id !== event.data.id));
        return;
      }
      setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev.map((x) => (x.id === m.id ? m : x)) : [...prev, m]));
      if (m.sender_id !== user?.id && !m.read) {
        base44.entities.Message.update(m.id, { read: true }).catch(() => {});
      }
    });
    return unsub;
  }, [conversationId, user]);

  // Realtime conversation (typing, last message)
  useEffect(() => {
    if (!conversationId) return;
    const unsub = base44.entities.Conversation.subscribe((event) => {
      if (event.data?.id !== conversationId) return;
      setConversation(event.data);
    });
    return unsub;
  }, [conversationId]);

  const send = useCallback(
    async (payload) => {
      const conv = convRef.current;
      if (!conv) return;
      const type = payload.type || "text";
      const text = payload.text || "";
      try {
        setSending(true);
        const msg = await base44.entities.Message.create({
          conversation_id: conversationId,
          participant_ids: conv.participant_ids,
          sender_id: user?.id,
          type,
          text,
          image_url: payload.image_url || "",
          content_type: payload.content_type || "",
          content_data: payload.content_data || null,
          read: false,
        });
        const otherId = conv.participant_ids.find((p) => p !== user?.id);
        const preview = type === "image" ? "📷 Photo" : type === "content" ? `📎 ${payload.content_data?.title || "Shared content"}` : text;
        const nextUnread = { ...(conv.unread || {}), [otherId]: (conv.unread?.[otherId] || 0) + 1 };
        await base44.entities.Conversation.update(conversationId, {
          last_message: preview,
          last_message_at: new Date().toISOString(),
          unread: nextUnread,
        });
        setConversation((c) => (c ? { ...c, last_message: preview, last_message_at: new Date().toISOString(), unread: nextUnread } : c));
        setMessages((prev) => (prev.some((x) => x.id === msg.id) ? prev : [...prev, msg]));
      } finally {
        setSending(false);
      }
    },
    [conversationId, user]
  );

  const deleteMessage = useCallback(async (messageId) => {
    await base44.entities.Message.delete(messageId).catch(() => {});
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, []);

  const setTyping = useCallback(
    async (typing) => {
      const conv = convRef.current;
      if (!conv) return;
      const next = { ...(conv.typing || {}), [user.id]: typing ? Date.now() : 0 };
      await base44.entities.Conversation.update(conversationId, { typing: next }).catch(() => {});
    },
    [conversationId, user]
  );

  return { conversation, messages, loading, sending, send, deleteMessage, setTyping };
}