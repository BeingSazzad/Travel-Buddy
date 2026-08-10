import React from "react";
import { Moon, Plane, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

/* Floating ambient orbs for the hero */
function HeroOrb({ className }) {
  return (
    <div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ filter: "blur(40px)" }}
    />
  );
}

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children, compact = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body overflow-hidden">

      {/* ── HERO TOP ── */}
      <div className="relative flex-shrink-0 h-56 bg-gradient-to-br from-[#2C1A0E] via-[#4A2C1A] to-[#6B3D20] overflow-hidden">
        {/* Ambient light blobs */}
        <HeroOrb className="w-64 h-64 bg-[#A1846B]/30 -top-16 -left-16" />
        <HeroOrb className="w-48 h-48 bg-[#D4A574]/20 -bottom-8 -right-12" />
        <HeroOrb className="w-32 h-32 bg-[#F5C99A]/15 top-8 right-8" />

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating travel icons */}
        <div className="absolute top-6 right-8 opacity-20 rotate-12">
          <Plane className="w-10 h-10 text-white" strokeWidth={1} />
        </div>
        <div className="absolute bottom-10 left-6 opacity-10 -rotate-12">
          <Globe className="w-14 h-14 text-white" strokeWidth={0.75} />
        </div>
        <div className="absolute top-12 right-20 opacity-10">
          <Sparkles className="w-6 h-6 text-[#F5C99A]" strokeWidth={1} />
        </div>

        {/* Back button slot — only shown on non-welcome pages */}
        <Link
          to="/welcome"
          className="absolute top-12 left-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center active:scale-95 transition"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        {/* Brand mark */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 shadow-lg">
            <Moon className="w-7 h-7 text-[#F5C99A]" strokeWidth={1.5} />
          </div>
          <span className="font-display font-bold text-2xl tracking-[0.12em] text-white">SELUNA</span>
          <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase mt-1">Women · Travel · Community</span>
        </div>

        {/* Bottom soft fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ── FORM CARD ── */}
      <div className="flex-1 flex flex-col px-5 -mt-2 pb-8 overflow-y-auto">
        <div className="bg-card rounded-[28px] border border-border/60 shadow-xl p-6 mb-6">

          {/* Screen heading */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A1846B] to-[#7D6050] flex items-center justify-center shadow-sm shrink-0">
              <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-foreground leading-tight">{title}</h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-5" />

          {children}
        </div>

        {/* Footer link */}
        {footer && (
          <p className="text-center text-xs text-muted-foreground leading-relaxed">{footer}</p>
        )}
      </div>
    </div>
  );
}