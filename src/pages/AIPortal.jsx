import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, ArrowRight, Zap, Image as ImageIcon, Heart, ArrowLeft, Star, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPortal() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'drawing',
            title: 'AI 艺术工坊',
            desc: '构建超现实主义视觉窗口，将灵感粒子聚变为永恒画卷。支持 4K 原生画质与多风格引擎渲染。',
            icon: <ImageIcon size={28} className="text-white" />,
            bgColor: 'bg-[#6366f1]',
            shadowColor: 'shadow-indigo-500/20',
            tag: 'Visual Intelligence',
            path: '/ai/image',
            features: ['4K Render', 'Prompt Engine', 'Style Fusion']
        },
        {
            id: 'chat',
            title: '智能智库',
            desc: '您的多维思考伙伴。深度逻辑拆解、多语言流利切换，为您的创作提供源源不断的智慧潮汐。',
            icon: <MessageSquare size={28} className="text-white" />,
            bgColor: 'bg-[#3b82f6]',
            shadowColor: 'shadow-blue-500/20',
            tag: 'Linguistic Logic',
            path: '/ai/chat',
            features: ['Deep Thinking', 'Code Assist', 'Creative Writing']
        }
    ];

    return (
        <div className="bg-[#fcfcfd] min-h-screen pb-24 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />

            {/* Header / Nav */}
            <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-100/50 px-6 py-4 flex items-center justify-between">
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 group cursor-pointer active:scale-95 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 transition-colors">Back to Hub</span>
                </div>
                <div className="w-8 h-8 rounded-full border border-gray-100 overflow-hidden shadow-sm">
                    <img src="https://i.pravatar.cc/100?u=qutu" alt="user" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="px-6 pt-12">
                {/* Hero Section */}
                <div className="mb-14 max-w-lg mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full mb-6"
                    >
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Next Era of Creation</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-[40px] leading-[1.1] font-black text-gray-900 tracking-[-0.04em]"
                    >
                        释放<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">纯粹灵感</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-gray-400 text-sm mt-5 font-medium leading-relaxed"
                    >
                        基于多维神经网络引擎，打造跨时代的<br />
                        <span className="text-gray-800">智能创作与视觉实验室</span>
                    </motion.p>
                </div>

                {/* Portal Cards */}
                <div className="space-y-8 max-w-md mx-auto">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                            onClick={() => navigate(tool.path)}
                            className="group relative bg-white rounded-[40px] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 cursor-pointer overflow-hidden active:scale-[0.98] transition-all"
                        >
                            {/* Decorative Background Icon */}
                            <div className={`absolute -right-10 -bottom-10 opacity-[0.03] group-hover:scale-110 transition-transform duration-700`}>
                                {index === 0 ? <ImageIcon size={200} /> : <MessageSquare size={200} />}
                            </div>

                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className={`${tool.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${tool.shadowColor} group-hover:scale-110 transition-transform duration-500`}>
                                    {tool.icon}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 group-hover:text-gray-400 transition-colors mb-2">{tool.tag}</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map(dot => (
                                            <div key={dot} className="w-1 h-1 rounded-full bg-gray-100 group-hover:bg-indigo-200 transition-colors" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 mb-8">
                                <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:translate-x-1 transition-transform">{tool.title}</h2>
                                <p className="text-[13px] text-gray-400 leading-relaxed font-medium line-clamp-2 pr-6">
                                    {tool.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between relative z-10 pt-6 border-t border-gray-50">
                                <div className="flex gap-4">
                                    {tool.features.map(f => (
                                        <div key={f} className="flex items-center gap-1">
                                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{f}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-300">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center max-w-sm mx-auto"
                >
                    <div className="flex items-center justify-center gap-8 mb-8">
                        <div className="text-center">
                            <p className="text-[20px] font-black text-gray-900">4.9/5.0</p>
                            <div className="flex gap-0.5 justify-center mt-1">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={8} className="text-amber-400 fill-amber-400" />)}
                            </div>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-[20px] font-black text-gray-900">24/7</p>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Global Node API</p>
                        </div>
                        <div className="w-px h-8 bg-gray-100" />
                        <div className="text-center">
                            <div className="flex -space-x-1.5 justify-center mb-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-100 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?u=qutu-${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Active Creators</p>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-gray-900 rounded-3xl text-xs font-black text-white uppercase tracking-[0.3em] shadow-2xl shadow-gray-900/10 active:scale-95 transition-all">
                        Upgrade Pro Membership
                    </button>
            </div>
        </div>
        </div >
    );
}
