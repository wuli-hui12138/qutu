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
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] pointer-events-none overflow-hidden">
            {/* 1. Dynamic Ambilight 2.0 - Environment Glow synced with wallpaper */}
            <div className="absolute inset-0 z-0">
                <img
                    src={imageSrc}
                    className="w-full h-full object-cover blur-[140px] opacity-40 scale-125 transition-all duration-1000"
                    alt=""
                />
            </div>

            {/* 2. Main Stage - Floating Canvas */}
            <div className="relative z-10 w-full max-w-[85vw] flex flex-col items-center">

                {/* Visual Depth Wrapper */}
                <motion.div
                    initial={{ scale: 1.1, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full aspect-[16/9] flex flex-col items-center"
                >
                    {/* Shadow & Glow Base */}
                    <div className="absolute inset-0 bg-black/40 blur-[80px] -translate-y-4 scale-[0.98]"></div>

                    {/* 3. The Monitor - Precision Engineered Frame */}
                    <div className="relative w-full h-full p-[1.5px] bg-gradient-to-tr from-white/10 via-transparent to-white/5 rounded-[32px] overflow-hidden shadow-[0_45px_100px_-20px_rgba(0,0,0,0.9)]">
                        {/* Screen Gasket */}
                        <div className="w-full h-full rounded-[31px] bg-[#0c0c0c] p-2">
                            {/* Inner Screen Bezel */}
                            <div className="w-full h-full rounded-[24px] bg-black overflow-hidden relative border border-white/5">
                                <img src={imageSrc} className="w-full h-full object-cover select-none" alt="" />

                                {/* 4. Surface Refinement - Screen Glare & Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] pointer-events-none"></div>
                                <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>

                                {/* 5. Minimalist OS Layer - Integrated Dock */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-fit h-12 bg-white/[0.08] backdrop-blur-[30px] rounded-[20px] border border-white/10 flex items-center px-5 gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                                    {/* Start Glyph */}
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mr-1">
                                        <div className="grid grid-cols-2 gap-0.5 scale-90">
                                            <div className="w-2.5 h-2.5 bg-blue-400 rounded-sm shadow-sm"></div>
                                            <div className="w-2.5 h-2.5 bg-blue-300 rounded-sm"></div>
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm"></div>
                                            <div className="w-2.5 h-2.5 bg-blue-200 rounded-sm"></div>
                                        </div>
                                    </div>

                                    {/* App Symbols - Minimalists */}
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1 group">
                                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-110 ${['from-orange-400 to-red-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-purple-400 to-pink-500'][i]
                                                } opacity-80 shadow-md`}></div>
                                            {i === 1 && <div className="w-1 h-1 bg-white/60 rounded-full"></div>}
                                        </div>
                                    ))}

                                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                                    {/* Tray Info */}
                                    <div className="flex flex-col items-end pr-1">
                                        <span className="text-[10px] font-bold text-white/60 tracking-tighter leading-none">19:24</span>
                                        <span className="text-[7px] font-black text-white/30 tracking-tight mt-0.5 uppercase">Reference</span>
                                    </div>
                                </div>

                                {/* Status HUD */}
                                <div className="absolute top-6 left-6 flex items-center gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">4K HDR PURE VIEW</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 6. Contextual Signature */}
            <div className="absolute bottom-8 right-10 flex flex-col items-end gap-1 opacity-20">
                <div className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Canvas Edition</div>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
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
