import React, { useState } from "react";
import { ShieldCheck, BadgeCheck, Loader2, LifeBuoy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const STATUS_LABEL = {
  pending: "Verification in progress — continue when you're ready.",
  declined: "Verification was declined. You can try again or request a manual review.",
  expired: "Verification expired. Please try again.",
  abandoned: "Verification was abandoned. Please try again.",
  resubmission_requested: "Please resubmit your verification to continue.",
  manual_review_requested: "Manual review requested — our team will be in touch.",
  review: "Your verification is under review.",
};

const REVIEWABLE = ["declined", "expired", "abandoned", "resubmission_requested"];

export default function VerificationCard() {
  const { user, checkUserAuth } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const verified = !!user?.identity_verified && !!user?.age_verified;
  const status = user?.verification_status || "none";

  const startVerification = async () => {
    setError("");
    setBusy(true);
    try {
      const returnUrl = window.location.origin + window.location.pathname;
      const res = await base44.functions.invoke("veriff-session", { returnUrl });
      const url = res?.data?.url;
      if (!url) throw new Error("Could not start verification. Please try again.");
      window.location.href = url;
    } catch (e) {
      setError(e?.message || "Could not start verification. Please try again.");
      setBusy(false);
    }
  };

  const requestManualReview = async () => {
    setError("");
    setBusy(true);
    try {
      await base44.auth.updateMe({ verification_status: "manual_review_requested" });
      await checkUserAuth();
    } catch (e) {
      setError(e?.message || "Could not request manual review.");
    } finally {
      setBusy(false);
    }
  };

  if (verified) {
    return (
      <div className="mt-5 rounded-2xl bg-[#A1846B]/10 p-4 flex items-center gap-3">
        <BadgeCheck className="w-5 h-5 text-[#A1846B] shrink-0" strokeWidth={1.5} />
        <div>
          <p className="font-display font-semibold text-sm">Verified identity</p>
          <p className="text-xs text-muted-foreground">Identity and age (18+) confirmed via Veriff</p>
        </div>
      </div>
    );
  }

  const showStatus = status !== "none" && status !== "approved";

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#A1846B]/10 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold text-sm">Verify your identity</p>
          <p className="text-xs text-muted-foreground leading-snug">
            Confirm you're 18+ with a government ID and a selfie. Powered by Veriff.
          </p>
        </div>
      </div>

      {showStatus && (
        <p className="text-xs text-muted-foreground mb-3">{STATUS_LABEL[status] || status}</p>
      )}
      {error && <p className="text-xs text-destructive mb-3">{error}</p>}

      <button
        onClick={startVerification}
        disabled={busy}
        className="w-full h-11 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />}
        {status === "pending" ? "Continue verification" : REVIEWABLE.includes(status) ? "Try again" : "Verify identity"}
      </button>

      {REVIEWABLE.includes(status) && (
        <button
          onClick={requestManualReview}
          disabled={busy}
          className="w-full text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          <LifeBuoy className="w-3.5 h-3.5" strokeWidth={1.5} /> Request manual review
        </button>
      )}
    </div>
  );
}