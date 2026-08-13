import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Plane, X, Info, BadgeCheck } from "lucide-react";
import { ConnectIconButton } from "@/components/common/ConnectIconButton";
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
    <div className="w-full flex-1 min-h-0 flex flex-col overflow-hidden min-w-0 max-w-full gap-3">
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
        className="relative flex-1 min-h-0 w-full rounded-[28px] overflow-hidden border border-border/80 shadow-premium bg-card cursor-grab active:cursor-grabbing select-none"
      >
        <Image
          src={member.avatar || member.main_photo}
          alt={member.name}
          fittingType="fill"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="gradient-overlay-card" />

        <motion.div
          style={{ opacity: passOpacity }}
          className="absolute top-5 left-5 z-20 border-2 border-rose-500 text-rose-500 bg-black/40 backdrop-blur-md font-display text-sm font-bold rounded-2xl px-3.5 py-1 -rotate-12 shadow-lg tracking-wider"
        >
          PASS
        </motion.div>
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute top-5 right-14 z-20 border-2 border-primary text-brand-gold bg-black/40 backdrop-blur-md font-display text-sm font-bold rounded-2xl px-3.5 py-1 rotate-12 shadow-lg tracking-wider"
        >
          CONNECT
        </motion.div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onProfile(member); }}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/35 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition"
          aria-label="More info"
        >
          <Info className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="absolute bottom-0 inset-x-0 z-20 px-5 pt-16 pb-5 text-white flex flex-col justify-end pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-2xl text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
                {member.name}{member.age != null ? `, ${member.age}` : ""}
              </h2>
              {member.verified && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <BadgeCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/15 text-white">
                <MapPin className="w-3 h-3 text-brand-gold" strokeWidth={2} />
                <span className="font-medium">{[member.current_city, member.country].filter(Boolean).join(", ")}</span>
              </div>

              {member.trip && (
                <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/80 backdrop-blur-md text-white font-medium shadow-sm">
                  <Plane className="w-3 h-3 text-white" strokeWidth={2} />
                  <span>{member.trip.city}{member.trip.country ? `, ${member.trip.country}` : ""}</span>
                </div>
              )}
            </div>

            {member.bio && (
              <p className="text-sm text-white leading-relaxed mt-2.5 line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.65)]">
                {member.bio}
              </p>
            )}

            {member.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {member.interests.slice(0, 3).map((i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white font-medium border border-white/25 capitalize"
                  >
                    {i}
                  </span>
                ))}
                {member.interests.length > 3 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/45 text-white font-medium border border-white/20">
                    +{member.interests.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="shrink-0 flex items-center justify-center gap-10 pb-1 pt-0.5">
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => trigger("left")}
            aria-label="Pass — swipe left"
            className="w-14 h-14 rounded-full bg-card border-2 border-rose-500/35 text-rose-500 shadow-lg flex items-center justify-center tap-feedback hover:bg-rose-500/10 transition-all"
          >
            <X className="w-6 h-6" strokeWidth={2.25} />
          </button>
          <span className="text-[10px] font-semibold text-muted-foreground">Pass</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <ConnectIconButton
            size="lg"
            onClick={() => trigger("right")}
            aria-label="Connect — swipe right"
            className="shadow-lg"
          />
          <span className="text-[10px] font-semibold text-muted-foreground">Connect</span>
        </div>
      </div>
    </div>
  );
}
