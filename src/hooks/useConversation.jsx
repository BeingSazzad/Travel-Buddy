import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

export function useConversation(conversationId) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      const conv = await base44.entities.Conversation.get(conversationId);
      setConversation(conv);
      const msgs = await base44.entities.Message.filter(
        { conversation_id: conversationId },
        "created_date",
        200
      );
      setMessages(msgs);

      // Mark my unread count as cleared when I open the conversation
      const myUnread = conv.unread?.[user?.id] || 0;
      if (myUnread > 0) {
        await base44.entities.Conversation.update(conversationId, {
          unread: { ...conv.unread, [user.id]: 0 },
        });
        setConversation({ ...conv, unread: { ...conv.unread, [user.id]: 0 } });
      }
    } catch (e) {
      setConversation(null);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!conversationId) return;
    const unsubscribe = base44.entities.Message.subscribe((event) => {
      if (event.data?.conversation_id !== conversationId) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === event.data.id)) return prev;
        return [...prev, event.data];
      });
    });
    return unsubscribe;
  }, [conversationId]);

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || !conversation) return;
      try {
        setSending(true);
        await base44.entities.Message.create({
          conversation_id: conversationId,
          participant_ids: conversation.participant_ids,
          sender_id: user?.id,
          text: trimmed,
        });
        const otherId = conversation.participant_ids.find((p) => p !== user?.id);
        const nextUnread = {
          ...(conversation.unread || {}),
          [otherId]: (conversation.unread?.[otherId] || 0) + 1,
        };
        await base44.entities.Conversation.update(conversationId, {
          last_message: trimmed,
          last_message_at: new Date().toISOString(),
          unread: nextUnread,
        });
        setConversation((c) => (c ? { ...c, last_message: trimmed, last_message_at: new Date().toISOString(), unread: nextUnread } : c));
      } finally {
        setSending(false);
      }
    },
    [conversationId, conversation, user]
  );

  return { conversation, messages, loading, sending, send };
}