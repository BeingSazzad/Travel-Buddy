import React from 'react';
import ScreenHeader from '@/components/common/ScreenHeader';
import SavedSection from '@/components/profile/SavedSection';

export default function Saved() {
  return (
    <div className="page-shell">
      <ScreenHeader
        title="Saved"
        subtitle="Cafés, stays, events & deals you bookmarked"
      />
      <SavedSection embedded />
    </div>
  );
}
