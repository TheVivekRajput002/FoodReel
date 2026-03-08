import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* The main content area grows to fill available space.
                On mobile, padding-bottom ensures content isn't hidden behind the fixed BottomNav.
                On MD breakpoint and up, padding is removed since BottomNav can be handled differently or hidden. */}
            <main className="flex-1 overflow-y-auto pb-[60px] md:pb-0">
                <Outlet />
            </main>
            
            <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
                <BottomNav />
            </div>
        </div>
    );
}
