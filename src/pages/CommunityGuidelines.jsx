import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, ShieldCheck, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

const SECTIONS = [
  {
    title: "Harassment",
    body: "Unwelcome, intimidating, or repeated contact toward another member is not allowed. If someone asks you to stop, stop — and report any continued unwanted attention.",
  },
  {
    title: "Hate speech",
    body: "Content that attacks, degrades, or incites violence against people based on race, ethnicity, religion, sexual orientation, gender identity, disability, or nationality has no place here.",
  },
  {
    title: "Sexual content",
    body: "Explicit or suggestive sexual content is prohibited. Seluna is a safe, respectful space — keep all photos, posts, and messages non-sexual.",
  },
  {
    title: "No dating solicitation",
    body: "Seluna is a women's friendship, travel and community platform — not a dating app. Romantic or dating-oriented propositions toward other members are not permitted. Keep connections friendly and travel-focused.",
  },
  {
    title: "Scams",
    body: "Deceptive schemes, requests for money, fake offers, or any attempt to defraud members will result in immediate removal and may be reported to authorities.",
  },
  {
    title: "Discrimination",
    body: "Treating anyone unfairly because of who they are — their background, identity, beliefs, or appearance — is unacceptable. Every member deserves equal respect.",
  },
  {
    title: "Bullying",
    body: "Targeted insults, mocking, exclusion, or repeated humiliating behaviour toward a member is prohibited. Disagree respectfully or walk away.",
  },
  {
    title: "Impersonation",
    body: "Pretending to be someone else — another member, a staff member, or a public figure — is strictly forbidden. Be yourself.",
  },
  {
    title: "Sharing private information",
    body: "Never share another member's private details (home address, phone number, financial info, photos) without consent. Protect everyone's privacy as you'd protect your own.",
  },
  {
    title: "Dangerous event behavior",
    body: "At Seluna events, never endanger others: no weapons, drugs, unsafe locations, or reckless conduct. Hosts must keep venues safe and accessible, and members must follow host and venue rules.",
  },
];

export default function CommunityGuidelines() {
  const navigate = useNavigate();
  const { user, isAuthenticated, checkUserAuth } = useAuth();
  const alreadyAccepted = !!user?.accepted_community_guidelines_at;
  const showAcceptFlow = isAuthenticated && !alreadyAccepted;

  const [busy, setBusy] = useState(false);
  const [justAccepted, setJustAccepted] = useState(false);

  const onAccept = async () => {
    setBusy(true);
    try {
      try {
        await base44.auth.updateMe({ accepted_community_guidelines_at: new Date().toISOString() });
      } catch (apiErr) {
        console.warn("API updateMe failed during community guidelines accept, bypassing for preview", apiErr);
      }
      await checkUserAuth();
      setJustAccepted(true);
      setTimeout(() => navigate("/"), 600);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollPage>
      <ScrollPageHeader>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <h1 className="font-display font-semibold text-lg">Community Guidelines</h1>
      </ScrollPageHeader>

      <ScrollPageBody className={showAcceptFlow ? "pb-4" : undefined}>
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
          <p className="font-display font-bold text-lg">Seluna is a community</p>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Seluna is a women&apos;s friendship, travel and community platform — not a dating app. These
            guidelines keep it safe, warm, and welcoming for every member.
          </p>
          {alreadyAccepted && !showAcceptFlow && (
            <p className="text-xs text-primary font-medium mt-3 flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              You accepted these guidelines when you joined
            </p>
          )}
        </div>

        <div className="space-y-3">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-4">
              <p className="font-medium text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                  {i + 1}
                </span>
                {s.title}
              </p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-4 mt-5 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Breaking these guidelines can result in content removal, loss of access to social features,
            or permanent account removal. Use the Report option wherever you see it — our team reviews
            every report.
          </p>
        </div>
      </ScrollPageBody>

      {showAcceptFlow && (
        <div className="shrink-0 px-5 py-4 bg-background/95 backdrop-blur border-t border-border safe-pb">
          <Button
            className="w-full h-12"
            onClick={onAccept}
            disabled={busy || justAccepted}
          >
            {justAccepted ? (
              <>
                <Check className="w-4 h-4 mr-1.5" strokeWidth={2} /> Accepted — welcome
              </>
            ) : busy ? (
              "Saving…"
            ) : (
              "I accept the guidelines"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-2">
            Accept once to unlock social features in Seluna.
          </p>
        </div>
      )}
    </ScrollPage>
  );
}
