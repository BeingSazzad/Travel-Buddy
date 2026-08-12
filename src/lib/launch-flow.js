const ONBOARDING_KEY = "seluna_onboarding_v4";
const SPLASH_SESSION_KEY = "seluna_splash_session";

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasSeenSplashThisSession() {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSplashSeen() {
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearSplashSession() {
  try {
    sessionStorage.removeItem(SPLASH_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Unauthenticated entry:
 * Splash (once per session) → marketing onboarding (once) → welcome.
 */
export function getUnauthEntryPath() {
  if (!hasSeenSplashThisSession()) return "/splash";
  if (!hasCompletedOnboarding()) return "/onboarding";
  return "/welcome";
}

export function pathAfterSplash() {
  return hasCompletedOnboarding() ? "/welcome" : "/onboarding";
}
