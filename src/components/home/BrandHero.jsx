import { Moon } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function BrandHero() {
  return (
    <div className="w-full flex flex-col items-center bg-background pt-14 pb-8">
      <div className="flex flex-col items-center">
        <Moon className="w-5 h-5 text-primary mb-1" strokeWidth={1.5} />
        <h1 className="font-display font-semibold text-4xl tracking-[0.08em] text-primary">
          SELUNA
        </h1>
      </div>

      <div className="relative w-36 h-36 rounded-full overflow-hidden shadow-premium ring-1 ring-primary/20 mt-5">
        <Image
          src="https://media.base44.com/images/public/6a5f78595b9383901d7402b6/25ed0c0d0_IMG_0471.jpg"
          alt="Seluna"
          fittingType="fill"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 26%' }}
        />
      </div>

      <h2 className="font-display font-semibold text-lg text-foreground mt-5">
        Welcome to Seluna
      </h2>

      <div className="flex items-center gap-3 mt-2 w-56">
        <span className="h-px flex-1 bg-primary/30" />
        <Moon className="w-3 h-3 text-primary" strokeWidth={1.5} />
        <span className="h-px flex-1 bg-primary/30" />
      </div>

      <p className="font-body text-xs tracking-[0.25em] uppercase text-primary mt-3">
        Travel. Connect. Empower.
      </p>
    </div>
  );
}