import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';
import CreateQuickActions from './CreateQuickActions';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCreateMenuOpen, setIsCreateMenuOpen] = React.useState(false);
    const [themeMode, setThemeMode] = React.useState(() => {
        const savedTheme = localStorage.getItem('themeMode');
        if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });
    const isCreator = localStorage.getItem('scs_role') === 'creator';
    const isImmersiveFeed = location.pathname === '/' || location.pathname === '/stack';

    React.useEffect(() => {
        document.documentElement.style.colorScheme = themeMode;
        document.documentElement.setAttribute('data-theme', themeMode);
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    React.useEffect(() => {
        setIsCreateMenuOpen(false);
    }, [location.pathname]);

    const handleCreateOptionSelect = React.useCallback((option) => {
        setIsCreateMenuOpen(false);

        if (option === 'stack') {
            navigate('/stack/create');
            return;
        }

        navigate('/create-reel');
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[var(--color-bg)]">
            <DesktopSidebar
                canCreate={isCreator}
                onCreateClick={() => setIsCreateMenuOpen((prev) => !prev)}
                themeMode={themeMode}
                onToggleTheme={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            />

            {/* The main content area grows to fill available space.
                On mobile, padding-bottom ensures content isn't hidden behind the fixed BottomNav.
                On MD breakpoint and up, padding is removed since BottomNav can be handled differently or hidden. */}
            <main className={`min-h-screen overflow-y-auto md:pb-0 md:pl-[86px] ${isImmersiveFeed ? 'pb-0' : 'pb-[60px]'}`}>
                <Outlet />
            </main>
            
            <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
                <BottomNav canCreate={isCreator} onCreateClick={() => setIsCreateMenuOpen((prev) => !prev)} />
            </div>

            {isCreator && (
                <CreateQuickActions
                    isOpen={isCreateMenuOpen}
                    onClose={() => setIsCreateMenuOpen(false)}
                    onSelect={handleCreateOptionSelect}
                />
            )}
        </div>
    );
}
