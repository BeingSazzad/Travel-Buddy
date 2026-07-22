import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SuccessCheck({ size = "w-14 h-14", iconSize = "w-7 h-7", className = "" }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
      className={`${size} rounded-full bg-[#A1846B]/10 flex items-center justify-center mx-auto ${className}`}
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.08, type: "spring", stiffness: 400, damping: 16 }}
      >
        <Check className={`${iconSize} text-[#A1846B]`} strokeWidth={2} />
      </motion.span>
    </motion.div>
  );
}