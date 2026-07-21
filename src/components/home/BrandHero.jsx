import { Sparkles, Heart, Plane } from 'lucide-react';

export default function BrandHero() {
  return (
    <div className="relative flex flex-col items-center px-5 pt-16 pb-6 overflow-hidden bg-background">
      {/* Circular photo with flight path arc */}
      <div className="relative w-44 h-44">
        <svg
          className="absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)]"
          viewBox="0 0 200 200"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M28 158 Q 100 -6 172 158"
            stroke="hsl(var(--sand))"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1 right-1 transform rotate-[35deg]">
          <Plane className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        </div>
        <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-card shadow-premium">
          <img
            src="https://media.base44.com/images/public/6a5f78595b9383901d7402b6/d71371798_generated_image.png"
            alt="Rejsende veninder"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="flex items-start gap-1.5 mt-7">
        <h1 className="font-display font-semibold text-[2.6rem] leading-none text-foreground">Seluna</h1>
        <Sparkles className="w-4 h-4 text-accent mt-1.5" strokeWidth={1.5} />
      </div>

      {/* Divider with heart */}
      <div className="flex items-center gap-3 mt-3 w-full max-w-[230px]">
        <div className="h-px flex-1 bg-border" />
        <Heart className="w-3 h-3 text-accent" strokeWidth={1.5} />
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Tagline */}
      <p className="mt-2 text-[10.5px] font-medium tracking-[0.34em] text-muted-foreground uppercase">
        Travel · Connect · Empower
      </p>
    </div>
  );
}