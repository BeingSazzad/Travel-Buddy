import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, Loader2, ShieldAlert, Trash2, CreditCard } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { useAuth } from "@/lib/AuthContext";

const REMOVED = [
  "Your profile",
  "Your photos",
  "Your trips",
  "Your matches",
  "Your messages & conversations",
  "Your events & RSVPs",
  "Your saved content",
  "Your reviews & votes",
];

export default function DeleteAccountSheet({ onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const verify = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) return setError("Enter your password to continue");
    setVerifying(true);
    try {
      await base44.auth.loginViaEmailPassword(user?.email, password);
      setStep(2);
    } catch (err) {
      setError("Incorrect password. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const doDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await base44.functions.invoke("delete-account", {});
      try { await base44.auth.logout(); } catch (e) {}
      window.location.href = "/welcome";
    } catch (err) {
      setError(err?.message || "Could not delete your account. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <ProfileSheet title="Delete account" onClose={onClose}>
      {step === 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <ShieldAlert className="w-5 h-5 text-destructive" strokeWidth={1.5} />
            <p className="font-display font-semibold text-lg text-destructive">This is permanent</p>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Deleting your account permanently removes the following from Seluna:
          </p>
          <ul className="mt-3 space-y-2">
            {REMOVED.map((r) => (
              <li key={r} className="flex items-center gap-2 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> {r}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4">This action cannot be undone.</p>

          <label className="flex items-start gap-2.5 mt-4 p-3 rounded-xl bg-destructive/5 border border-destructive/20 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 accent-[#9f5a4a]" />
            <span className="text-sm">I understand this permanently deletes my account and all my content.</span>
          </label>

          {/* Subscription note */}
          <div className="mt-4 rounded-xl border border-border bg-[#A1846B]/5 p-3 flex gap-2.5">
            <CreditCard className="w-4 h-4 text-[#A1846B] mt-0.5 shrink-0" strokeWidth={1.5} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Subscription is separate.</span> Deleting your
              account does <span className="font-medium">not</span> cancel your Seluna Plus subscription or
              stop charges. You must manage or cancel your subscription directly with your payment provider
              (Stripe) under Subscription → Manage subscription.
            </p>
          </div>

          <Button className="w-full h-11 mt-5" disabled={!confirmed} onClick={() => setStep(1)}>
            Continue
          </Button>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={verify}>
          <div className="flex items-center gap-2.5 mb-2">
            <AlertTriangle className="w-5 h-5 text-[#A1846B]" strokeWidth={1.5} />
            <p className="font-display font-semibold text-lg">Verify it's you</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Re-enter your password to confirm you're the account owner.
          </p>
          <div className="space-y-2">
            <Label htmlFor="del-pass">Password</Label>
            <Input id="del-pass" type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" placeholder="••••••••" />
          </div>
          {error && <p className="text-xs text-destructive mt-3">{error}</p>}
          <div className="flex gap-3 mt-5">
            <Button type="button" variant="outline" className="h-11" onClick={() => { setError(""); setStep(0); }} disabled={verifying}>Back</Button>
            <Button type="submit" className="h-11 flex-1" disabled={verifying}>
              {verifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Verify
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <Trash2 className="w-5 h-5 text-destructive" strokeWidth={1.5} />
            <p className="font-display font-semibold text-lg">Final step</p>
          </div>
          <p className="text-sm text-muted-foreground mb-1">
            You're verified. Deleting now will permanently remove your account and all listed content.
          </p>
          <p className="text-xs text-muted-foreground mb-4">Remember to cancel your subscription separately via Stripe.</p>
          {error && <p className="text-xs text-destructive mb-3">{error}</p>}
          <div className="flex gap-3">
            <Button variant="outline" className="h-11" onClick={() => { setError(""); setStep(1); }} disabled={deleting}>Back</Button>
            <Button variant="destructive" className="h-11 flex-1" onClick={doDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} />} Delete my account
            </Button>
          </div>
        </div>
      )}
    </ProfileSheet>
  );
}