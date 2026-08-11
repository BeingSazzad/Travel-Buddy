import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import NotificationSettingsPanel, { NOTIFICATION_CATEGORIES } from "@/components/profile/NotificationSettingsPanel";

export default function NotificationsSheet({ onClose }) {
  const { user, checkUserAuth } = useAuth();
  const [master, setMaster] = useState(user?.allow_notifications !== false);
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(NOTIFICATION_CATEGORIES.map((c) => [c.key, user?.[c.key] !== false]))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await base44.auth.updateMe({
        allow_notifications: master,
        ...prefs,
      });
      await checkUserAuth();
      onClose();
    } catch {
      setError("Could not save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSheet title="Notification settings" onClose={onClose}>
      <p className="text-sm text-muted-foreground mb-2">Choose what you want to be notified about.</p>
      <NotificationSettingsPanel
        master={master}
        onMasterChange={setMaster}
        prefs={prefs}
        onPrefChange={(key, val) => setPrefs((p) => ({ ...p, [key]: val }))}
      />
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <Button className="w-full h-11 mt-4" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
      </Button>
    </ProfileSheet>
  );
}
