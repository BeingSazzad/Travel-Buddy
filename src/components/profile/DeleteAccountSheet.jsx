import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldAlert, Trash2 } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { useAuth } from "@/lib/AuthContext";

export default function DeleteAccountSheet({ onClose }) {
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    setError("");
    if (!password) {
      setError("Enter your password to delete your account.");
      return;
    }
    setDeleting(true);
    try {
      await base44.auth.loginViaEmailPassword(user?.email, password);
      await base44.functions.invoke("delete-account", {});
      try {
        await base44.auth.logout();
      } catch {
        /* ignore */
      }
      window.location.href = "/welcome";
    } catch (err) {
      const msg = err?.message || "";
      if (/incorrect|invalid|unauthorized/i.test(msg) || err?.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        setError(msg || "Could not delete your account. Please try again.");
      }
      setDeleting(false);
    }
  };

  return (
    <ProfileSheet title="Delete account" onClose={onClose}>
      <form onSubmit={handleDelete}>
        <div className="flex items-center gap-2.5 mb-3">
          <ShieldAlert className="w-5 h-5 text-destructive shrink-0" strokeWidth={1.5} />
          <p className="font-display font-semibold text-base text-destructive">This cannot be undone</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Deleting your account permanently removes your profile and all your Seluna data — trips, matches,
          messages, events, and saved content.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">
          If you have Seluna Plus, your subscription will be cancelled when you delete your account.
        </p>

        <div className="space-y-2 mt-5">
          <Label htmlFor="del-pass">Password</Label>
          <Input
            id="del-pass"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11"
            placeholder="Enter your password to confirm"
            disabled={deleting}
          />
        </div>

        {error && <p className="text-xs text-destructive mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <Button type="button" variant="outline" className="h-11" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button type="submit" variant="destructive" className="h-11 flex-1" disabled={deleting}>
            {deleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" strokeWidth={1.5} />
            )}
            Delete my account
          </Button>
        </div>
      </form>
    </ProfileSheet>
  );
}
