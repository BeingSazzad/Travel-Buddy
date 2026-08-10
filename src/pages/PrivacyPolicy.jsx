import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us during registration, profile creation, and app usage (such as your name, date of birth, photos, bio, travel plans, event RSVPs, and messages). Identity verification data is securely processed via our partner Veriff.",
  },
  {
    title: "2. How We Use Your Information",
    body: "Your information is used solely to provide travel matching, community event discovery, safety verification, and personalized recommendations. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Location Data & Privacy",
    body: "We collect approximate location data (city level) to match you with nearby travellers and local meetups. Your exact street address or precise GPS coordinates are never displayed to other members.",
  },
  {
    title: "4. Profile Visibility & Controls",
    body: "You maintain full control over your profile visibility. You can customize whether your age, upcoming travel dates, and current city are visible to other members through your Privacy settings.",
  },
  {
    title: "5. Data Storage & Security",
    body: "We employ industry-standard encryption and security protocols to protect your personal data, chat history, and account credentials.",
  },
  {
    title: "6. Your Data Rights & Deletion",
    body: "You have the right to access, update, export, or permanently delete your personal information at any time directly within the app or by contacting support.",
  },
];

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 px-4 pt-10 pb-3 flex items-center gap-3 bg-background/90 backdrop-blur border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="font-display font-bold text-lg">Privacy Policy</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 pb-12">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-base">Seluna Privacy Policy</p>
          <p className="text-xs text-muted-foreground mt-1">Your privacy & safety are our highest priorities</p>
        </div>

        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
              <h2 className="font-semibold text-sm text-foreground mb-1.5">{s.title}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#A1846B]/5 border border-[#A1846B]/15 p-4 flex gap-3 mt-6">
          <ShieldCheck className="w-5 h-5 text-[#A1846B] shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Have questions about how your data is handled? Contact our Privacy Team through Help & Support in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
