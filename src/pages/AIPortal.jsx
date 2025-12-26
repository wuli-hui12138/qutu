import { useNavigate } from 'react-router-dom';
import { MessageSquare, Image as ImageIcon, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIPortal() {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'drawing',
            title: 'AI 绘画助手',
            desc: '将您的创意转化为惊艳的视觉艺术',
            icon: <ImageIcon size={28} className="text-indigo-600" />,
            bgColor: 'bg-indigo-50',
            path: '/ai/image'
        },
        {
            id: 'chat',
            title: 'AI 智能对话',
            desc: '与全能助手探讨灵感与知识',
            icon: <MessageSquare size={28} className="text-emerald-600" />,
            bgColor: 'bg-emerald-50',
            path: '/ai/chat'
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-indigo-100">
            {/* Nav */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div
                    onClick={() => navigate('/')}
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-all border border-gray-200/50">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </div>
                    <h1 className="text-sm font-black tracking-tight text-gray-900">
                        QUTU <span className="text-indigo-600">STUDIO</span>
                    </h1>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-6 pt-20 pb-12">
                <header className="mb-16">
                    <h2 className="text-4xl font-black tracking-tight text-gray-900 mb-4">
                        探索 AI 的<br />
                        <span className="text-indigo-600">无限可能</span>
                    </h2>
                    <p className="text-gray-400 font-medium">简单几步，开启您的智能创作之旅</p>
                </header>

                <div className="space-y-6">
                    {tools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            whileHover={{ y: -4 }}
                            whileActive={{ scale: 0.98 }}
                            onClick={() => navigate(tool.path)}
                            className="group p-8 rounded-[32px] bg-gray-50 border border-gray-100 flex items-center gap-6 cursor-pointer hover:bg-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all"
                        >
                            <div className={`${tool.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0`}>
                                {tool.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.title}</h3>
                                <p className="text-sm text-gray-400 font-medium">{tool.desc}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all shadow-sm">
                                <ChevronRight size={20} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
