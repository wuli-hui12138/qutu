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
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#0a0a0c] pointer-events-none overflow-hidden">
            {/* Ambient Background - Enhanced Dynamic Glow */}
            <div className="absolute inset-0 z-0">
                <img
                    src={imageSrc}
                    className="w-full h-full object-cover blur-[160px] opacity-40 scale-125 transition-all duration-1000"
                    alt=""
                />
            </div>

            {/* Main Stage - The Monitor */}
            <div className="relative z-10 w-full max-w-[98vw] flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[16/9] bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-600 rounded-[14px] p-[1.5px] shadow-[0_45px_140px_-20px_rgba(0,0,0,1)]"
                >
                    {/* Premium Metallic Edge (Silver/Aluminum feel) */}
                    <div className="w-full h-full rounded-[13px] bg-black p-[6px] shadow-inner ring-1 ring-white/10">
                        {/* Inner Screen Area - 100% Pure Wallpaper */}
                        <div className="w-full h-full rounded-[8px] overflow-hidden relative bg-zinc-950">
                            <img src={imageSrc} className="w-full h-full object-cover select-none" alt="Current Wallpaper" />

                            {/* Subtle Screen Texture/Reflection - Optional but adds quality without covering */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.05] pointer-events-none"></div>
                        </div>
                    </div>

                    {/* Monitor Bottom Brand/Sensor Detail (Minimal) */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/5 rounded-full blur-[0.5px]"></div>
                </motion.div>

                {/* Minimal Monitor Stand Silhouette */}
                <div className="mt-2 w-32 h-4 bg-gradient-to-b from-[#111] to-black rounded-t-xl border-x border-white/5 opacity-40"></div>
                <div className="w-64 h-1.5 bg-black/40 rounded-full blur-xl"></div>
            </div>

            {/* Edition Tag */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.8em]">Pure Display Mode</span>
            </div>
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
