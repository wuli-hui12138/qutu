import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User } from 'lucide-react';
import clsx from 'clsx';

export default function MobileLayout() {
    const location = useLocation();
    const hideNavPaths = ['/upload', '/detail', '/settings'];
    const hideNav = hideNavPaths.some(path => location.pathname.startsWith(path));

    return (
        <div className="flex justify-center h-screen bg-gray-200 overflow-hidden">
            <div className="w-full max-w-[375px] bg-gray-50 flex flex-col shadow-2xl h-full overflow-hidden relative">
                {/* Scrollable Content Area */}
                <div className={clsx("flex-1 overflow-y-auto hide-scrollbar bg-gray-50", !hideNav && "pb-20")}>
                    <Outlet />
                    {/* Safe padding at bottom for content if needed */}
                    {!hideNav && <div className="h-6"></div>}
                </div>

                {/* Fixed Bottom Navigation (Fixed position for H5 sync) */}
                {!hideNav && (
                    <div className="fixed bottom-0 w-full max-w-[375px] h-20 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-start pt-3 justify-around z-40 px-4">
                        <NavLink to="/" className={({ isActive }) => clsx("flex flex-col items-center transition-colors", isActive ? "text-purple-600" : "text-gray-400")}>
                            {({ isActive }) => (
                                <>
                                    <Home size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] mt-1">首页</span>
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/discover" className={({ isActive }) => clsx("flex flex-col items-center transition-colors", isActive ? "text-purple-600" : "text-gray-400")}>
                            {({ isActive }) => (
                                <>
                                    <Compass size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] mt-1">发现</span>
                                </>
                            )}
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => clsx("flex flex-col items-center transition-colors", isActive ? "text-purple-600" : "text-gray-400")}>
                            {({ isActive }) => (
                                <>
                                    <User size={24} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="text-[10px] mt-1">我的</span>
                                </>
                            )}
                        </NavLink>
                    </div>
                )}

                {/* Mobile Safe Area Bar (Decorative) */}
                <div className="fixed bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-900/10 rounded-full z-50 pointer-events-none"></div>
            </div>
        </div>
    );
}
