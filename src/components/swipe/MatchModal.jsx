import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, Compass } from "lucide-react";

export default function MatchModal({ open, myAvatar, theirAvatar, onMessage, onProfile, onKeepExploring }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onKeepExploring()}>
      <DialogContent className="max-w-[340px] p-6 text-center rounded-3xl border-0 shadow-premium bg-card">
        <div className="flex justify-center items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-soft -mr-5 z-10">
            <Image src={myAvatar} alt="You" fittingType="fill" className="w-full h-full" />
          </div>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-card shadow-soft">
            <Image src={theirAvatar} alt="Match" fittingType="fill" className="w-full h-full" />
          </div>
        </div>

        <div className="w-12 h-12 rounded-full bg-[#A1846B] mx-auto -mt-6 flex items-center justify-center text-white shadow-soft relative z-20">
          <Heart className="w-6 h-6 fill-white" strokeWidth={0} />
        </div>

        <h2 className="font-display font-semibold text-2xl mt-3">You matched!</h2>
        <p className="text-sm text-muted-foreground mt-1">Start planning, chatting or meeting safely.</p>

        <div className="space-y-2 mt-5">
          <Button className="w-full bg-foreground text-background" onClick={onMessage}>
            <MessageCircle className="w-4 h-4 mr-2" strokeWidth={1.5} /> Send message
          </Button>
          <Button variant="outline" className="w-full" onClick={onProfile}>
            <User className="w-4 h-4 mr-2" strokeWidth={1.5} /> View profile
          </Button>
          <Button variant="ghost" className="w-full" onClick={onKeepExploring}>
            <Compass className="w-4 h-4 mr-2" strokeWidth={1.5} /> Keep exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}