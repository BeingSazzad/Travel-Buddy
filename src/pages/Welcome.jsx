import React from "react";
import { useNavigate } from "react-router-dom";
import { Moon, ShieldCheck } from "lucide-react";
import { HERO } from "@/lib/images";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col font-body overflow-hidden gradient-app-bg">
      <div className="relative flex-1 min-h-[48vh]">
        <img
          src={HERO.welcome}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-overlay-hero" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16 pb-8">
          <Moon className="w-10 h-10 text-brand-gold mb-3 drop-shadow-lg" strokeWidth={1.5} />
          <h1 className="font-display font-bold text-3xl tracking-[0.14em] text-white">
            SELUNA
          </h1>
          <p className="text-[10px] text-white/60 tracking-[0.2em] uppercase mt-2">
            Women · Travel · Community
          </p>
        </div>
      </div>

      <div className="relative z-20 auth-form-panel rounded-t-[28px] -mt-6 px-6 pt-8 pb-10 shadow-[0_-8px_40px_rgba(0,0,0,0.08)] border-t border-border/40">
        <h2 className="font-display font-bold text-xl text-foreground leading-tight text-center">
          Travel. Connect. Belong.
        </h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto text-center leading-relaxed">
          The safest travel community for women. Connect with travel friends, join meetups, and discover places members love.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-[hsl(var(--brand-sand))]" strokeWidth={1.75} />
          <span>Women-only · 18+ · Verified community</span>
        </div>

        <div className="w-full mt-8 flex flex-col gap-3 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full py-3.5 rounded-2xl gradient-brand-button text-white font-semibold text-sm tap-feedback"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3.5 rounded-2xl border border-border bg-card text-foreground font-semibold text-sm tap-feedback hover:bg-muted/40 transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
