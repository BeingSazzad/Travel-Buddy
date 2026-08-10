export default function OnboardingSlide({ image, title, description }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-full rounded-3xl overflow-hidden shadow-premium h-72">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <h2 className="font-display font-bold text-lg text-foreground mt-7 px-4 leading-snug">{title}</h2>
      <p className="text-sm text-muted-foreground mt-3 px-6 leading-relaxed">{description}</p>
    </div>
  );
}