import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Send,
    ArrowLeft,
    Zap,
    User,
    Trash2,
    ChevronDown,
    ShieldCheck,
    Sparkles,
    Layers,
    MessageSquare,
    Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIChat() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: '您好。神经元链路已就绪。期待为您提供深度见解与跨维度创作支持。', time: new Date().toISOString() }
    ]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('GPT-4o');
    const [showModelPicker, setShowModelPicker] = useState(false);
    const scrollRef = useRef(null);

    const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'DeepSeek-V2'];

    useEffect(() => {
        fetchHistory();
    }, [selectedModel]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchHistory = async () => {
        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;
        if (!userId) return;

        try {
            const res = await fetch(`/api/ai/chat-history?userId=${userId}&model=${selectedModel}`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setMessages(data.map(m => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        time: m.createdAt
                    })));
                } else {
                    setMessages([{ id: Date.now(), role: 'assistant', content: `您好，我是 ${selectedModel}。请问今天有什么可以帮您的？`, time: new Date().toISOString() }]);
                }
            }
        } catch (err) {
            console.error('Fetch history failed', err);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;

        const userMsg = { id: Date.now(), role: 'user', content: input, time: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, model: selectedModel, userId })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.content, time: new Date().toISOString() }]);
            } else {
                throw new Error('Chat failed');
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '抱歉，神经元链路出现瞬时扰动，请稍后刷新重试。', time: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm('确定要清空此模型的对话记忆吗？')) {
            setMessages([{ id: Date.now(), role: 'assistant', content: '记忆已清除。您可以开始新的深度对话。', time: new Date().toISOString() }]);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/5 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div onClick={() => navigate('/ai')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
                        <ArrowLeft size={18} />
                    </div>

                    <div className="relative">
                        <div onClick={() => setShowModelPicker(!showModelPicker)} className="flex items-center gap-3 cursor-pointer group">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-0.5">多维智能集群</p>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-sm font-black tracking-tight uppercase">{selectedModel}</h1>
                                    <ChevronDown size={14} className={clsx("text-white/20 transition-transform", showModelPicker && "rotate-180")} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showModelPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-16 left-0 bg-[#111] border border-white/10 rounded-[32px] py-4 w-64 z-50 shadow-2xl backdrop-blur-3xl"
                                >
                                    <p className="px-6 py-2 text-[9px] font-black text-white/20 uppercase tracking-widest">选择逻辑核心</p>
                                    {models.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                                            className={clsx(
                                                "w-full text-left px-6 py-3.5 text-xs font-bold transition-all flex items-center justify-between group",
                                                selectedModel === m ? "text-indigo-400 bg-white/5" : "text-white/40 hover:bg-white/5"
                                            )}
                                        >
                                            {m}
                                            {selectedModel === m && <ShieldCheck size={14} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={clearHistory} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:border-red-400/20 transition-all">
                        <Trash2 size={18} />
                    </button>
                    <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden ring-4 ring-white/5">
                        <img src="https://i.pravatar.cc/100?u=qutu" alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-12 hide-scrollbar">
                <div className="max-w-3xl mx-auto space-y-10 pb-40">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={msg.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={clsx("flex gap-6", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                            >
                                <div className={clsx(
                                    "w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border transition-all",
                                    msg.role === 'user' ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-indigo-400"
                                )}>
                                    {msg.role === 'user' ? <User size={18} /> : <Zap size={18} className="fill-indigo-400" />}
                                </div>
                                <div className={clsx("flex flex-col max-w-[80%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                    <div className={clsx(
                                        "p-5 px-7 rounded-[32px] text-sm leading-relaxed font-medium shadow-2xl transition-all",
                                        msg.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10"
                                            : "bg-[#111] text-white/90 rounded-tl-none border border-white/5"
                                    )}>
                                        {msg.content}
                                    </div>
                                    <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] mt-3 px-2">
                                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6">
                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <RefreshCw size={18} className="text-indigo-400 animate-spin" />
                            </div>
                            <div className="flex gap-1.5 items-center px-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <div className="absolute bottom-0 inset-x-0 p-8 pt-0 pointer-events-none">
                <div className="max-w-3xl mx-auto relative pointer-events-auto">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent -top-24 -bottom-8 pointer-events-none" />

                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-2xl group-focus-within:bg-indigo-500/10 transition-all opacity-0 group-focus-within:opacity-100" />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="交流灵感，探索未知..."
                            className="w-full pl-8 pr-20 py-6 bg-white/5 border border-white/5 rounded-[32px] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all font-medium placeholder:text-white/10 backdrop-blur-3xl"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/5 order-last md:order-none">
                                <Command size={10} className="text-white/20" />
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter italic">Enter</span>
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                                    input.trim() && !loading
                                        ? "bg-white text-black hover:scale-105 active:scale-95"
                                        : "bg-white/5 text-white/10 cursor-not-allowed"
                                )}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 mt-6 pb-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={12} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">端到端加密</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={12} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">神经元就绪</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
