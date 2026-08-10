import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Plane, X, UserPlus, User, BadgeCheck, Sparkles, Heart } from "lucide-react";
import { Image } from "@/components/ui/image";

export default function SwipeCard({ member, onSwipe, onProfile }) {
  const x = useMotionValue(0);
  const [fly, setFly] = useState(null);

  const rotate = useTransform(x, [-220, 220], [-12, 12]);
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
        className="rounded-[28px] overflow-hidden border border-border/80 shadow-premium bg-card h-[560px] flex flex-col cursor-grab active:cursor-grabbing select-none relative"
      >
        {/* Photo Container */}
        <div className="relative h-[290px] shrink-0">
          <Image src={member.avatar} alt={member.name} fittingType="fill" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-black/25 to-transparent" />

          {/* Swipe Badges */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-5 left-5 border-2 border-rose-500 text-rose-500 bg-black/40 backdrop-blur-md font-display text-base font-bold rounded-2xl px-4 py-1.5 -rotate-12 shadow-lg tracking-wider"
          >
            SKIP
          </motion.div>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-5 right-5 border-2 border-[#A1846B] text-[#F5C99A] bg-black/40 backdrop-blur-md font-display text-base font-bold rounded-2xl px-4 py-1.5 rotate-12 shadow-lg tracking-wider"
          >
            CONNECT
          </motion.div>

          {/* Floating Photo Header overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl drop-shadow-md flex items-center gap-1.5 text-white">
                {member.name}{member.age != null ? `, ${member.age}` : ""}
              </h2>
              {member.verified && (
                <div className="w-5 h-5 rounded-full bg-[#A1846B] flex items-center justify-center shadow-md">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                <MapPin className="w-3 h-3 text-[#F5C99A]" strokeWidth={1.75} />
                <span className="font-medium">{[member.current_city, member.country].filter(Boolean).join(", ")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body Info */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {member.bio && (
            <p className="text-xs text-foreground/90 leading-relaxed line-clamp-3 italic">
              "{member.bio}"
            </p>
          )}

          {/* Languages */}
          {member.languages?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Languages</p>
              <div className="flex flex-wrap gap-1.5">
                {member.languages.map((l) => (
                  <span key={l} className="text-xs px-2.5 py-1 rounded-full bg-muted/80 text-foreground font-medium border border-border/50">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {member.interests?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {member.interests.map((i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#A1846B]/12 text-[#A1846B] font-medium border border-[#A1846B]/20 capitalize">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Travel style */}
          {member.travel_style?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Travel Style</p>
              <div className="flex flex-wrap gap-1.5">
                {member.travel_style.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[#A1846B]/12 text-[#A1846B] font-medium border border-[#A1846B]/20 capitalize">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Trip Box */}
          {member.trip && (
            <div className="rounded-2xl bg-gradient-to-br from-[#A1846B]/15 to-[#A1846B]/5 border border-[#A1846B]/25 p-3.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-[#A1846B] mb-1">
                <Plane className="w-4 h-4" strokeWidth={1.75} />
                <span className="text-xs font-semibold uppercase tracking-wider">Upcoming Trip</span>
              </div>
              <p className="text-sm font-display font-bold text-foreground">
                {member.trip.city}{member.trip.country ? `, ${member.trip.country}` : ""}
              </p>
              {member.trip.dates && (
                <p className="text-xs text-muted-foreground mt-0.5">{member.trip.dates}</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Swipe Action Control Buttons */}
      <div className="flex items-center justify-center gap-5 mt-5">
        <button
          onClick={() => trigger("left")}
          aria-label="Skip"
          className="w-14 h-14 rounded-full bg-card border border-rose-500/30 text-rose-500 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-rose-500/10 transition-all"
        >
          <X className="w-6 h-6" strokeWidth={2.25} />
        </button>

        <button
          onClick={() => onProfile(member)}
          aria-label="View profile"
          className="w-12 h-12 rounded-full bg-card border border-[#A1846B]/40 text-[#A1846B] shadow-md flex items-center justify-center hover:scale-105 active:scale-95 hover:bg-[#A1846B]/10 transition-all"
        >
          <User className="w-5 h-5" strokeWidth={2} />
        </button>

        <button
          onClick={() => trigger("right")}
          aria-label="Connect"
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A1846B] to-[#7a5c44] text-white shadow-lg shadow-[#A1846B]/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        >
          <UserPlus className="w-6 h-6" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}