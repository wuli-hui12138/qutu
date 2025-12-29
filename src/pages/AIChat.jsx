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
    Globe,
    MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIChat() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState(['GPT-4o']);
    const [selectedModel, setSelectedModel] = useState('GPT-4o');
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const scrollRef = useRef(null);

    const suggestedPrompts = [
        { icon: <Code size={14} />, label: '代码助手', text: '请帮我优化这段代码的运行效率...' },
        { icon: <FileText size={14} />, label: '文案润色', text: '请将这段文字改写得更具有感染力...' },
        { icon: <Globe size={14} />, label: '语言翻译', text: '请将以下中文翻译成地道的英文口语...' }
    ];

    const abilityCards = [
        { title: '逻辑推理', desc: '深度拆解复杂逻辑问题', color: 'bg-blue-50 text-blue-700 border-blue-100' },
        { title: '创意写作', desc: '撰写从诗歌到公文的万能型文字', color: 'bg-purple-50 text-purple-700 border-purple-100' },
        { title: '专业编码', desc: '支持多语言代码生成与调试', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
    ];

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('/api/ai/models', { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.chatModels && data.chatModels.length > 0) {
                        setModels(data.chatModels);
                        setSelectedModel(data.chatModels[0]);
                    }
                }
            } catch (err) {
                console.error('Fetch models failed', err);
            }
        };
        fetchModels();
    }, []);

    useEffect(() => {
        if (selectedModel) {
            fetchHistory();
        }
    }, [selectedModel]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, streamingText]);

    const fetchHistory = async () => {
        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;
        if (!userId) return;

        try {
            const res = await fetch('/api/ai/chat-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, model: selectedModel })
            });
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

    const simulateStreaming = async (text) => {
        setStreamingText('');
        let currentText = '';
        for (let i = 0; i < text.length; i++) {
            currentText += text[i];
            setStreamingText(currentText);
            await new Promise(r => setTimeout(r, 20));
        }
        return currentText;
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
                const fullContent = data.content;
                await simulateStreaming(fullContent);
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: fullContent, time: new Date().toISOString() }]);
                setStreamingText('');
            } else {
                throw new Error('Chat failed');
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '抱歉，服务出现了一些问题，请稍后再试。', time: new Date().toISOString() }]);
        } finally {
            setLoading(false);
            setStreamingText('');
        }
    };

    const resetChat = () => {
        if (confirm('确定要开启新对话吗？')) {
            setMessages([]);
        }
    };

    return (
        <div className="bg-white h-screen text-gray-900 font-sans flex flex-col relative overflow-hidden">
            {/* Header */}
            <header className="flex-shrink-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div onClick={() => navigate('/ai')} className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200/50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </div>
                </div>

                {/* Model Switcher */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200/50 rounded-full cursor-pointer hover:bg-gray-100 transition-all select-none group shadow-sm"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
                            <span className="text-xs font-bold text-gray-700">{selectedModel}</span>
                            <ChevronDown size={14} className={clsx("text-gray-400 group-hover:text-gray-600 transition-transform", showModelPicker && "rotate-180")} />
                        </div>

                        <AnimatePresence>
                            {showModelPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-12 left-1/2 -translate-x-1/2 bg-white border border-gray-100 rounded-[20px] py-2 w-52 z-50 shadow-2xl shadow-gray-200/50"
                                >
                                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">选择智能模型</p>
                                    {models.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                                            className={clsx(
                                                "w-full text-left px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between group",
                                                selectedModel === m ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"
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

                <div className="flex items-center gap-2">
                    <button onClick={resetChat} className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <PlusCircle size={20} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                        <HistoryIcon size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center ml-2">
                        <User size={16} className="text-indigo-600" />
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth bg-gray-50/50">
                <div className="max-w-3xl mx-auto">
                    {messages.length === 0 && !streamingText ? (
                        <div className="py-12 space-y-10">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-[24px] bg-white border border-gray-100 flex items-center justify-center mx-auto shadow-sm">
                                    <Sparkles size={32} className="text-indigo-600" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">有什么可以帮您？</h2>
                                <p className="text-gray-400 text-sm font-medium italic">选择一个场景开始对话，或者直接向我提问</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {abilityCards.map((card, idx) => (
                                    <div key={idx} className={clsx("p-6 rounded-[24px] border transition-all cursor-default", card.color)}>
                                        <h3 className="font-bold text-sm mb-1">{card.title}</h3>
                                        <p className="text-[12px] opacity-80 leading-relaxed">{card.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-32">
                            {messages.map((msg, idx) => (
                                <div key={msg.id || idx} className={clsx("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                    <div className={clsx(
                                        "w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all mt-1",
                                        msg.role === 'user' ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-gray-100 text-indigo-600"
                                    )}>
                                        {msg.role === 'user' ? <User size={16} /> : <Zap size={16} className="fill-indigo-600" />}
                                    </div>
                                    <div className={clsx("flex flex-col max-w-[85%]", msg.role === 'user' ? "items-end" : "items-start")}>
                                        <div className={clsx(
                                            "p-4 px-5 rounded-[24px] text-[15px] leading-[1.6] font-medium shadow-sm border transition-all",
                                            msg.role === 'user'
                                                ? "bg-indigo-600 text-white rounded-tr-none border-indigo-600"
                                                : "bg-white text-gray-800 rounded-tl-none border-gray-100"
                                        )}>
                                            {msg.content}
                                        </div>

                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-1 mt-2 -ml-1">
                                                {[
                                                    { icon: <Copy size={13} />, label: '复制' },
                                                    { icon: <RefreshCw size={13} />, label: '重试' },
                                                    { icon: <Volume2 size={13} />, label: '朗读' },
                                                    { icon: <ThumbsUp size={13} />, label: '有用' },
                                                    { icon: <ThumbsDown size={13} />, label: '没用' }
                                                ].map((action, i) => (
                                                    <button key={i} className="p-2 rounded-lg text-gray-300 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                                        {action.icon}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Streaming/Loading State */}
                            {(loading || streamingText) && (
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 mt-1 shadow-sm">
                                        <Zap size={16} className="fill-indigo-600" />
                                    </div>
                                    <div className="flex flex-col max-w-[85%]">
                                        <div className="p-4 px-5 rounded-[24px] rounded-tl-none text-[15px] leading-[1.6] font-medium bg-white text-gray-800 border border-gray-100 shadow-sm min-w-[50px]">
                                            {streamingText || (
                                                <div className="flex gap-1 py-1 px-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-75" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse delay-150" />
                                                </div>
                                            )}
                                            {streamingText && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse align-middle" />}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Input Section */}
            <div className="flex-shrink-0 p-6 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Prompt Capsules */}
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                        {suggestedPrompts.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(p.text)}
                                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 hover:border-gray-200 transition-all text-xs font-bold text-gray-500"
                            >
                                {p.icon}
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative flex items-center gap-2 bg-gray-50 border border-gray-200/50 rounded-[28px] p-2 focus-within:bg-white focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-50 shadow-sm transition-all">
                        <button className="p-3 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                            <Plus size={22} />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="交流灵感，探索未知..."
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium py-3 text-gray-900 placeholder:text-gray-300"
                        />

                        <div className="flex items-center gap-1">
                            <button className="p-3 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-white transition-all">
                                <Mic size={22} />
                            </button>
                            <button
                                onClick={() => handleSend()}
                                disabled={!input.trim() || loading}
                                className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md",
                                    input.trim() && !loading
                                        ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                )}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck size={12} /> 端到端加密
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sparkles size={12} /> 神经元链接就绪
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
