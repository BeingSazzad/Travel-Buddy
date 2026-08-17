/** Demo/mock data when APIs fail or return empty. On for local DEV, or when Vercel sets VITE_USE_DEMO_FALLBACKS=true. */
export const useDemoFallbacks =
  import.meta.env.DEV || import.meta.env.VITE_USE_DEMO_FALLBACKS === "true";
