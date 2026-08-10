import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Mail, MessageCircle, ShieldAlert, ChevronRight } from "lucide-react";

const FAQ = [
  {
    q: "How does matching work on Seluna?",
    a: "Seluna matches women travelling to the same destination around the same dates. You can filter deck matches by age, dates, interests, and languages.",
  },
  {
    q: "Is Seluna a dating app?",
    a: "No. Seluna is strictly a women-only friendship, travel companion, and community platform. Dating solicitation is prohibited.",
  },
  {
    q: "How do I verify my account?",
    a: "Go to Profile → Verify Identity. You will need a valid government-issued ID and a selfie processed securely via Veriff.",
  },
  {
    q: "How do I manage or cancel my subscription?",
    a: "Go to Profile → Subscription to view your current plan, upgrade, or cancel your auto-renewal at any time.",
  },
  {
    q: "What should I do if I feel unsafe or spot inappropriate content?",
    a: "Use the Report button on any profile, message, or event card. Our moderation team reviews all reports 24/7.",
  },
];

export default function HelpSupport() {
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
        <h1 className="font-display font-bold text-lg">Help & Support</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-12">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6 text-[#A1846B]" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-base">How can we help you?</p>
          <p className="text-xs text-muted-foreground mt-1">Frequently asked questions & member support</p>
        </div>

        {/* Quick action cards */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/community-guidelines")}
            className="flex flex-col items-start p-4 rounded-2xl border border-border bg-card shadow-soft text-left active:scale-[0.98] transition"
          >
            <ShieldAlert className="w-5 h-5 text-[#A1846B] mb-2" strokeWidth={1.5} />
            <p className="font-semibold text-xs text-foreground">Community Rules</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Read safety guidelines</p>
          </button>
          <a
            href="mailto:support@seluna.app"
            className="flex flex-col items-start p-4 rounded-2xl border border-border bg-card shadow-soft text-left active:scale-[0.98] transition"
          >
            <Mail className="w-5 h-5 text-[#A1846B] mb-2" strokeWidth={1.5} />
            <p className="font-semibold text-xs text-foreground">Email Support</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Contact support team</p>
          </a>
        </div>

        {/* FAQ list */}
        <div>
          <h2 className="font-display font-semibold text-sm mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
                <p className="font-semibold text-xs text-foreground mb-1">{f.q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact banner */}
        <div className="rounded-2xl bg-[#A1846B]/10 p-4 text-center">
          <p className="font-semibold text-xs text-[#5c4636]">Still need assistance?</p>
          <p className="text-[11px] text-muted-foreground mt-1">Our support team responds within 24 hours.</p>
          <a
            href="mailto:support@seluna.app"
            className="inline-block mt-3 px-4 py-2 rounded-full bg-[#A1846B] text-white text-xs font-semibold shadow-soft active:scale-95 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
