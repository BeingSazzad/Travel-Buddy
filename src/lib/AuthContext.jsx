import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { appParams } from '@/lib/app-params';
import { createAxiosClient } from '@base44/sdk/dist/utils/axios-client';
import { getAccessToken } from '@base44/sdk/dist/utils/auth-utils';
import { DEMO_USER } from "@/lib/demo-user";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(true);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: "mock-app-id", public_settings: {} }); // Mocked

  useEffect(() => {
    // Disabled backend API auth checks to focus only on frontend flow/design.
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // First, check app public settings (with token if available)
      // This will tell us if auth is required, user not registered, etc.
      const token = appParams.token || getAccessToken();
      const appClient = createAxiosClient({
        baseURL: `/api/apps/public`,
        headers: {
          'X-App-Id': appParams.appId
        },
        token,
        interceptResponses: true
      });
      
      try {
        const publicSettings = await appClient.get(`/prod/public-settings/by-id/${appParams.appId}`);
        setAppPublicSettings(publicSettings);
        
        if (token) {
          base44.auth.setToken(token);
          await checkUserAuth();
        } else {
          setIsLoadingAuth(false);
          setIsAuthenticated(false);
          setAuthChecked(true);
        }
        setIsLoadingPublicSettings(false);
      } catch (appError) {
        console.error('App state check failed:', appError);
        
        // Handle app-level errors
        if (appError.status === 403 && appError.data?.extra_data?.reason) {
          const reason = appError.data.extra_data.reason;
          if (reason === 'auth_required') {
            setAuthError({
              type: 'auth_required',
              message: 'Authentication required'
            });
          } else if (reason === 'user_not_registered') {
            setAuthError({
              type: 'user_not_registered',
              message: 'User not registered for this app'
            });
          } else {
            setAuthError({
              type: reason,
              message: appError.message
            });
          }
        } else {
          setAuthError({
            type: 'unknown',
            message: appError.message || 'Failed to load app'
          });
        }
        setIsLoadingPublicSettings(false);
        setIsLoadingAuth(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      // Now check if the user is authenticated
      setIsLoadingAuth(true);
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      console.error('User auth check failed:', error);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
      
      if (error.status === 401 || error.status === 403) {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('base44_access_token');
          window.localStorage.removeItem('token');
        }
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required'
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("base44_access_token");
      window.localStorage.removeItem("token");
    }
    try {
      // Clear SDK session without redirecting to hosted Base44 login
      base44.auth.logout();
    } catch {
      /* ignore */
    }
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    setAuthChecked(true);

    if (shouldRedirect && typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("seluna_splash_session");
      } catch {
        /* ignore */
      }
      window.location.assign("/");
    }
  };

  const navigateToLogin = () => {
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setIsAuthenticated(true);
    setAuthChecked(true);
    setAuthError(null);
  };

  /** Fresh member after signup — empty profile, not the Clara demo. */
  const loginAsNewMember = (partial = {}) => {
    const now = new Date().toISOString();
    setUser({
      id: `user_${Date.now()}`,
      email: partial.email || "new@seluna.app",
      role: "user",
      first_name: partial.first_name || "New",
      last_name: partial.last_name || "Member",
      profile_name: "",
      profile_photos: [],
      main_photo: null,
      interests: [],
      travel_style: [],
      profile_completed: false,
      is_email_verified: true,
      accepted_terms_at: now,
      accepted_privacy_at: now,
      accepted_community_guidelines_at: now,
      subscription_status: "pending",
      ...partial,
    });
    setIsAuthenticated(true);
    setAuthChecked(true);
    setAuthError(null);
  };

  const patchUser = (partial) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
      loginAsDemo,
      loginAsNewMember,
      patchUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
