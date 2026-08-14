/** Keep sheets/menus open when Figma capture / outside clicks hit the page. Close via X or explicit actions only. */
export function preventDismiss(event) {
  event.preventDefault();
}
