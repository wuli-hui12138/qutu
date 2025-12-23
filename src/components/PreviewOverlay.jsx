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
            {/* Ambient Background Glow (Dynamic feeling) */}
            <div
                className="absolute inset-0 opacity-20 blur-[120px] scale-150 transition-all duration-1000"
                style={{ background: `radial-gradient(circle at center, white, transparent)` }}
            ></div>

            {/* Main Perspective Container */}
            <div className="relative w-full max-w-6xl px-10 flex flex-col items-center" style={{ perspective: '1200px' }}>

                {/* 3D Monitor Frame */}
                <motion.div
                    initial={{ rotateX: 10, y: 40, opacity: 0 }}
                    animate={{ rotateX: 0, y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative w-full aspect-[16/9] bg-zinc-900 rounded-[32px] p-1.5 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
                >
                    {/* Screen Bezel */}
                    <div className="w-full h-full rounded-[26px] bg-black border-[12px] border-[#111] overflow-hidden relative shadow-inner">
                        <img src={imageSrc} className="w-full h-full object-cover select-none" alt="" />

                        {/* Realistic Screen Glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-30 pointer-events-none"></div>

                        {/* Ultra-Modern Windows Taskbar */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[98%] h-10 bg-black/20 backdrop-blur-2xl rounded-xl border border-white/5 flex items-center px-4 justify-between shadow-2xl overflow-hidden">
                            <div className="flex items-center gap-4">
                                <Search size={12} className="text-white/30" />
                            </div>

                            {/* Centered App Icons */}
                            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-0.5 scale-75">
                                        <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
                                        <div className="w-2 h-2 bg-blue-300 rounded-sm"></div>
                                        <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                                        <div className="w-2 h-2 bg-blue-200 rounded-sm"></div>
                                    </div>
                                </div>
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-7 h-7 rounded-lg hover:bg-white/10 transition-colors flex flex-col items-center justify-center relative">
                                        <div className={`w-3.5 h-3.5 rounded-sm bg-gradient-to-br ${['from-orange-400 to-red-500', 'from-blue-400 to-indigo-500', 'from-green-400 to-teal-500', 'from-yellow-300 to-orange-400', 'from-purple-400 to-pink-500'][i]} opacity-70`}></div>
                                        {i === 1 && <div className="absolute -bottom-0.5 w-1 h-0.5 bg-white/60 rounded-full"></div>}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 text-[9px] font-bold text-white/40 tracking-tight">
                                <div className="flex items-center gap-2 border-r border-white/5 pr-2">
                                    <Wifi size={10} />
                                    <Battery size={10} />
                                </div>
                                <div className="flex flex-col items-end leading-tight">
                                    <span>21:40</span>
                                    <span className="text-[7px] opacity-40">2025/12/23</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Desk Setup Elements (Minimalist) */}
                <div className="mt-8 w-full flex flex-col items-center">
                    {/* Monitor Neck */}
                    <div className="w-32 h-6 bg-gradient-to-b from-[#1a1a1c] to-[#0d0d0f] rounded-t-lg border-x border-white/5"></div>
                    {/* Monitor Base */}
                    <div className="w-64 h-2.5 bg-[#0d0d0f] rounded-full shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                    </div>
                </div>

                {/* Aesthetic Peripheral Silhouettes */}
                <div className="mt-12 flex items-center justify-center gap-40 opacity-10">
                    {/* Keyboard Silhouette Fragment */}
                    <div className="w-64 h-3 bg-white/20 rounded-full blur-[1px]"></div>
                    {/* Mouse Silhouette Fragment */}
                    <div className="w-10 h-10 bg-white/20 rounded-full blur-[1px]"></div>
                </div>
            </div>

            {/* Context Info Label */}
            <div className="absolute top-10 left-10 p-6 space-y-1">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Desktop Preview</p>
                <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">Pixel Perfection @ 4K Reference</p>
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
