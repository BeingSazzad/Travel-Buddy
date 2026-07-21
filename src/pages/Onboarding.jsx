import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import OnboardingSlide from '@/components/onboarding/OnboardingSlide';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    title: 'Meet women travelling to the same destination',
    description: 'Find women heading to the same city or trip. Match, chat and plan your journey together before you even land.',
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
    title: 'Join events and make real connections',
    description: 'From sunset yoga to wine nights and travel mixers — join meetups that turn strangers into friends.',
  },
  {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',
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
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-end px-5 pt-12">
        <button onClick={skip} className="text-sm font-medium text-muted-foreground">Skip</button>
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
              idx === i ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/20'
            )}
          />
        ))}
      </div>

      <div className="px-7 pb-10 flex gap-3">
        {i > 0 && (
          <button
            onClick={back}
            className="px-5 py-3.5 rounded-full border border-border text-sm font-medium text-foreground active:scale-[0.98] transition-transform"
          >
            Back
          </button>
        )}
        <button
          onClick={next}
          className="flex-1 py-3.5 rounded-full bg-foreground text-background text-sm font-medium shadow-soft flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {isLast ? 'Get started' : 'Continue'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}