import { Image } from '@/components/ui/image';

export default function BrandHero() {
  return (
    <div className="w-full bg-background pt-12">
      <Image
        src="https://media.base44.com/images/public/6a5f78595b9383901d7402b6/73f121e91_IMG_0471.png"
        alt="Seluna"
        fittingType="fit"
        className="w-full"
      />
    </div>
  );
}