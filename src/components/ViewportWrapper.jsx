import React, { useEffect, useState } from "react";
import { Wifi, Battery, Signal } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ViewportWrapper({ children }) {
  const [time, setTime] = useState("09:41");
  const { pathname } = useLocation();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hrs = now.getHours();
      let mins = now.getMinutes();
      const str = `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
      setTime(str);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-muted/40 dark:bg-zinc-950 flex items-center justify-center p-0 sm:p-6 font-body">
      {/* Device Frame */}
      <div className="relative w-full h-screen sm:h-[932px] sm:w-[430px] bg-background flex flex-col shadow-2xl sm:rounded-[55px] overflow-hidden sm:border-[10px] sm:border-zinc-900 dark:sm:border-zinc-800 ring-4 ring-black/5">
        
        {/* Mock Status Bar */}
        <div className="absolute top-0 inset-x-0 h-11 px-6 flex items-center justify-between z-[999] bg-transparent pointer-events-none select-none">
          {/* Time */}
          <span className="text-xs font-semibold tracking-tight text-foreground/90">{time}</span>
          
          {/* Dynamic Island */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-2.5 w-28 h-7 bg-black rounded-full shadow-inner" />
          
          {/* Icons */}
          <div className="flex items-center gap-1.5 text-foreground/90">
            <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
            <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
            <div className="relative flex items-center">
              <Battery className="w-4 h-4" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 relative overflow-hidden w-full h-full">
          {children}
        </div>

        {/* Mock Home Indicator */}
        <div className="absolute bottom-0 inset-x-0 h-8 flex items-center justify-center z-[999] bg-transparent pointer-events-none select-none">
          <div className="w-32 h-1 bg-foreground/30 dark:bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
