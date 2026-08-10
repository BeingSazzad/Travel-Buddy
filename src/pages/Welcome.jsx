import React from "react";
import { useNavigate } from "react-router-dom";
import { Moon } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-black text-white font-body overflow-hidden">
      {/* Background Image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"
          alt="Travel Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
      </div>

      {/* Middle Brand Section */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pt-20">
        <div className="flex flex-col items-center">
          <Moon className="w-10 h-10 text-white mb-2 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-3xl tracking-[0.15em] text-white">
            SELUNA
          </h1>
        </div>
      </div>

      {/* Bottom Content & CTA Section */}
      <div className="relative z-20 px-6 pb-12 pt-6 flex flex-col items-center text-center">
        <h2 className="font-display font-bold text-lg tracking-wide leading-tight text-white/95">
          Travel. Connect. Belong.
        </h2>
        <p className="text-xs text-white/70 mt-2.5 max-w-[280px] leading-relaxed">
          The safest travel community for women. Connect with travel friends, meetups and local recommendations.
        </p>

        <div className="w-full mt-8 flex flex-col gap-3">
          <button
            onClick={() => navigate("/onboarding")}
            className="w-full py-4 rounded-full bg-[#B58E72] hover:bg-[#a37c61] text-white font-semibold text-sm shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            Create Account
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 rounded-full border border-white/25 hover:bg-white/10 text-white font-semibold text-sm active:scale-[0.98] transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}