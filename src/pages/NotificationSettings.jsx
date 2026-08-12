import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import SettingsPage from "@/components/profile/SettingsPage";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import NotificationSettingsPanel, { NOTIFICATION_CATEGORIES } from "@/components/profile/NotificationSettingsPanel";

export default function NotificationSettings() {
  const navigate = useNavigate();
  const { user, checkUserAuth, patchUser } = useAuth();
  const [master, setMaster] = useState(user?.allow_notifications !== false);
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(NOTIFICATION_CATEGORIES.map((c) => [c.key, user?.[c.key] !== false]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    const payload = { allow_notifications: master, ...prefs };
    try {
      await base44.auth.updateMe(payload);
      try {
        await checkUserAuth();
      } catch {
        patchUser(payload);
      }
      navigate("/profile");
    } catch {
      patchUser(payload);
      navigate("/profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsPage title="Notifications">
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        Choose what you want to be notified about.
      </p>
      <NotificationSettingsPanel
        master={master}
        onMasterChange={setMaster}
        prefs={prefs}
        onPrefChange={(key, val) => setPrefs((p) => ({ ...p, [key]: val }))}
      />
      {error && <p className="text-sm text-destructive mt-3">{error}</p>}
      <Button className="w-full h-11 rounded-2xl mt-6" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
      </Button>
    </SettingsPage>
  );
}
