import { useLocation } from "react-router-dom";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <div
      key={pathname}
      className="h-full min-h-0 overflow-hidden overflow-x-hidden min-w-0 max-w-full animate-in fade-in slide-in-from-bottom-2 duration-300"
      style={{ animationTimingFunction: EASE }}
    >
      {children}
    </div>
  );
}
