import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, ArrowRight, Zap, Image as ImageIcon, Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPortal() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'drawing',
            title: 'AI 绘图',
            desc: '发挥无限想象，将文字转化为精美壁纸',
            icon: <ImageIcon size={32} className="text-purple-600" />,
            color: 'from-purple-500/10 to-indigo-500/10',
            borderColor: 'border-purple-100',
            tag: 'AIGC Art',
            path: '/ai/image'
        },
        {
            id: 'chat',
            title: 'AI 对话',
            desc: '灵感碰撞，您的全能创作助手',
            icon: <MessageSquare size={32} className="text-blue-600" />,
            color: 'from-blue-500/10 to-cyan-500/10',
            borderColor: 'border-blue-100',
            tag: 'Smart Chat',
            path: '/ai/chat'
        }
    ];

    return (
        <div className="bg-white min-h-screen pb-24 pt-16 px-6 overflow-y-auto hide-scrollbar">
            {/* Header / Nav */}
            <div className="flex items-center gap-4 mb-4">
                <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate('/')} />
                <span className="text-xs font-bold text-gray-400">返回首页</span>
            </div>

            {/* Hero Section */}
            <div className="mb-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-4"
                >
                    <Zap size={14} className="text-purple-600 fill-purple-600" />
                    <span className="text-[10px] font-bold text-purple-700 tracking-wider">NEXT GEN AI CENTER</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-black text-gray-900 tracking-tight"
                >
                    探索 AI 的<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">无限可能</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-xs mt-3 font-medium px-4"
                >
                    结合最先进的 AIGC 技术，为您提供专业的图像生成与智能对话体验
                </motion.p>
            </div>

            {/* Portal Cards */}
            <div className="space-y-6">
                {tools.map((tool, index) => (
                    <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() => navigate(tool.path)}
                        className={`group relative p-6 rounded-[32px] border ${tool.borderColor} bg-gradient-to-br ${tool.color} cursor-pointer active:scale-[0.98] transition-all`}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:shadow-md transition-shadow">
                                {tool.icon}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50">{tool.tag}</span>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">{tool.title}</h2>
                            <p className="text-xs text-gray-500 leading-relaxed max-w-[80%] font-medium">
                                {tool.desc}
                            </p>
                        </div>

                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-gray-900 group-hover:text-white transition-all">
                            <ArrowRight size={18} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Stats/Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 p-6 bg-gray-50 rounded-[24px] border border-gray-100 flex items-center justify-between"
            >
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Total Creations</p>
                    <p className="text-lg font-black text-gray-900">12,500+</p>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                        <Heart size={12} fill="white" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
