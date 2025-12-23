import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, User, Search, Battery, Wifi, Signal } from 'lucide-react';

export default function PreviewOverlay({ type, imageSrc, onClose }) {
    const renderMobileOverlay = () => (
        <div className="relative w-full h-full flex flex-col pointer-events-none">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-8 pt-4 text-white/90">
                <span className="text-xs font-bold">10:24</span>
                <div className="flex items-center gap-1.5">
                    <Signal size={12} />
                    <Wifi size={12} />
                    <Battery size={12} className="rotate-90" />
                </div>
            </div>

            {/* Date/Time */}
            <div className="mt-20 flex flex-col items-center text-white">
                <span className="text-6xl font-extralight tracking-tighter">10:24</span>
                <span className="text-sm font-medium mt-1 opacity-80">12月23日 星期二</span>
            </div>

            {/* Icons Grid */}
            <div className="mt-auto mb-28 px-6 grid grid-cols-4 gap-y-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center">
                            <div className="w-6 h-6 bg-white/30 rounded-lg"></div>
                        </div>
                        <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Dock */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] h-16 bg-white/20 backdrop-blur-xl rounded-[24px] border border-white/10 flex items-center justify-around px-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-white/30 rounded-xl"></div>
                ))}
            </div>
        </div>
    );

    const renderPCOverlay = () => (
        <div className="relative w-full h-full pointer-events-none flex flex-col lg:scale-100 scale-[0.6] origin-top">
            {/* Icons Column */}
            <div className="flex flex-col gap-6 p-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-16">
                        <div className="w-10 h-10 bg-white/20 border border-white/10 rounded flex items-center justify-center">
                            <div className="w-5 h-5 bg-white/40 rounded-sm"></div>
                        </div>
                        <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                    </div>
                ))}
            </div>

            {/* Taskbar */}
            <div className="mt-auto w-full h-12 bg-black/40 backdrop-blur-2xl border-t border-white/10 flex justify-between items-center px-4">
                <div className="flex items-center gap-4">
                    <div className="w-6 h-6 bg-white/40 rounded-sm rotate-45"></div>
                    <Search size={16} className="text-white/60" />
                    <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-7 h-7 bg-white/10 rounded-sm border border-white/5"></div>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-white/80 text-[10px] font-medium">
                    <div className="flex flex-col items-end leading-tight">
                        <span>10:24</span>
                        <span>2025/12/23</span>
                    </div>
                </div>
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
            {/* Background Image */}
            <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover opacity-100" />

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
