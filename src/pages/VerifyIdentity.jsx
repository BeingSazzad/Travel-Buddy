import React from "react";
import ScreenHeader from "@/components/common/ScreenHeader";
import VerificationCard from "@/components/profile/VerificationCard";

export default function VerifyIdentity() {
  return (
    <div className="page-shell">
      <ScreenHeader
        showBack
        title="Verify identity"
        subtitle="Confirm you're 18+ to use Seluna"
      />
      <VerificationCard />
    </div>
  );
}
