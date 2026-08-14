import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, ShieldAlert } from "lucide-react";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "How does matching work on Seluna?",
    a: "Seluna matches women travelling to the same city around the same dates. Open Discover and filter by destination, dates, interests, and languages.",
  },
  {
    q: "Is Seluna a dating app?",
    a: "No. Seluna is a women-only friendship and travel companion app. Dating pitches are against the community guidelines.",
  },
  {
    q: "How do I verify my account?",
    a: "Open Profile → Verify identity. You confirm you're 18+ with a government ID and a selfie (Veriff).",
    to: "/profile/verify",
  },
  {
    q: "How do I manage or cancel Plus?",
    a: "Open Profile → Seluna Plus to see your plan, switch monthly/yearly, or open payment & cancel.",
    to: "/subscription-management",
  },
  {
    q: "What if I feel unsafe?",
    a: "Use Report on a profile, chat, or event. The team reviews reports. In an emergency, contact local services first.",
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
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-border/80 bg-card shadow-soft px-4 border-b-0"
              >
                <AccordionTrigger className="py-3.5 text-sm font-semibold text-foreground hover:no-underline gap-3">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3.5">
                  {f.a}
                  {f.to && (
                    <button
                      type="button"
                      onClick={() => navigate(f.to)}
                      className="block mt-2 text-primary font-semibold text-sm"
                    >
                      Open this page
                    </button>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
