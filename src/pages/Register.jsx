import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { markOnboardingDone } from "@/lib/launch-flow";

function FieldLabel({ htmlFor, children }) {
  return (
    <Label htmlFor={htmlFor} className="text-xs font-semibold text-foreground/85">
      {children}
    </Label>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { loginAsNewMember } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptAll, setAcceptAll] = useState(false);
  const [ageConfirm, setAgeConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const finishSignup = async () => {
    setLoading(true);
    try {
      markOnboardingDone();
      const now = new Date().toISOString();

      try {
        await base44.auth.register({
          email: email.trim() || "demo@seluna.app",
          password: password || "demo1234",
        });
      } catch {
        /* local preview */
      }

      base44.auth.setToken("mock-jwt-token-12345");
      try {
        await base44.auth.updateMe({
          first_name: "New",
          last_name: "Member",
          is_email_verified: true,
          accepted_terms_at: now,
          accepted_privacy_at: now,
          accepted_community_guidelines_at: now,
          subscription_status: "pending",
          profile_completed: false,
        });
      } catch {
        /* local */
      }

      loginAsNewMember({
        email: email.trim() || "new@seluna.app",
        subscription_status: "pending",
        profile_completed: false,
        accepted_terms_at: now,
        accepted_privacy_at: now,
        accepted_community_guidelines_at: now,
        is_email_verified: true,
      });

      navigate("/profile-setup", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await finishSignup();
  };

  const handleGoogle = () => {
    markOnboardingDone();
    base44.auth.loginWithProvider("google", `${window.location.origin}/profile-setup`);
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="Create your account"
      subtitle="One screen to join — interests and photos come next, and you can skip them."
      backTo="/welcome"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <FieldLabel htmlFor="email">Email</FieldLabel>
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
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
            <FieldLabel htmlFor="confirm">Confirm password</FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 auth-input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="ageConfirm"
              checked={ageConfirm}
              onCheckedChange={setAgeConfirm}
              className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="ageConfirm" className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer">
              I am at least 18 years old
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox
              id="acceptAll"
              checked={acceptAll}
              onCheckedChange={setAcceptAll}
              className="mt-0.5 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="acceptAll" className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer">
              I agree to the{" "}
              <Link to="/terms" className="auth-link">Terms</Link>
              {", "}
              <Link to="/privacy" className="auth-link">Privacy</Link>
              {" & "}
              <Link to="/community-guidelines" className="auth-link">Guidelines</Link>
            </Label>
          </div>
        </div>

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.14em]">
            <span className="bg-[hsl(var(--background))] px-3 text-muted-foreground gradient-app-bg">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full bg-card/70 border-border hover:bg-muted/40"
          onClick={handleGoogle}
        >
          <GoogleIcon className="w-4 h-4" /> Continue with Google
        </Button>
      </form>
    </AuthLayout>
  );
}
