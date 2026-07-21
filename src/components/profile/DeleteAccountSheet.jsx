import React, { useState } from "react";
import ProfileSheet from "@/components/profile/ProfileSheet";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DeleteAccountSheet({ onClose }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <ProfileSheet title="Delete account" onClose={onClose}>
      <div className="text-center py-4">
        <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" strokeWidth={1.5} />
        <p className="font-display font-semibold text-lg">We're sorry to see you go</p>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          For your security, account deletion is handled by our team. Please contact Seluna support and we'll permanently remove your profile, trips, messages and saved items.
        </p>
      </div>
      {confirming ? (
        <p className="text-xs text-muted-foreground text-center mt-3">Please reach out to Seluna support to proceed.</p>
      ) : (
        <Button variant="outline" className="w-full h-11 mt-4" onClick={() => setConfirming(true)}>I understand</Button>
      )}
    </ProfileSheet>
  );
}