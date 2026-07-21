import React from "react";

export default function MessageBubble({ mine, text }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
          mine
            ? "bg-foreground text-background rounded-br-md"
            : "bg-card border border-border rounded-bl-md"
        }`}
      >
        {text}
      </div>
    </div>
  );
}