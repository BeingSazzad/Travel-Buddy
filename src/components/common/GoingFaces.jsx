import React from "react";
import { FALLBACK_AVATAR_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

export default function GoingFaces({ count, avatars }) {
  const faces = (avatars || []).slice(0, 3);
  if (!count && !faces.length) return null;
  return (
    <div className="flex items-center gap-1 shrink-0">
      <div className="flex items-center">
        {faces.map((src, i) => (
          <img
            key={i}
            src={src || FALLBACK_AVATAR_URL}
            alt=""
            className={cn(
              "w-4 h-4 rounded-full object-cover border border-white/80",
              i > 0 && "-ml-1"
            )}
          />
        ))}
      </div>
      {count > 0 && (
        <span className="text-[10px] text-white/90 font-medium whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
          {count} going
        </span>
      )}
    </div>
  );
}
