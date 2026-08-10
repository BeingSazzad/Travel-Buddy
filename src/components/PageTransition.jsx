import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      className="h-full min-h-0 app-scroll"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}