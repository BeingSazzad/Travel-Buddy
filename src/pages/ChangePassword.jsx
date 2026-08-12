import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import ScrollPage, { ScrollPageHeader, ScrollPageBody } from "@/components/common/ScrollPage";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("Use at least 8 characters for your new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (!user?.id) {
      setError("You need to be logged in to change your password.");
      return;
    }
    setSaving(true);
    try {
      await base44.auth.changePassword({
        userId: user.id,
        currentPassword,
        newPassword,
      });
      setDone(true);
    } catch (err) {
      const msg = err?.message || "";
      if (err?.status === 401 || /incorrect|invalid/i.test(msg)) {
        setError("Current password is incorrect.");
      } else {
        setError(msg || "Could not update password. Try again.");
      }
    } finally {
      setSaving(false);
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
          <ArrowLeft className="w-5 h-5 text-foreground" strokeWidth={1.75} />
        </button>
        <h1 className="page-title">Change password</h1>
      </ScrollPageHeader>

      <ScrollPageBody>
        {done ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-primary" strokeWidth={2} />
            </div>
            <p className="font-display font-semibold text-lg">Password updated</p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
              Your password has been changed. Use your new password next time you sign in.
            </p>
            <Button className="w-full h-11 mt-6" onClick={() => navigate("/profile")}>
              Back to profile
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your current password, then choose a new one with at least 8 characters.
            </p>

            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-11 rounded-2xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11 rounded-2xl"
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-2xl"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 rounded-2xl" disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Lock className="w-4 h-4 mr-2" strokeWidth={1.5} />
              )}
              Update password
            </Button>
          </form>
        )}
      </ScrollPageBody>
    </ScrollPage>
  );
}
