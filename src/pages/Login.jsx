import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import AppleIcon from "@/components/AppleIcon";

export default function Login() {
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await base44.auth.loginViaEmailPassword(email, password);
      if (!access_token) {
        throw new Error("Login succeeded but no access token was returned");
      }
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      console.warn("API login failed, offering mock bypass:", err);
      setError("Incorrect credentials. (TIP: You can click the 'Bypass with Mock User' button below to test the app without a backend database)");
    } finally {
      setLoading(false);
    }
  };

  const handleBypass = async () => {
    setError("");
    setLoading(true);
    try {
      // Fake successful token & auth state update
      base44.auth.setToken("mock-jwt-token-12345");
      await checkUserAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setError("Mock bypass failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  const handleApple = () => {
    base44.auth.loginWithProvider("apple", "/");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <div className="space-y-3 mb-6">
        <Button variant="outline" size="md" className="w-full" onClick={handleGoogle}>
          <GoogleIcon className="w-4 h-4" />
          Continue with Google
        </Button>
        <Button variant="outline" size="md" className="w-full" onClick={handleApple}>
          <AppleIcon className="w-4 h-4" />
          Continue with Apple
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/80" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
          <span className="bg-card px-3 text-muted-foreground/85">or email</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-medium leading-relaxed">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-foreground/80">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-2xl border-border/80 focus-visible:ring-[#A1846B]/30"
              required
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-medium text-foreground/80">Password</Label>
            <Link to="/forgot-password" className="text-xs text-[#A1846B] font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-2xl border-border/80 focus-visible:ring-[#A1846B]/30"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleBypass}
          className="w-full border-[#A1846B]/40 text-[#A1846B] hover:bg-[#A1846B]/5"
        >
          <ShieldCheck className="w-4 h-4" /> Bypass with Mock User
        </Button>
      </form>
    </AuthLayout>
  );
}