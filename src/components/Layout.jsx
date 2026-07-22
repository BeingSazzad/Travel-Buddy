import { Outlet } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';

export default function Layout() {
  return (
    <div className="min-h-dvh bg-background flex justify-center">
      <div className="relative w-full max-w-md bg-background flex flex-col min-h-dvh shadow-xl safe-x">
        <main className="flex-1 overflow-y-auto pb-28">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}