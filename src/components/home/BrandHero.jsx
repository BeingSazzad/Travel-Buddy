import { Heart } from 'lucide-react';

export default function BrandHero() {
  return (
    <div className="w-full flex flex-col items-center bg-background pt-14 pb-8">
      <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-premium ring-1 ring-[#A1846B]/20">
        <img
          src="https://media.base44.com/images/public/6a5f78595b9383901d7402b6/25ed0c0d0_IMG_0471.jpg"
          alt="Seluna"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 26%' }}
        />
      </div>

      <h1 className="font-display font-semibold text-4xl tracking-wide text-[#A1846B] mt-6">
        Seluna
      </h1>

      <div className="flex items-center gap-3 mt-3 w-56">
        <span className="h-px flex-1 bg-[#A1846B]/30" />
        <Heart className="w-3 h-3 text-[#A1846B] fill-[#A1846B]" />
        <span className="h-px flex-1 bg-[#A1846B]/30" />
      </div>

      <p className="font-body text-[11px] tracking-[0.25em] uppercase text-[#A1846B] mt-3">
        Travel. Connect. Empower.
      </p>
    </div>
  );
}