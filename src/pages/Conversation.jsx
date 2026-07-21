import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useConversation } from "@/hooks/useConversation";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import MessageBubble from "@/components/messages/MessageBubble";

export default function Conversation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversation, messages, loading, sending, send } = useConversation(id);
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading conversation…
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-display font-semibold">Conversation not found</p>
        <button onClick={() => navigate("/friends")} className="text-sm text-[#A1846B] underline">
          Back to friends
        </button>
      </div>
    );
  }

  const otherIndex = conversation.participant_ids.findIndex((p) => p !== user?.id);
  const otherName = conversation.participant_names?.[otherIndex] || "Travel friend";
  const otherAvatar = conversation.participant_avatars?.[otherIndex] || "";

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    const value = text;
    setText("");
    await send(value);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="px-4 pt-10 pb-3 flex items-center gap-3 border-b border-border bg-card">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
          <Image src={otherAvatar} alt={otherName} fittingType="fill" className="w-full h-full" />
        </div>
        <div>
          <p className="font-display font-semibold leading-tight">{otherName}</p>
          <p className="text-xs text-muted-foreground">Travel friend</p>
        </div>
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
          messages.map((m) => (
            <MessageBubble key={m.id} mine={m.sender_id === user?.id} text={m.text} />
          ))
        )}
      </div>

      <form onSubmit={onSubmit} className="px-4 py-3 border-t border-border bg-card flex items-center gap-2 pb-6">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
          className="rounded-full bg-background"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
}