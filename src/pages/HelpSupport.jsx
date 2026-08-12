import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Mail, ShieldAlert } from "lucide-react";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

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
    <ScrollPage>
      <ScrollPageHeader>
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="page-title">Help & Support</h1>
      </ScrollPageHeader>

      <ScrollPageBody className="space-y-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-lg">How can we help you?</p>
          <p className="text-sm text-muted-foreground mt-1">Frequently asked questions & member support</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="mailto:support@seluna.app"
            className="flex flex-col items-start p-4 rounded-2xl border border-border bg-card shadow-soft text-left active:scale-[0.98] transition"
          >
            <Mail className="w-5 h-5 text-primary mb-2" strokeWidth={1.5} />
            <p className="font-semibold text-sm text-foreground">Email Support</p>
            <p className="text-sm text-muted-foreground mt-0.5">We reply within 24 hours</p>
          </a>
          <button
            type="button"
            onClick={() => navigate("/community-guidelines")}
            className="flex flex-col items-start p-4 rounded-2xl border border-border bg-card shadow-soft text-left active:scale-[0.98] transition"
          >
            <ShieldAlert className="w-5 h-5 text-primary mb-2" strokeWidth={1.5} />
            <p className="font-semibold text-sm text-foreground">Safety</p>
            <p className="text-sm text-muted-foreground mt-0.5">Community guidelines</p>
          </button>
        </div>

        <div>
          <h2 className="section-header mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
                <p className="row-title text-foreground mb-1">{f.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-primary/10 p-4 text-center">
          <p className="font-semibold text-sm text-brand-strong">Still need assistance?</p>
          <p className="text-sm text-muted-foreground mt-1">Our support team responds within 24 hours.</p>
          <a
            href="mailto:support@seluna.app"
            className="inline-block mt-3 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold shadow-soft active:scale-95 transition"
          >
            Contact Support
          </a>
        </div>

        <div>
          <h2 className="section-header mb-3">Legal</h2>
          <div className="bg-card border border-border/80 shadow-soft rounded-2xl overflow-hidden divide-y divide-border/60">
            <button
              type="button"
              onClick={() => navigate("/community-guidelines")}
              className="w-full text-left px-4 py-3.5 row-title"
            >
              Community Guidelines
            </button>
            <button
              type="button"
              onClick={() => navigate("/terms")}
              className="w-full text-left px-4 py-3.5 row-title"
            >
              Terms & Conditions
            </button>
            <button
              type="button"
              onClick={() => navigate("/privacy")}
              className="w-full text-left px-4 py-3.5 row-title"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </ScrollPageBody>
    </ScrollPage>
  );
}
