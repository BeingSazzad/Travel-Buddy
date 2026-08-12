import { Moon } from "lucide-react";

export default function SplashScreen() {
  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col items-center justify-center gradient-app-bg"
      aria-label="Seluna"
    >
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 40%, hsl(var(--brand-sand) / 0.35), transparent 55%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl gradient-brand-accent flex items-center justify-center mb-5 shadow-soft">
          <Moon className="w-8 h-8 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="font-display font-bold text-3xl tracking-[0.16em] text-foreground">
          SELUNA
        </h1>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mt-3">
          Women · Travel · Community
        </p>
      </div>
    </div>
  );
}
