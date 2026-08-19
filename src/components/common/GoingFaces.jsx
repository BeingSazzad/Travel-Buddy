import React from "react";
import { FALLBACK_AVATAR_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

export default function GoingFaces({ count, avatars, className, label }) {
  const faces = (avatars || []).slice(0, 3);
  if (!count && !faces.length) return null;
  const text = label !== undefined ? label : count > 0 ? `${count} going` : "";
  return (
    <div className={cn("flex items-center gap-1.5 shrink-0", className)}>
      <div className="flex items-center">
        {(faces.length ? faces : [FALLBACK_AVATAR_URL]).map((src, i) => (
          <img
            key={i}
            src={src || FALLBACK_AVATAR_URL}
            alt=""
            className={cn(
              "w-6 h-6 rounded-full object-cover object-top border-2 border-white/90 shadow-sm",
              i > 0 && "-ml-2"
            )}
          />
        ))}
      </div>
      {text ? (
        <span className="text-[11px] text-white font-semibold whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
          {text}
        </span>
      ) : null}
    </div>
  );
}
