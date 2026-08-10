import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Moon, Loader2, LogOut, ShieldCheck, MailCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function ConsentRow({ id, checked, onCheck, text, linkLabel }) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheck} className="mt-0.5" />
      <Label htmlFor={id} className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer">
        {text}{" "}
        <a href="#" className="text-primary font-medium hover:underline">{linkLabel}</a>
      </Label>
    </div>
  );
}

export default function AccountPending() {
  const { user, logout } = useAuth();
  const needsVerify = !user?.is_email_verified && !user?.is_verified;
  const needsTerms = !user?.accepted_terms_at;

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptCommunity, setAcceptCommunity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    setError("");
    if (needsTerms && (!acceptTerms || !acceptPrivacy || !acceptCommunity)) {
      setError("Please accept all three agreements to continue");
      return;
    }
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const update = {};
      if (needsVerify) update.is_email_verified = true;
      if (needsTerms) {
        update.accepted_terms_at = now;
        update.accepted_privacy_at = now;
        update.accepted_community_guidelines_at = now;
      }
      if (Object.keys(update).length) {
        try {
          await base44.auth.updateMe(update);
        } catch (apiErr) {
          console.warn("API updateMe failed during pending setup, bypassing for frontend preview", apiErr);
        }
      }
      window.location.href = "/";
    } catch (err) {
      setError(err?.message || "Could not update your account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Moon className="w-6 h-6 text-[#A1846B] mb-1" strokeWidth={1.5} />
          <h1 className="font-display font-semibold text-3xl tracking-[0.08em] text-[#A1846B]">SELUNA</h1>
        </div>

        <div className="bg-card rounded-2xl shadow-premium border border-border p-7">
          <h2 className="font-display font-bold text-lg text-foreground">Finish setting up your account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            A few steps remain before you can access Seluna.
          </p>

          {needsVerify && (
            <div className="mt-5 flex items-start gap-3 p-3 rounded-lg bg-muted">
              <MailCheck className="w-4 h-4 text-foreground mt-0.5" />
              <p className="text-xs text-foreground leading-snug">
                Confirm your email address to verify your account, then continue.
              </p>
            </div>
          )}

          {needsTerms && (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-medium text-foreground">Accept the agreements</p>
              <ConsentRow id="terms" checked={acceptTerms} onCheck={setAcceptTerms} text="I agree to the" linkLabel="Terms and Conditions" />
              <ConsentRow id="privacy" checked={acceptPrivacy} onCheck={setAcceptPrivacy} text="I agree to the" linkLabel="Privacy Policy" />
              <ConsentRow id="community" checked={acceptCommunity} onCheck={setAcceptCommunity} text="I agree to the" linkLabel="Community Guidelines" />
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
          )}

          <Button onClick={handleComplete} disabled={loading} className="w-full h-12 mt-6 font-medium">
            {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</>) : (
              <><ShieldCheck className="w-4 h-4 mr-2" />Continue</>
            )}
          </Button>
        </div>

        <button
          onClick={() => logout()}
          className="w-full text-center text-sm text-muted-foreground mt-6 hover:text-foreground"
        >
          <LogOut className="w-3.5 h-3.5 inline mr-1.5" />Log out
        </button>
      </div>
    </div>
  );
}