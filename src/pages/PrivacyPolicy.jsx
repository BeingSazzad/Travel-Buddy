import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

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
    <ScrollPage>
      <ScrollPageHeader>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="page-title">Privacy Policy</h1>
      </ScrollPageHeader>

      <ScrollPageBody className="space-y-5">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-lg">Seluna Privacy Policy</p>
          <p className="text-sm text-muted-foreground mt-1">Your privacy & safety are our highest priorities</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft divide-y divide-border/70">
          {SECTIONS.map((s) => (
            <div key={s.title} className="py-4 first:pt-0 last:pb-0">
              <h2 className="row-title text-foreground mb-1.5">{s.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 flex gap-3 mt-6">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Have questions about how your data is handled? Contact our Privacy Team through Help & Support in your profile settings.
          </p>
        </div>
      </ScrollPageBody>
    </ScrollPage>
  );
}
