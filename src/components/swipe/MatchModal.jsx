import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, User, Compass, Ban, Flag, HeartCrack } from "lucide-react";

export default function MatchModal({ open, myAvatar, theirAvatar, onMessage, onProfile, onKeepExploring, onUnmatch, onBlock, onReport }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onKeepExploring()}>
      <DialogContent className="max-w-[340px] p-6 text-center rounded-3xl border-0 shadow-premium bg-card">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="flex justify-center items-center"
        >
          <motion.div
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 24 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-soft -mr-5 z-10"
          >
            <Image src={myAvatar} alt="You" fittingType="fill" className="w-full h-full" />
          </motion.div>
          <motion.div
            initial={{ x: 16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 24 }}
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-soft"
          >
            <Image src={theirAvatar} alt="Match" fittingType="fill" className="w-full h-full" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 320, damping: 14 }}
          className="w-12 h-12 rounded-full bg-[#A1846B] mx-auto -mt-6 flex items-center justify-center text-white shadow-soft relative z-20"
        >
          <Sparkles className="w-6 h-6 text-white" strokeWidth={1.5} />
        </motion.div>

        <h2 className="font-display font-bold text-lg mt-3">It's a match!</h2>
        <p className="text-sm text-muted-foreground mt-1">You can now start chatting.</p>

        <div className="space-y-2 mt-5">
          <Button className="w-full bg-foreground text-background" onClick={onMessage}>
            <MessageCircle className="w-4 h-4 mr-2" strokeWidth={1.5} /> Start chatting
          </Button>
          <Button variant="outline" className="w-full" onClick={onProfile}>
            <User className="w-4 h-4 mr-2" strokeWidth={1.5} /> View profile
          </Button>
          <Button variant="ghost" className="w-full" onClick={onKeepExploring}>
            <Compass className="w-4 h-4 mr-2" strokeWidth={1.5} /> Keep exploring
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <button onClick={onUnmatch} className="flex items-center gap-1.5 active:scale-95 transition">
            <HeartCrack className="w-3.5 h-3.5" strokeWidth={1.5} /> Unmatch
          </button>
          <span className="w-px h-3 bg-border" />
          <button onClick={onBlock} className="flex items-center gap-1.5 active:scale-95 transition">
            <Ban className="w-3.5 h-3.5" strokeWidth={1.5} /> Block
          </button>
          <span className="w-px h-3 bg-border" />
          <button onClick={onReport} className="flex items-center gap-1.5 active:scale-95 transition">
            <Flag className="w-3.5 h-3.5" strokeWidth={1.5} /> Report
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}