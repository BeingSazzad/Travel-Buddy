import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
  const navigate = useNavigate();
  const { checkUserAuth, loginAsDemo, patchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const enterApp = async () => {
    try {
      await checkUserAuth();
    } catch {
      loginAsDemo();
    }
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { access_token } = await base44.auth.loginViaEmailPassword(email, password);
      if (!access_token) throw new Error("No access token");
      await enterApp();
    } catch (err) {
      console.warn("API login failed, using local demo session:", err);
      loginAsDemo();
      patchUser({ email: email.trim() || undefined });
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", `${window.location.origin}/`);
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Sign in to keep planning trips with women like you."
      backTo="/welcome"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/85">Email</Label>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground/85">Password</Label>
              <Link to="/forgot-password" className="auth-link text-xs">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-[0.14em]">
            <span className="px-3 text-muted-foreground bg-[hsl(var(--background))]">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full bg-card/70 border-border hover:bg-muted/40"
          onClick={handleGoogle}
        >
          <GoogleIcon className="w-4 h-4" />
          Continue with Google
        </Button>
      </div>
    </AuthLayout>
  );
}
