import React from "react";
import { Image } from "@/components/ui/image";

export default function ConversationRow({ name, avatar, lastMessage, time, unread, online, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 border-b border-border/60 text-left active:bg-muted/30 transition"
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border border-border">
          <Image src={avatar} alt={name} fittingType="fill" className="w-full h-full" />
        </div>
        {online && (
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`font-semibold text-sm truncate ${unread > 0 ? "text-foreground" : "text-foreground/90"}`}>
            {name}
          </p>
          {time && <span className="text-xs text-muted-foreground shrink-0">{time}</span>}
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className={`text-xs truncate ${unread > 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"}`}>
            {lastMessage || "Say hello 👋"}
          </p>
          {unread > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}