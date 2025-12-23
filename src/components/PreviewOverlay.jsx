import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, User, Search, Battery, Wifi, Signal } from 'lucide-react';

export default function PreviewOverlay({ type, imageSrc, onClose }) {
    const renderMobileOverlay = () => (
        <div className="relative w-full h-full flex flex-col pointer-events-none">
            {/* iOS Notch/Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-[20px] z-[100] flex items-center justify-around px-2 border border-white/5">
                <div className="w-2.5 h-2.5 bg-[#0f0f0f] rounded-full border border-white/5 shadow-inner"></div>
                <div className="w-12 h-1 bg-white/5 rounded-full"></div>
            </div>

            {/* Status Bar */}
            <div className="flex justify-between items-center px-10 pt-5 text-white/95 z-50">
                <span className="text-[13px] font-black tracking-tight">14:53</span>
                <div className="flex items-center gap-1.5 opacity-90">
                    <Signal size={14} strokeWidth={3} />
                    <Wifi size={14} strokeWidth={3} />
                    <div className="relative w-6 h-3 border-2 border-white/30 rounded-[4px] flex items-center px-0.5">
                        <div className="bg-white h-1.5 w-3 rounded-[1px]"></div>
                        <div className="absolute -right-1.5 w-1 h-1.5 bg-white/30 rounded-r-sm"></div>
                    </div>
                </div>
            </div>

            {/* iOS Lock Screen Time/Date */}
            <div className="mt-16 flex flex-col items-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                <span className="text-[84px] font-bold tracking-tight leading-none mb-2" style={{ fontFamily: 'system-ui' }}>14:53</span>
                <span className="text-[19px] font-bold opacity-90" style={{ fontFamily: 'system-ui' }}>12月23日 星期二</span>
            </div>

            {/* Bottom Controls (Flashlight/Camera) */}
            <div className="mt-auto mb-14 px-12 flex justify-between items-center z-50 w-full">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/20">
                    <div className="w-5 h-5 bg-white rounded-full opacity-80"></div>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-3xl rounded-full flex items-center justify-center border border-white/20">
                    <div className="w-6 h-5 bg-white rounded-md opacity-80"></div>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/90 rounded-full z-[100]"></div>
        </div>
    );

    const renderPCOverlay = () => (
        <div className="relative w-full h-full p-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm pointer-events-none">
            {/* Ultra-Premium Monitor Frame */}
            <div className="relative w-full max-w-5xl aspect-[16/9] bg-black border-[14px] border-[#121212] rounded-[24px] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7)] flex flex-col ring-1 ring-white/5 overflow-hidden">
                {/* Screen Content */}
                <div className="relative flex-1 overflow-hidden bg-[#000]">
                    <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover" />

                    {/* Glassmorphic Taskbar (Windows 11 Style) */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[98%] h-11 bg-white/10 backdrop-blur-3xl rounded-xl border border-white/5 flex items-center px-4 justify-between shadow-2xl overflow-hidden group">
                        {/* Start Menu & Tray Area (Decorative) */}
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 text-white/40">
                                <Search size={14} />
                            </div>
                        </div>

                        {/* Centered App Icons */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 py-1">
                            {/* Windows Start Button */}
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center hover:bg-indigo-500/40 transition-colors">
                                <div className="grid grid-cols-2 gap-0.5 transform rotate-45 scale-75">
                                    <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-blue-300 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                                    <div className="w-2.5 h-2.5 bg-blue-200 rounded-sm"></div>
                                </div>
                            </div>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center justify-center">
                                    <div className={`w-4 h-4 rounded-sm bg-gradient-to-br ${['from-orange-400 to-red-500', 'from-blue-400 to-indigo-500', 'from-green-400 to-teal-500', 'from-yellow-300 to-orange-400', 'from-purple-400 to-pink-500', 'from-gray-300 to-gray-500'][i]} opacity-80 shadow-sm`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Right System Tray */}
                        <div className="flex items-center gap-3 text-[10px] font-bold text-white/50 tracking-tighter cursor-default">
                            <div className="flex items-center gap-2 pr-2 border-r border-white/5">
                                <Signal size={12} strokeWidth={2.5} />
                                <Wifi size={12} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col items-end leading-[1.1]">
                                <span>15:38</span>
                                <span className="text-[8px] opacity-60">2025/12/23</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Widgets Area (Subtle) */}
                    <div className="absolute top-8 left-8 flex flex-col gap-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-4 flex flex-col justify-between">
                            <div className="w-6 h-6 bg-yellow-400/80 rounded-full"></div>
                            <div className="text-white/80 font-black text-xs">24°C</div>
                        </div>
                    </div>
                </div>

                {/* Monitor Bottom Bezel with Logo Placeholder */}
                <div className="h-4 bg-[#121212] flex items-center justify-center">
                    <div className="w-3 h-3 bg-white/5 rounded-full ring-1 ring-white/10"></div>
                </div>
            </div>

            {/* Monitor Premium Stand */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-gradient-to-b from-[#181818] to-[#080808] rounded-t-[40px] z-[-1] border-x border-white/5"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-3 bg-black/60 rounded-full blur-xl"></div>
        </div>
    );

    const renderAvatarOverlay = () => (
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
            <div className="flex flex-col gap-12 items-center">
                {/* Circular */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-2xl overflow-hidden ring-8 ring-indigo-500/20">
                        <img src={imageSrc} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">圆形头像</span>
                </div>
                {/* Square */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-2xl overflow-hidden ring-8 ring-white/10">
                        <img src={imageSrc} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">方形头像</span>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
        >
            {/* Background Image (Not for PC Monitor style which has its own) */}
            {type !== 'pc' && <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover opacity-100" />}

            {/* Overlay Content */}
            <div className="relative z-10 w-full h-full">
                {type === 'mobile' && renderMobileOverlay()}
                {type === 'pc' && renderPCOverlay()}
                {type === 'avatar' && renderAvatarOverlay()}
            </div>

            {/* Controls */}
            <div className="absolute top-12 right-6 z-50 flex items-center gap-3">
                <button
                    onClick={onClose}
                    className="h-10 px-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-white text-xs font-black uppercase tracking-widest active:scale-90 transition"
                >
                    关闭预览
                </button>
            </div>
        </motion.div>
    );
}
