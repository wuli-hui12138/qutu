import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, ArrowRight, Image as ImageIcon, ArrowLeft, Star, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPortal() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'drawing',
            title: '视觉创作实验室',
            desc: '突破次元壁的视觉引擎。将语言粒子重构为超现实影像。',
            icon: <ImageIcon size={24} />,
            color: 'from-indigo-500 to-purple-500',
            path: '/ai/image',
            tag: 'Visual Intelligence'
        },
        {
            id: 'chat',
            title: '智算对话中心',
            desc: '探索通用人工智能的边界。深度逻辑链条与多维知识图谱。',
            icon: <MessageSquare size={24} />,
            color: 'from-blue-500 to-cyan-500',
            path: '/ai/chat',
            tag: 'Neural Logic'
        }
    ];

    return (
        <div className="bg-[#050505] min-h-screen text-white selection:bg-indigo-500/30 font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Nav */}
            <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/5 px-8 py-5 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-4 group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">返回控制台</p>
                        <p className="text-sm font-bold tracking-tight">QUTU <span className="text-indigo-500">STUDIO</span></p>
                    </div>
                </motion.div>

                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">系统负载: 极低</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden ring-4 ring-white/5">
                        <img src="https://i.pravatar.cc/100?u=qutu" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-8 py-20 relative z-10">
                {/* Hero Section */}
                <div className="max-w-2xl mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full mb-8"
                    >
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">人工智能实验室 V4.0</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-6xl sm:text-7xl font-black tracking-[-0.05em] leading-[0.9] mb-8"
                    >
                        探索<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">无限可能</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-lg text-white/40 font-medium leading-relaxed max-w-lg"
                    >
                        深度集成多维神经网络模型，为您构建沉浸式的<br />
                        <span className="text-white">次世代内容创作生态。</span>
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            onClick={() => navigate(tool.path)}
                            className="group relative bg-[#111] border border-white/5 rounded-[40px] p-10 cursor-pointer overflow-hidden hover:border-white/20 transition-all active:scale-[0.98]"
                        >
                            {/* Card Glow */}
                            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-700`} />

                            <div className="relative z-10 flex justify-between items-start mb-12">
                                <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                                    {tool.icon}
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-white/40 transition-colors">{tool.tag}</span>
                                    <div className="flex gap-1 justify-end mt-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white" />)}
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 mb-10">
                                <h2 className="text-3xl font-black mb-4 tracking-tight group-hover:translate-x-2 transition-transform">{tool.title}</h2>
                                <p className="text-white/40 text-sm leading-relaxed font-medium line-clamp-2">{tool.desc}</p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">实验室状态: 就绪</span>
                                </div>
                                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Banner */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 pt-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12"
                >
                    <div className="flex items-center gap-16">
                        <div>
                            <p className="text-3xl font-black">4.9/5</p>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-2 text-center md:text-left">用户满意度</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">2.4M+</p>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-2 text-center md:text-left">生成的作品</p>
                        </div>
                    </div>

                    <button className="px-10 py-5 bg-white text-black text-xs font-black uppercase tracking-[0.3em] rounded-full hover:bg-white/90 active:scale-95 transition-all">
                        升级至 STUDIO PRO
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
