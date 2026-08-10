import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, ShieldCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Membership & Community Purpose",
    body: "Seluna is a verified, members-only travel and social community for women aged 18 and older. By accessing or using Seluna, you confirm that you are at least 18 years of age and agree to interact with other members respectfully, lawfully, and in good faith.",
  },
  {
    title: "2. Account Security & Accuracy",
    body: "You are responsible for maintaining the accuracy of your profile information and the confidentiality of your account credentials. Any activities that occur under your account are your sole responsibility.",
  },
  {
    title: "3. Membership & Subscriptions",
    body: "Seluna requires an active subscription to access social matching, trips, and community features. Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date. You may manage or cancel your subscription at any time in Subscription Management.",
  },
  {
    title: "4. User Conduct & Safety",
    body: "You agree to abide by our Community Guidelines. Harassment, hate speech, sexual solicitation, fraud, commercial spam, and non-consensual sharing of private information are strictly prohibited and will result in permanent account termination.",
  },
  {
    title: "5. Member Interactions & Events",
    body: "Seluna provides a platform for women to discover travel companions and attend meetups. Members are solely responsible for their off-platform meetings and travel arrangements. Seluna does not endorse or guarantee the safety of individual member-organized trips or events.",
  },
  {
    title: "6. Partner Offers & Redemptions",
    body: "Exclusive deals and partner benefits displayed on Seluna are provided by third-party venues and services. Terms, availability, and redemption criteria are determined by the respective venue partner.",
  },
  {
    title: "7. Account Termination",
    body: "Seluna reserves the right to suspend or terminate accounts that violate our Terms of Service or Community Guidelines without prior notice.",
  },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="max-w-app mx-auto min-h-0 bg-background flex flex-col">
      <header className="sticky top-0 z-20 px-app pt-10 pb-3 flex items-center gap-3 bg-background/90 backdrop-blur border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="font-display font-bold text-lg">Terms & Conditions</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 pb-12">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-base">Seluna Terms of Service</p>
          <p className="text-xs text-muted-foreground mt-1">Last updated: August 2026</p>
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
            If you have any questions regarding our Terms & Conditions, please contact Seluna Support through the Help section in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
