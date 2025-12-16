import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Download, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Detail() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleDownload = () => {
        setShowModal(true);
        // Auto hide after 3 seconds if needed, but prototype shows buttons
    };

    return (
        <div className="h-screen w-full bg-black relative flex flex-col">
            {/* 沉浸式顶部 */}
            <div className="absolute top-0 w-full pt-14 px-4 z-40 flex justify-between items-center pointer-events-none">
                <div
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer pointer-events-auto active:scale-95 transition"
                >
                    <ChevronLeft size={20} />
                </div>
                {/* Capsule Dark */}
                <div className="flex items-center justify-around w-20 h-8 bg-black/20 border border-white/20 rounded-full backdrop-blur-sm pointer-events-auto">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>

            {/* Fullscreen Image */}
            <div className="flex-1 w-full h-full relative">
                <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    className="w-full h-full object-cover"
                    alt="Detail"
                />

                {/* 底部渐变遮罩 */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end pb-10 px-5 pt-32">

                    {/* 作者信息 */}
                    <div className="flex items-center mb-6">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                        <div className="ml-3 text-shadow">
                            <p className="text-white text-sm font-bold">@Milad Fakurian</p>
                            <p className="text-gray-300 text-[10px] mt-0.5">发布于 2023-10-12</p>
                        </div>
                        <button className="ml-auto bg-purple-600 text-white text-xs px-4 py-1.5 rounded-full font-medium active:scale-95 transition">关注</button>
                    </div>

                    {/* 标签 */}
                    <div className="flex gap-2 mb-6">
                        <Tag text="#抽象艺术" />
                        <Tag text="#液体流体" />
                        <Tag text="#4K壁纸" />
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-white text-gray-900 h-12 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition"
                        >
                            <Download size={18} />
                            下载原图
                        </button>
                        <div className="flex gap-4">
                            <CircleBtn icon={<Heart size={20} />} activeColor="bg-red-500 border-none" />
                            <CircleBtn icon={<Share2 size={20} />} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Download Success Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 flex flex-col items-center w-72 relative z-10"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">保存成功</h3>
                            <p className="text-center text-gray-500 text-sm mb-6">图片已保存至系统相册，快去设置为壁纸吧！</p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 rounded-full border border-gray-200 text-gray-600 text-sm active:bg-gray-50"
                                >
                                    留在本页
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-2 rounded-full bg-purple-600 text-white text-sm active:bg-purple-700"
                                >
                                    继续浏览
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Tag({ text }) {
    return <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs">{text}</span>
}

function CircleBtn({ icon, activeColor }) {
    return (
        <button className={`w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-95 transition ${activeColor}`}>
            {icon}
        </button>
    )
}
