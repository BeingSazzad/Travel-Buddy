import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HERO } from '@/lib/images';
import OnboardingSlide from '@/components/onboarding/OnboardingSlide';

const slides = [
  {
    image: HERO.onboardMeet,
    title: 'Meet women travelling to the same destination',
    description: 'Find women heading to the same city or trip. Match, chat and plan your journey together before you even land.',
  },
  {
    image: HERO.onboardEvents,
    title: 'Join events and make real connections',
    description: 'From sunset yoga to wine nights and travel mixers — join meetups that turn strangers into friends.',
  },
  {
    image: HERO.onboardPlaces,
    title: 'Discover trusted places recommended by women',
    description: 'Cafés, hotels and hidden gems vetted by women like you. Reviews you can trust, for places you’ll love.',
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const isLast = i === slides.length - 1;

  const next = () => (isLast ? navigate('/register') : setI(i + 1));
  const back = () => setI(i - 1);
  const skip = () => navigate('/register');

  return (
    <div className="flex flex-col min-h-screen bg-background gradient-top-bg">
      <div className="flex justify-end app-px safe-pt">
        <button onClick={skip} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Skip
        </button>
      </div>

      <div className="flex-1 px-5 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <OnboardingSlide {...slides[i]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 pb-5">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              idx === i ? 'w-6 bg-[hsl(var(--brand-sand))]' : 'w-1.5 bg-foreground/20'
            )}
          />
        ))}
      </div>

      <div className="px-5 pb-10 flex gap-3">
        {i > 0 && (
          <button
            onClick={back}
            className="h-12 px-6 rounded-2xl border border-border text-sm font-semibold text-foreground active:scale-[0.97] transition-transform flex items-center justify-center"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 h-12 rounded-2xl gradient-brand-accent text-white text-base font-bold shadow-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          {isLast ? 'Get started' : 'Continue'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}