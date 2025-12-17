import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User } from 'lucide-react';
import clsx from 'clsx';

export default function MobileLayout() {
    const location = useLocation();
    const hideNav = location.pathname.includes('/detail');

    return (
        <div className="flex justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-[375px] bg-gray-50 relative flex flex-col shadow-2xl overflow-hidden min-h-screen">
                <div className="flex-1 overflow-y-auto hide-scrollbar pb-20">
                    <Outlet />
                </div>

                {!hideNav && (
                    <div className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-100 flex items-start pt-3 justify-around z-40">
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
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full z-50 pointer-events-none"></div>
            </div>
        </div>
    );
}
