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
        <div className="relative w-full h-full p-12 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm pointer-events-none">
            {/* Monitor Frame */}
            <div className="relative w-full max-w-4xl aspect-[16/9] bg-black border-[12px] border-[#1a1a1a] rounded-[20px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                {/* Screen Content */}
                <div className="relative flex-1 overflow-hidden">
                    <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover" />

                    {/* Desktop Icons */}
                    <div className="absolute inset-0 p-6 flex flex-col gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 w-12 group">
                                <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded border border-white/10"></div>
                                <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                            </div>
                        ))}
                    </div>

                    {/* Taskbar */}
                    <div className="absolute bottom-0 w-full h-10 bg-black/60 backdrop-blur-3xl border-t border-white/5 flex items-center px-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-white/20 rounded-[2px] rotate-45"></div>
                            <div className="w-24 h-6 bg-white/10 rounded-full flex items-center px-3 gap-2">
                                <Search size={10} className="text-white/40" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">
                            <div className="flex flex-col items-end">
                                <span>14:53</span>
                                <span>2025-12-23</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monitor Stand */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-14 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-t-xl z-[-1]"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-[#050505] rounded-full blur-[1px]"></div>
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
