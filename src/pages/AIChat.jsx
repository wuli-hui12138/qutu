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
    Command,
    Plus,
    Mic,
    Copy,
    RefreshCw,
    Volume2,
    ThumbsUp,
    ThumbsDown,
    PlusCircle,
    History as HistoryIcon,
    Code,
    FileText,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIChat() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState('GPT-4o');
    const [showModelPicker, setShowModelPicker] = useState(false);
    const scrollRef = useRef(null);

    const models = ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'DeepSeek-V2'];

    const suggestedPrompts = [
        { icon: <Code size={14} />, label: '代码助手', text: '请帮我优化这段代码的运行效率...' },
        { icon: <FileText size={14} />, label: '文案润色', text: '请将这段文字改写得更具有感染力...' },
        { icon: <Globe size={14} />, label: '语言翻译', text: '请将以下中文翻译成地道的英文口语...' }
    ];

    const abilityCards = [
        { title: '逻辑推理', desc: '深度拆解复杂逻辑问题', color: 'from-blue-500/20 to-indigo-500/20' },
        { title: '创意写作', desc: '撰写从诗歌到公文的万能型文字', color: 'from-purple-500/20 to-pink-500/20' },
        { title: '专业编码', desc: '支持多语言代码生成与调试', color: 'from-emerald-500/20 to-teal-500/20' }
    ];

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
                    setMessages([]);
                }
            }
        } catch (err) {
            console.error('Fetch history failed', err);
        }
    };

    const handleSend = async (customText) => {
        const textToSend = customText || input;
        if (!textToSend.trim() || loading) return;

        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;

        const userMsg = { id: Date.now(), role: 'user', content: textToSend, time: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: textToSend, model: selectedModel, userId })
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

    const resetChat = () => {
        if (confirm('确定要开启新对话吗？当前对话将被重置。')) {
            setMessages([]);
        }
    };

    return (
        <div className="bg-[#050505] h-screen text-white font-sans flex flex-col relative overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Sticky Header */}
            <header className="flex-shrink-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div onClick={() => navigate('/ai')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
                        <ArrowLeft size={16} />
                    </div>
                </div>

                {/* Model Switcher (Centered) */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full cursor-pointer hover:border-white/20 transition-all select-none group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            <span className="text-xs font-black uppercase tracking-wider">{selectedModel}</span>
                            <ChevronDown size={12} className={clsx("text-white/20 group-hover:text-white/60 transition-transform", showModelPicker && "rotate-180")} />
                        </div>

                        <AnimatePresence>
                            {showModelPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 rounded-[24px] py-3 w-56 z-50 shadow-2xl backdrop-blur-3xl"
                                >
                                    <p className="px-5 py-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">切换推理引擎</p>
                                    {models.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                                            className={clsx(
                                                "w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between group",
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

                <div className="flex items-center gap-3">
                    <button onClick={resetChat} className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        <PlusCircle size={14} /> 新对话
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        <HistoryIcon size={14} /> 历史记录
                    </button>
                </div>
            </header>

            {/* Chat Container */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-8 hide-scrollbar">
                <div className="max-w-3xl mx-auto">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-12 space-y-12"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                                    <Sparkles size={32} className="text-indigo-400" />
                                </div>
                                <h2 className="text-3xl font-black mb-2 tracking-tight">为您连接未来智能</h2>
                                <p className="text-white/30 text-sm font-medium">选择下方建议或直接输入，开启深度对话之旅</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {abilityCards.map((card, idx) => (
                                    <div key={idx} className={clsx("p-6 rounded-[32px] bg-gradient-to-br border border-white/5 hover:border-white/20 transition-all group", card.color)}>
                                        <h3 className="font-black text-sm mb-2">{card.title}</h3>
                                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="space-y-8 pb-40">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx("flex gap-5", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}
                                >
                                    <div className={clsx(
                                        "w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all mt-1",
                                        msg.role === 'user' ? "bg-white border-white text-black" : "bg-white/5 border-white/10 text-indigo-400"
                                    )}>
                                        {msg.role === 'user' ? <User size={16} /> : <Zap size={16} className="fill-indigo-400" />}
                                    </div>
                                    <div className={clsx("flex flex-col max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={clsx(
                                            "p-4 px-6 rounded-[28px] text-[14px] leading-[1.6] font-medium shadow-2xl transition-all",
                                            msg.role === 'user'
                                                ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10"
                                                : "bg-white/5 text-white/90 rounded-tl-none border border-white/5"
                                        )}>
                                            {msg.content}
                                        </div>

                                        {/* AI Bubble Actions */}
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-1 mt-3 px-2">
                                                {[
                                                    { icon: <Copy size={12} />, label: '复制' },
                                                    { icon: <RefreshCw size={12} />, label: '重新生成' },
                                                    { icon: <Volume2 size={12} />, label: '朗读' },
                                                    { icon: <ThumbsUp size={12} />, label: '好' },
                                                    { icon: <ThumbsDown size={12} />, label: '差' }
                                                ].map((action, i) => (
                                                    <button key={i} className="p-2.5 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all flex items-center gap-1.5">
                                                        {action.icon}
                                                        <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block">{action.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] mt-2 px-2">
                                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-5">
                                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <RefreshCw size={16} className="text-indigo-400 animate-spin" />
                                    </div>
                                    <div className="flex gap-1.5 items-center px-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Input Area */}
            <div className="flex-shrink-0 p-8 pt-0 z-10 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Prompt Capsules */}
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-2">
                        {suggestedPrompts.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(p.text)}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 hover:border-white/20 transition-all text-xs font-bold text-white/50 hover:text-white"
                            >
                                {p.icon}
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500/5 blur-3xl group-focus-within:bg-indigo-500/10 transition-all opacity-0 group-focus-within:opacity-100" />

                        <div className="relative bg-white/5 border border-white/10 rounded-[32px] p-2 flex items-center gap-2 focus-within:border-indigo-500/30 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all backdrop-blur-3xl">
                            <button className="p-3.5 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-all">
                                <Plus size={20} />
                            </button>

                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="输入您的问题，开启无限可能..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium py-3.5 placeholder:text-white/10"
                            />

                            <div className="flex items-center gap-1 pr-1">
                                <button className="p-3.5 rounded-full hover:bg-white/5 text-white/30 hover:text-white transition-all">
                                    <Mic size={20} />
                                </button>
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || loading}
                                    className={clsx(
                                        "w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-xl",
                                        input.trim() && !loading
                                            ? "bg-white text-black hover:scale-105 active:scale-95"
                                            : "bg-white/5 text-white/10 cursor-not-allowed"
                                    )}
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 pb-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={11} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.2em]">End-to-End Encryption</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles size={11} className="text-white/20" />
                            <span className="text-[9px] font-black text-white/15 uppercase tracking-[0.2em]">Neural Engine Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
