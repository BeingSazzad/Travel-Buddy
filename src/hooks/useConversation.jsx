import { useCallback, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const getMockConversation = (convId, userId) => {
  const uid = userId || "me";
  const dataset = {
    sim_conv_mock_1: {
      id: "sim_conv_mock_1",
      participant_ids: [uid, "mock_1"],
      participant_names: ["You", "Maya R."],
      participant_avatars: ["", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"],
      last_message: "Hey! Are you still planning for Bali?",
      last_message_at: new Date(Date.now() - 3600000).toISOString(),
      unread: { [uid]: 2 },
      typing: {},
    },
    sim_conv_mock_2: {
      id: "sim_conv_mock_2",
      participant_ids: [uid, "mock_2"],
      participant_names: ["You", "Ava L."],
      participant_avatars: ["", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"],
      last_message: "Sure! Let's discuss the itinerary.",
      last_message_at: new Date(Date.now() - 86400000).toISOString(),
      unread: { [uid]: 0 },
      typing: {},
    },
    sim_conv_mock_3: {
      id: "sim_conv_mock_3",
      participant_ids: [uid, "mock_4"],
      participant_names: ["You", "Isabella K."],
      participant_avatars: ["", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"],
      last_message: "That sounds great!",
      last_message_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      unread: { [uid]: 0 },
      typing: {},
    },
    sim_conv_mock_4: {
      id: "sim_conv_mock_4",
      participant_ids: [uid, "mock_5"],
      participant_names: ["You", "Emma T."],
      participant_avatars: ["", "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&h=100&q=80"],
      last_message: "Let me know the details.",
      last_message_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      unread: { [uid]: 0 },
      typing: {},
    },
    // Sophie (mock_3) — for direct match from discover swipe
    sim_conv_mock_3_sophie: {
      id: "sim_conv_mock_3_sophie",
      participant_ids: [uid, "mock_3"],
      participant_names: ["You", "Sophie M."],
      participant_avatars: ["", "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80"],
      last_message: "Let's do a beachside sunset dinner! 🌅",
      last_message_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      unread: { [uid]: 1 },
      typing: {},
    },
  };
  // Return known entry, or generate a generic fallback for any sim_conv_ ID
  return dataset[convId] || {
    id: convId,
    participant_ids: [uid, "mock_1"],
    participant_names: ["You", "Travel Friend"],
    participant_avatars: ["", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80"],
    last_message: "Hi! Looking forward to traveling together ✈️",
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    unread: { [uid]: 1 },
    typing: {},
  };
};

const getMockMessages = (convId, userId) => {
  const uid = userId || "me";
  const dataset = {
    sim_conv_mock_1: [
      { id: "m1_1", conversation_id: "sim_conv_mock_1", sender_id: "mock_1", type: "text", text: "Hi! I saw you are planning a trip to Bali soon?", created_date: new Date(Date.now() - 7200000).toISOString() },
      { id: "m1_2", conversation_id: "sim_conv_mock_1", sender_id: uid, type: "text", text: "Yes, I will be in Ubud from Aug 15!", created_date: new Date(Date.now() - 5400000).toISOString() },
      { id: "m1_3", conversation_id: "sim_conv_mock_1", sender_id: "mock_1", type: "text", text: "Hey! Are you still planning for Bali?", created_date: new Date(Date.now() - 3600000).toISOString() }
    ],
    sim_conv_mock_2: [
      { id: "m2_1", conversation_id: "sim_conv_mock_2", sender_id: uid, type: "text", text: "Hey Ava, I am visiting Lisbon next month!", created_date: new Date(Date.now() - 172800000).toISOString() },
      { id: "m2_2", conversation_id: "sim_conv_mock_2", sender_id: "mock_2", type: "text", text: "Oh great! Lisbon is beautiful. Let me know if you want to explore the old town.", created_date: new Date(Date.now() - 129600000).toISOString() },
      { id: "m2_3", conversation_id: "sim_conv_mock_2", sender_id: "mock_2", type: "text", text: "Sure! Let's discuss the itinerary.", created_date: new Date(Date.now() - 86400000).toISOString() }
    ],
    sim_conv_mock_3: [
      { id: "m3_1", conversation_id: "sim_conv_mock_3", sender_id: uid, type: "text", text: "Hi Isabella, I see you are traveling to Paris soon too?", created_date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: "m3_2", conversation_id: "sim_conv_mock_3", sender_id: "mock_4", type: "text", text: "Yes! Planning to visit some jazz clubs and museums.", created_date: new Date(Date.now() - 86400000 * 4).toISOString() },
      { id: "m3_3", conversation_id: "sim_conv_mock_3", sender_id: "mock_4", type: "text", text: "That sounds great!", created_date: new Date(Date.now() - 86400000 * 4).toISOString() }
    ],
    sim_conv_mock_4: [
      { id: "m4_1", conversation_id: "sim_conv_mock_4", sender_id: uid, type: "text", text: "Hey Emma, are you going to Bali for surfing?", created_date: new Date(Date.now() - 86400000 * 6).toISOString() },
      { id: "m4_2", conversation_id: "sim_conv_mock_4", sender_id: "mock_5", type: "text", text: "Yes, the waves are amazing right now!", created_date: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: "m4_3", conversation_id: "sim_conv_mock_4", sender_id: "mock_5", type: "text", text: "Let me know the details.", created_date: new Date(Date.now() - 86400000 * 5).toISOString() }
    ],
    sim_conv_mock_3_sophie: [
      { id: "ms_1", conversation_id: "sim_conv_mock_3_sophie", sender_id: "mock_3", type: "text", text: "Hi! I saw we matched for Santorini!", created_date: new Date(Date.now() - 172800000).toISOString() },
      { id: "ms_2", conversation_id: "sim_conv_mock_3_sophie", sender_id: uid, type: "text", text: "Yes! Excited to be there same time as you.", created_date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: "ms_3", conversation_id: "sim_conv_mock_3_sophie", sender_id: "mock_3", type: "text", text: "Let's do a beachside sunset dinner! 🌅", created_date: new Date(Date.now() - 86400000 * 2).toISOString() },
    ],
  };
  // Return known messages, or a generic opening message for unknown sim_conv_ IDs
  return dataset[convId] || [
    { id: "gm_1", conversation_id: convId, sender_id: "mock_1", type: "text", text: "Hi! It's great to connect with you. What are your travel plans? ✈️", created_date: new Date(Date.now() - 3600000).toISOString() },
  ];
};


export function useConversation(conversationId) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const convRef = useRef(null);

  const isMock = String(conversationId || "").startsWith("sim_conv_");

  useEffect(() => { convRef.current = conversation; }, [conversation]);

  const load = useCallback(async () => {
    if (!conversationId) return;
    try {
      setLoading(true);
      if (isMock) {
        const mockConv = getMockConversation(conversationId, user?.id);
        const mockMsgs = getMockMessages(conversationId, user?.id);
        setConversation(mockConv);
        setMessages(mockMsgs);
      } else {
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
      }
    } catch (e) {
      const fallbackConv = getMockConversation(conversationId, user?.id);
      const fallbackMsgs = getMockMessages(conversationId, user?.id);
      setConversation(fallbackConv);
      setMessages(fallbackMsgs);
    } finally {
      setLoading(false);
    }
  }, [conversationId, user, isMock]);

  useEffect(() => { load(); }, [load]);

  // Realtime messages
  useEffect(() => {
    if (!conversationId || isMock) return;
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
  }, [conversationId, user, isMock]);

  // Realtime conversation
  useEffect(() => {
    if (!conversationId || isMock) return;
    const unsub = base44.entities.Conversation.subscribe((event) => {
      if (event.data?.id !== conversationId) return;
      setConversation(event.data);
    });
    return unsub;
  }, [conversationId, isMock]);

  const send = useCallback(
    async (payload) => {
      const conv = convRef.current;
      if (!conv) return;
      const type = payload.type || "text";
      const text = payload.text || "";

      if (isMock) {
        setSending(true);
        const myId = user?.id || "me";
        const otherId = conv.participant_ids.find((p) => p !== myId);

        const newMsg = {
          id: "msg_" + Date.now(),
          conversation_id: conversationId,
          participant_ids: conv.participant_ids,
          sender_id: myId,
          type,
          text,
          image_url: payload.image_url || "",
          content_type: payload.content_type || "",
          content_data: payload.content_data || null,
          read: true,
          created_date: new Date().toISOString()
        };

        setMessages((prev) => [...prev, newMsg]);
        setSending(false);

        // Simulate typing after 1.2 seconds
        setTimeout(() => {
          setConversation((c) => {
            if (!c) return null;
            const nextTyping = { ...(c.typing || {}), [otherId]: Date.now() };
            return { ...c, typing: nextTyping };
          });
        }, 1200);

        // Simulate reply after 3.8 seconds
        setTimeout(() => {
          const replyMsg = {
            id: "reply_" + Date.now(),
            conversation_id: conversationId,
            participant_ids: conv.participant_ids,
            sender_id: otherId,
            type: "text",
            text: "That sounds awesome! Let me check my dates and get back to you soon. ✈️🌴",
            read: true,
            created_date: new Date().toISOString()
          };
          setMessages((prev) => [...prev, replyMsg]);
          setConversation((c) => {
            if (!c) return null;
            const nextTyping = { ...(c.typing || {}), [otherId]: 0 };
            return {
              ...c,
              last_message: replyMsg.text,
              last_message_at: replyMsg.created_date,
              typing: nextTyping
            };
          });
        }, 3800);

        return;
      }

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
    [conversationId, user, isMock]
  );

  const deleteMessage = useCallback(async (messageId) => {
    if (!isMock) {
      await base44.entities.Message.delete(messageId).catch(() => {});
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  }, [isMock]);

  const setTyping = useCallback(
    async (typing) => {
      if (isMock) return;
      const conv = convRef.current;
      if (!conv) return;
      const next = { ...(conv.typing || {}), [user.id]: typing ? Date.now() : 0 };
      await base44.entities.Conversation.update(conversationId, { typing: next }).catch(() => {});
    },
    [conversationId, user, isMock]
  );

  return { conversation, messages, loading, sending, send, deleteMessage, setTyping };
}