import React from "react";
import { Trash2, MapPin, Plane, Coffee, UtensilsCrossed, Hotel, Calendar, Tag, MapPinned } from "lucide-react";
import { Image } from "@/components/ui/image";

const TYPE_META = {
  destination: { label: "Destination", icon: MapPin },
  trip: { label: "Trip", icon: Plane },
  cafe: { label: "Café", icon: Coffee },
  restaurant: { label: "Restaurant", icon: UtensilsCrossed },
  hotel: { label: "Hotel", icon: Hotel },
  event: { label: "Event", icon: Calendar },
  deal: { label: "Deal", icon: Tag },
  meeting: { label: "Meet up", icon: MapPinned },
};

function fmtTime(date) {
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function MessageBubble({ message, mine, showTime, showSeen, selected, onDelete }) {
  const type = message.type || "text";
  const meta = type === "content" ? TYPE_META[message.content_type] : null;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] flex flex-col ${mine ? "items-end" : "items-start"}`}>
        {type === "text" && (
          <div
            className={`px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
              mine ? "bg-foreground text-background rounded-br-md" : "bg-card border border-border rounded-bl-md"
            }`}
          >
            {message.text}
          </div>
        )}

        {type === "image" && (
          <div className="rounded-2xl overflow-hidden border border-border max-w-[260px]">
            <Image src={message.image_url} alt="Photo" fittingType="fill" className="w-full h-52" />
          </div>
        )}

        {type === "content" && meta && (
          <div className={`rounded-2xl overflow-hidden border bg-card max-w-[280px] ${mine ? "border-foreground/20" : "border-border"}`}>
            {message.content_data?.image && (
              <div className="h-28 w-full">
                <Image src={message.content_data.image} alt={message.content_data.title} fittingType="fill" className="w-full h-full" />
              </div>
            )}
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[#A1846B]">
                <meta.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-[11px] font-medium uppercase tracking-wide">{meta.label}</span>
              </div>
              <p className="font-display font-semibold text-sm mt-1">{message.content_data?.title}</p>
              {message.content_data?.location && <p className="text-xs text-muted-foreground">{message.content_data.location}</p>}
              {message.content_data?.dates && <p className="text-xs text-muted-foreground mt-0.5">{message.content_data.dates}</p>}
              {message.content_data?.subtitle && !message.content_data?.location && (
                <p className="text-xs text-muted-foreground">{message.content_data.subtitle}</p>
              )}
              {message.content_type === "meeting" && (
                <p className="text-[11px] text-muted-foreground mt-1 italic">Approximate area — no exact address shared</p>
              )}
            </div>
          </div>
        )}

        <div className={`flex items-center gap-1.5 mt-0.5 px-1 ${mine ? "flex-row-reverse" : ""}`}>
          {showTime && <span className="text-[10px] text-muted-foreground">{fmtTime(message.created_date)}</span>}
          {mine && showSeen && <span className="text-[10px] text-[#A1846B]">Seen</span>}
        </div>

        {mine && selected && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(message); }}
            className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.5} /> Delete
          </button>
        )}
      </div>
    </div>
  );
}