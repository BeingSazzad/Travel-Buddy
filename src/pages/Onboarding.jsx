import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { HERO } from "@/lib/images";
import { markOnboardingDone } from "@/lib/launch-flow";

const slides = [
  {
    image: HERO.onboardMeet,
    title: "Meet women travelling the same way",
    description: "Find companions heading to your city. Match, chat and plan before you even land.",
  },
  {
    image: HERO.onboardEvents,
    title: "Join events that feel like real life",
    description: "Yoga mornings, wine nights, travel mixers — meetups that turn strangers into friends.",
  },
  {
    image: HERO.onboardPlaces,
    title: "Places women actually trust",
    description: "Cafés, stays and hidden gems recommended by members like you — not anonymous reviews.",
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const isLast = i === slides.length - 1;
  const slide = slides[i];

  const finish = (to = "/welcome") => {
    markOnboardingDone();
    navigate(to, { replace: true });
  };

  const next = () => (isLast ? finish("/register") : setI((n) => n + 1));
  const skip = () => finish("/welcome");

  return (
    <div className="relative min-h-screen min-h-dvh flex flex-col font-body overflow-hidden bg-[hsl(var(--brand-espresso))]">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="gradient-overlay-onboarding" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex-1 flex flex-col justify-end onboard-inset">
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${i}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="text-left mb-8"
          >
            <h2 className="font-display font-bold text-[1.7rem] text-white leading-[1.2] tracking-tight max-w-[18ch] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
              {slide.title}
            </h2>
            <p className="text-[15px] text-white/90 mt-3 leading-relaxed max-w-[34ch] drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2 mb-7" aria-label="Onboarding progress">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className={cn(
                "rounded-full transition-all duration-300 tap-feedback",
                idx === i ? "w-2 h-2 bg-brand-gold" : "w-2 h-2 bg-white/40"
              )}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === i ? "step" : undefined}
            />
          ))}
        </div>

        <div className="flex items-center justify-between min-h-12">
          {!isLast ? (
            <>
              <button
                type="button"
                onClick={skip}
                className="text-[15px] font-semibold text-white/80 hover:text-white tap-feedback px-1 py-2"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={next}
                className="text-[15px] font-semibold text-white hover:text-brand-gold tap-feedback px-1 py-2"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <span aria-hidden="true" />
              <button
                type="button"
                onClick={() => finish("/register")}
                className="h-11 px-7 rounded-full gradient-brand-button text-[15px] font-bold tap-feedback"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
