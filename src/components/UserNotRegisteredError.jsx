import React from 'react';
import { ShieldAlert } from 'lucide-react';

const UserNotRegisteredError = () => {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-app bg-card rounded-2xl shadow-soft border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#A1846B]/10 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-7 h-7 text-[#A1846B]" strokeWidth={1.5} />
        </div>
        <h1 className="font-display font-bold text-lg text-foreground">Access restricted</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          You are not registered to use this application. Please contact the app administrator to request access.
        </p>
        <div className="mt-5 p-4 bg-muted rounded-2xl text-left text-sm text-muted-foreground leading-relaxed">
          <p className="font-medium text-foreground mb-1">If you believe this is an error:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Verify you are logged in with the correct account</li>
            <li>Contact the app administrator for access</li>
            <li>Try logging out and back in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;