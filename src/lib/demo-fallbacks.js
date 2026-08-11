/** Use mock demo data only when APIs fail (offline), not when they return empty. */
export const useDemoFallbacks = import.meta.env.DEV;
