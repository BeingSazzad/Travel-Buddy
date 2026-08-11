import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin, Plane, X, User, Compass } from "lucide-react";
import { ConnectIconButton } from "@/components/common/ConnectIconButton";
import { Image } from "@/components/ui/image";

function ChipRow({ label, items, tone }) {
  if (!items?.length) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={`text-xs px-2 py-0.5 rounded-full capitalize ${tone === "accent" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function MatchCard({ member, onDecide, onProfile }) {
  const x = useMotionValue(0);
  const [fly, setFly] = useState(null);

  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const connectOpacity = useTransform(x, [40, 140], [0, 1]);
  const skipOpacity = useTransform(x, [-140, -40], [1, 0]);

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
        dragElastic={0.7}
        style={{ x, rotate }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ x: targetX, opacity: fly ? 0 : 1, scale: fly ? 0.94 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onDragEnd={onDragEnd}
        onAnimationComplete={() => { if (fly) onDecide(fly); }}
        className="rounded-3xl overflow-hidden shadow-premium bg-card h-[560px] flex flex-col cursor-grab active:cursor-grabbing select-none"
      >
        <div className="relative h-60 shrink-0">
          <Image src={member.avatar} alt={member.name} fittingType="fill" className="w-full h-full" />
          <div className="gradient-overlay-card" />
          <motion.div
            style={{ opacity: skipOpacity }}
            className="absolute top-4 left-4 z-20 border-4 border-brand-rose text-brand-rose font-display text-2xl font-bold rounded-xl px-3 py-1 -rotate-12"
          >
            SKIP
          </motion.div>
          <motion.div
            style={{ opacity: connectOpacity }}
            className="absolute top-4 right-4 z-20 border-4 border-primary text-primary font-display text-2xl font-bold rounded-xl px-3 py-1 rotate-12"
          >
            CONNECT
          </motion.div>
          <div className="absolute bottom-3 left-4 right-4 z-20 text-white">
            <h2 className="font-display font-bold text-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
              {member.name}{member.age != null ? `, ${member.age}` : ""}
            </h2>
            <div className="flex items-center gap-1 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="[text-shadow:0_1px_6px_rgba(0,0,0,0.55)]">{[member.current_city, member.country].filter(Boolean).join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {member.bio && <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>}

          <ChipRow label="Languages" items={member.languages} />
          <ChipRow label="Interests" items={member.interests} tone="accent" />
          <ChipRow label="Travel style" items={member.travel_style} />

          {member.trip && (
            <div className="rounded-2xl bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Plane className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">Upcoming trip</span>
              </div>
              <p className="text-sm font-display font-semibold">
                {member.trip.city}{member.trip.country ? `, ${member.trip.country}` : ""}
              </p>
              <p className="text-xs text-muted-foreground">{member.trip.dates}</p>
              {member.trip.looking_for?.length > 0 && (
                <ChipRow label="Looking for" items={member.trip.looking_for} tone="accent" />
              )}
            </div>
          )}

          {!member.trip && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Compass className="w-4 h-4" strokeWidth={1.5} /> No upcoming trip shared yet
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-5 mt-6">
        <button
          onClick={() => trigger("left")}
          aria-label="Skip"
          className="w-16 h-16 rounded-full bg-card border-2 border-border shadow-soft flex items-center justify-center text-muted-foreground hover:scale-105 transition active:scale-95"
        >
          <X className="w-7 h-7" strokeWidth={2} />
        </button>
        <button
          onClick={() => onProfile(member)}
          aria-label="View profile"
          className="w-14 h-14 rounded-full bg-card border-2 border-primary text-primary shadow-soft flex items-center justify-center hover:scale-105 transition active:scale-95"
        >
          <User className="w-5 h-5" strokeWidth={2} />
        </button>
        <ConnectIconButton
          size="xl"
          onClick={() => trigger("right")}
          aria-label="Connect"
          className="hover:scale-105 shadow-soft"
        />
      </div>
    </div>
  );
}