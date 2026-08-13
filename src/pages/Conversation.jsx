import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Plus, Smile, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useConversation } from "@/hooks/useConversation";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import MessageBubble from "@/components/messages/MessageBubble";
import EmojiPicker from "@/components/messages/EmojiPicker";
import ShareSheet from "@/components/messages/ShareSheet";
import ConversationMenu from "@/components/messages/ConversationMenu";

export default function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversation, messages, loading, sending, send, deleteMessage, setTyping } = useConversation(id);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [, setNow] = useState(Date.now());
  const fileRef = useRef(null);
  const scrollRef = useRef(null);
  const typingTimer = useRef(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center text-sm text-muted-foreground">Loading conversation…</div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Conversation not found</p>
        <button onClick={() => navigate("/messages")} className="text-sm text-primary underline">
          Back to messages
        </button>
      </div>
    );
  }

  const myId = user?.id;
  const otherIndex = conversation.participant_ids.findIndex((p) => p !== myId && p !== "me");
  const resolvedIndex = otherIndex !== -1 ? otherIndex : 1;
  const otherId = conversation.participant_ids[resolvedIndex];
  const otherName = conversation.participant_names?.[resolvedIndex] || "Travel friend";
  const otherAvatar = conversation.participant_avatars?.[resolvedIndex] || "";
  const otherTyping = conversation.typing?.[otherId] && Date.now() - conversation.typing[otherId] < 3000;

  const onType = (val) => {
    setText(val);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      setTyping(true);
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      isTypingRef.current = false;
      setTyping(false);
    }, 2500);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const value = text;
    setText("");
    setShowEmoji(false);
    isTypingRef.current = false;
    clearTimeout(typingTimer.current);
    setTyping(false);
    await send({ type: "text", text: value });
  };

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      await send({ type: "image", image_url: res.file_url });
    } catch {
      /* ignore */
    }
  };

  const onShare = async (payload) => {
    setShareOpen(false);
    await send(payload);
  };

  const onDeleteMsg = async (msg) => {
    if (!window.confirm("Delete this message?")) return;
    await deleteMessage(msg.id);
    setSelectedId(null);
  };

  let lastMineIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender_id === user?.id) { lastMineIdx = i; break; }
  }

  return (
    <div className="h-dvh flex flex-col">
      <header className="app-px safe-pt pb-3 flex items-center gap-3 border-b border-border bg-card">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full hover:bg-muted/50 tap-feedback"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div
          onClick={() => otherId && navigate(`/members/${otherId}`)}
          className="flex-1 flex items-center gap-2 cursor-pointer min-w-0 hover:opacity-90 active:scale-[0.99] transition"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
            <Image src={otherAvatar} alt={otherName} fittingType="fill" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-semibold leading-tight truncate">{otherName}</p>
            <p className="text-xs text-muted-foreground">{otherTyping ? "typing…" : "Tap to view profile"}</p>
          </div>
        </div>
        <ConversationMenu
          otherId={otherId}
          otherName={otherName}
          conversationId={conversation.id}
          onDone={() => navigate("/messages")}
        />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-muted-foreground">
            <div>
              <p className="font-display font-semibold text-base">Say hello 👋</p>
              <p className="mt-1">Start the conversation and plan your trip together.</p>
            </div>
          </div>
        ) : (
          messages.map((m, i) => {
            const mine = m.sender_id === user?.id;
            const next = messages[i + 1];
            const showTime = !next || next.sender_id !== m.sender_id || new Date(next.created_date) - new Date(m.created_date) > 5 * 60 * 1000;
            const showSeen = mine && i === lastMineIdx && m.read === true;
            return (
              <div
                key={m.id}
                onClick={mine ? () => setSelectedId((s) => (s === m.id ? null : m.id)) : undefined}
                className={mine ? "cursor-pointer" : ""}
              >
                <MessageBubble
                  message={m}
                  mine={mine}
                  showTime={showTime}
                  showSeen={showSeen}
                  selected={mine && selectedId === m.id}
                  onDelete={onDeleteMsg}
                />
              </div>
            );
          })
        )}
      </div>

      {showEmoji && (
        <div className="px-3 pb-1">
          <EmojiPicker onPick={(e) => setText((t) => t + e)} />
        </div>
      )}

      <form onSubmit={onSubmit} className="px-3 pt-3 safe-pb border-t border-border bg-card flex items-center gap-1.5">
        <button type="button" onClick={() => setShareOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground">
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={() => setShowEmoji((s) => !s)}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${showEmoji ? "text-primary" : "text-muted-foreground"}`}
        >
          <Smile className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickImage} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground">
          <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <input
          value={text}
          onChange={(e) => onType(e.target.value)}
          placeholder="Message…"
          className="flex-1 rounded-full bg-background border border-border px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full fab-primary disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </form>

      <ShareSheet open={shareOpen} onOpenChange={setShareOpen} onShare={onShare} />
    </div>
  );
}