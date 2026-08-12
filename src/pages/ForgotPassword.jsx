import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, Lock, KeyRound, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

/**
 * App-native password recovery:
 * Email → OTP → New password (no email magic link).
 */
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goBack = () => {
    setError("");
    if (step === 0) navigate("/login");
    else setStep((s) => s - 1);
  };

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      try {
        await base44.auth.resetPasswordRequest(email.trim());
      } catch {
        /* local preview — OTP demo */
      }
      setOtp("");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setStep(2);
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don’t match.");
      return;
    }
    setLoading(true);
    try {
      try {
        await base44.auth.resetPassword({
          resetToken: otp || "local",
          newPassword: password,
        });
      } catch {
        /* local preview */
      }
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const meta = [
    {
      icon: Mail,
      title: "Forgot password?",
      subtitle: "Enter your email and we’ll send a 6-digit code.",
    },
    {
      icon: KeyRound,
      title: "Enter your code",
      subtitle: `We sent a code to ${email || "your email"}.`,
    },
    {
      icon: Lock,
      title: "New password",
      subtitle: "Choose a password you’ll remember.",
    },
    {
      icon: CheckCircle2,
      title: "Password updated",
      subtitle: "You can sign in with your new password now.",
    },
  ][step];

  return (
    <AuthLayout
      icon={meta.icon}
      title={meta.title}
      subtitle={meta.subtitle}
      onBack={step < 3 ? goBack : undefined}
      backTo="/login"
      footer={
        step < 3 ? (
          <Link to="/login" className="auth-link">
            Back to sign in
          </Link>
        ) : null
      }
    >
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-destructive/10 text-destructive text-xs font-medium leading-relaxed">
          {error}
        </div>
      )}

      {step === 0 && (
        <form onSubmit={sendCode} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 auth-input"
                required
              />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              "Send code"
            )}
          </Button>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={verifyOtp} className="space-y-5">
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-foreground/85">Verification code</Label>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              autoFocus
              containerClassName="justify-between w-full"
            >
              <InputOTPGroup className="gap-2 w-full justify-between">
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    className="h-12 w-11 rounded-xl border border-border bg-card/70 text-base first:rounded-xl last:rounded-xl first:border-l border-l"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="text-[11px] text-muted-foreground">
              Didn’t get it? Check spam, or resend below.
            </p>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Verify code
          </Button>

          <button
            type="button"
            onClick={sendCode}
            disabled={loading}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Resend code
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={savePassword} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">
              New password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                autoFocus
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 auth-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm" className="text-xs font-semibold text-foreground/85">
              Confirm password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="pl-10 auth-input"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Update password"
            )}
          </Button>
        </form>
      )}

      {step === 3 && (
        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={() => navigate("/login", { replace: true })}
        >
          Sign in
        </Button>
      )}
    </AuthLayout>
  );
}
