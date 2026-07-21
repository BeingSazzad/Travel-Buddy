import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

function Toggle({ label, desc, checked, onCheck }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheck} />
    </div>
  );
}

export default function NotificationsSheet({ onClose }) {
  const { user, checkUserAuth } = useAuth();
  const [notifications, setNotifications] = useState(!!user?.allow_notifications);
  const [matches, setMatches] = useState(!!user?.allow_match_suggestions);
  const [invitations, setInvitations] = useState(!!user?.allow_event_invitations);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ allow_notifications: notifications, allow_match_suggestions: matches, allow_event_invitations: invitations });
      await checkUserAuth();
      onClose();
    } catch (e) { alert("Could not save settings."); }
    finally { setSaving(false); }
  };

  return (
    <ProfileSheet title="Notifications" onClose={onClose}>
      <div>
        <Toggle label="Allow notifications" desc="Receive app notifications" checked={notifications} onCheck={setNotifications} />
        <Toggle label="Match suggestions" desc="Receive suggested travel companions" checked={matches} onCheck={setMatches} />
        <Toggle label="Event invitations" desc="Other members can invite you to events" checked={invitations} onCheck={setInvitations} />
      </div>
      <Button className="w-full h-11 mt-4" onClick={save} disabled={saving}>
        {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save changes
      </Button>
    </ProfileSheet>
  );
}