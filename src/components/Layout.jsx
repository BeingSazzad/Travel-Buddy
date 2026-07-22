import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh bg-background flex justify-center">
      <div className="relative w-full max-w-md bg-background flex flex-col min-h-dvh shadow-xl safe-x">
        <main className="flex-1 overflow-y-auto pb-28">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}