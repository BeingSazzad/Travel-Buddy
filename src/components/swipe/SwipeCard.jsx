import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Plane, X, UserPlus, Info, BadgeCheck } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function SwipeCard({ member, onSwipe, onProfile }) {
  const x = useMotionValue(0);
  const [fly, setFly] = useState(null);

  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const likeOpacity = useTransform(x, [40, 140], [0, 1]);
  const passOpacity = useTransform(x, [-140, -40], [1, 0]);

  const trigger = (dir) => setFly(dir);

  const onDragEnd = (_, info) => {
    const dx = info.offset.x;
    const v = info.velocity.x;
    if (dx > 120 || v > 600) setFly("right");
    else if (dx < -120 || v < -600) setFly("left");
  };

  const targetX = fly === "right" ? 600 : fly === "left" ? -600 : 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        drag={!fly}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.65}
        style={{ x, rotate }}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ x: targetX, opacity: fly ? 0 : 1, scale: fly ? 0.94 : 1, y: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        onDragEnd={onDragEnd}
        onAnimationComplete={() => { if (fly) onSwipe(fly); }}
        className="rounded-[28px] overflow-hidden border border-border/80 shadow-premium bg-card h-[490px] flex flex-col cursor-grab active:cursor-grabbing select-none relative group"
      >
        {/* Photo Container - Hero Element */}
        <div className="relative flex-1 w-full overflow-hidden">
          <Image
            src={member.avatar || member.main_photo}
            alt={member.name}
            fittingType="fill"
            className="w-full h-full object-cover"
          />
          <div className="gradient-overlay-card" />

          {/* Swipe Action Overlay Stamps */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-5 left-5 z-20 border-2 border-rose-500 text-rose-500 bg-black/40 backdrop-blur-md font-display text-sm font-bold rounded-2xl px-3.5 py-1 -rotate-12 shadow-lg tracking-wider"
          >
            SKIP
          </motion.div>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-5 right-5 z-20 border-2 border-[#A1846B] text-[#F5C99A] bg-black/40 backdrop-blur-md font-display text-sm font-bold rounded-2xl px-3.5 py-1 rotate-12 shadow-lg tracking-wider"
          >
            CONNECT
          </motion.div>

          {/* Tap for info floating button */}
          <button
            onClick={(e) => { e.stopPropagation(); onProfile(member); }}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 hover:bg-black/60 transition active:scale-90"
            aria-label="Full Profile Details"
          >
            <Info className="w-4 h-4" strokeWidth={2} />
          </button>

          {/* Hero Bottom Photo Overlay Content */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-5 text-white flex flex-col justify-end">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-2xl text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                  {member.name}{member.age != null ? `, ${member.age}` : ""}
                </h2>
                {member.verified && (
                  <div className="w-5 h-5 rounded-full bg-[#A1846B] flex items-center justify-center shadow-md">
                    <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>
            </div>

            {/* Location & Upcoming Trip Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white">
                <MapPin className="w-3 h-3 text-[#F5C99A]" strokeWidth={2} />
                <span className="font-medium">{[member.current_city, member.country].filter(Boolean).join(", ")}</span>
              </div>

              {member.trip && (
                <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#A1846B]/80 backdrop-blur-md text-white font-medium shadow-sm">
                  <Plane className="w-3 h-3 text-white" strokeWidth={2} />
                  <span>{member.trip.city}{member.trip.country ? `, ${member.trip.country}` : ""}</span>
                </div>
              )}
            </div>

            {/* Compact 2-line Bio */}
            {member.bio && (
              <p className="text-sm text-white leading-relaxed mt-2.5 line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)]">
                {member.bio}
              </p>
            )}

            {/* Interest Chips */}
            {member.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {member.interests.slice(0, 4).map((i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white font-medium border border-white/25 capitalize"
                  >
                    {i}
                  </span>
                ))}
                {member.interests.length > 4 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/45 text-white font-medium border border-white/20">
                    +{member.interests.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Swipe Action Buttons */}
      <div className="flex items-center justify-center gap-5 mt-5">
        <button
          onClick={() => trigger("left")}
          aria-label="Skip"
          className="w-14 h-14 rounded-full bg-card border border-rose-500/30 text-rose-500 shadow-md flex items-center justify-center hover:scale-105 tap-feedback hover:bg-rose-500/10 transition-all"
        >
          <X className="w-6 h-6" strokeWidth={2.25} />
        </button>

        <button
          onClick={() => onProfile(member)}
          aria-label="View profile details"
          className="w-12 h-12 rounded-full bg-card border border-[#A1846B]/40 text-[#A1846B] shadow-md flex items-center justify-center hover:scale-105 tap-feedback hover:bg-[#A1846B]/10 transition-all"
        >
          <Info className="w-5 h-5" strokeWidth={2} />
        </button>

        <button
          onClick={() => trigger("right")}
          aria-label="Connect"
          className="w-14 h-14 rounded-full gradient-brand-accent text-white shadow-lg shadow-[#A1846B]/25 flex items-center justify-center hover:scale-105 tap-feedback transition-all"
        >
          <UserPlus className="w-6 h-6" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}