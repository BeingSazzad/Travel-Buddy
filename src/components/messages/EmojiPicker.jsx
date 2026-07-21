import React from "react";

const EMOJIS = [
  "😀","😁","😂","🥹","😊","😍","🤩","😘","🤗","🤔","😎","🥳","😇","🙂","😉","😜",
  "😴","😭","😡","👍","👎","🙏","👏","💪","✨","🔥","💖","💕","❤️","🎉","🙌","🤝",
  "✈️","🌍","🏖️","☕","🍷","📸","🏨","📍","🌅","🥂","🎒","🌸"
];

export default function EmojiPicker({ onPick }) {
  return (
    <div className="grid grid-cols-8 gap-1 p-2 bg-card border border-border rounded-2xl shadow-soft max-h-40 overflow-y-auto no-scrollbar">
      {EMOJIS.map((e) => (
        <button
          key={e}
          type="button"
          onClick={() => onPick(e)}
          className="text-xl w-8 h-8 rounded-lg hover:bg-muted/60 flex items-center justify-center"
        >
          {e}
        </button>
      ))}
    </div>
  );
}