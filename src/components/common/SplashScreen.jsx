import React, { useEffect, useState } from "react";
import { Moon } from "lucide-react";

export default function SplashScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Trigger fade-out effect slightly before unmounting
    const timer = setTimeout(() => {
      setFade(true);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-out ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center animate-pulse">
        <Moon className="w-12 h-12 text-primary mb-3" strokeWidth={1.5} />
        <h1 className="font-display font-semibold text-3xl tracking-[0.15em] text-primary">
          SELUNA
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mt-3">
          Travel · Connect · Belong
        </p>
      </div>
    </div>
  );
}
