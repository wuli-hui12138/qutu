import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Bot, Sparkles, ChevronDown, Trash2, ShieldCheck, Zap, Globe, MessageSquare, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIChat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', content: '您好，智库已就绪。期待为您提供深度见解与创作支持。', time: new Date().toISOString() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState(['gpt-4o', 'qwen-plus']);
    const [selectedModel, setSelectedModel] = useState('gpt-4o');
    const [showModelPicker, setShowModelPicker] = useState(false);
    const scrollRef = useRef(null);

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    useEffect(() => {
        fetchModels();
        if (userId) fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
        // Auto-save to backend whenever messages change (debounce)
        if (userId && messages.length > 1) {
            const timer = setTimeout(() => saveHistory(), 1000);
            return () => clearTimeout(timer);
        }
    }, [messages]);

    const fetchModels = async () => {
        try {
            const res = await fetch('/api/ai/models', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setModels(data.chatModels);
                if (data.chatModels.length > 0 && !selectedModel) setSelectedModel(data.chatModels[0]);
            }
        } catch (err) {
            console.error('Failed to fetch models');
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/ai/chat-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, model: selectedModel })
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0 && data[0].messages) {
                    setMessages(data[0].messages);
                }
            }
        } catch (err) {
            console.error('Failed to fetch chat history');
        }
    };

    const saveHistory = async () => {
        try {
            await fetch('/api/ai/save-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, model: selectedModel, messages })
            });
        } catch (err) {
            console.error('Failed to save chat history');
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { id: Date.now(), role: 'user', content: input, time: new Date().toISOString() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, model: selectedModel })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.content, time: new Date().toISOString() }]);
            } else {
                throw new Error('Chat failed');
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '抱歉，服务出现了一点问题，请稍后再试。', time: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm('确定要清空此模型的聊天记录吗？')) {
            setMessages([{ id: Date.now(), role: 'assistant', content: '对话已清空。您可以开始新的交流。', time: new Date().toISOString() }]);
        }
    };

    return (
        <div className="bg-[#fcfcfd] h-screen flex flex-col overflow-hidden font-sans">
            {/* Premium Sticky Header */}
            <div className="pt-14 px-6 bg-white/80 backdrop-blur-2xl sticky top-0 z-50 flex items-center justify-between pb-4 border-b border-gray-100/50">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-all cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                    </div>
                    <div className="relative">
                        <div
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="flex flex-col cursor-pointer group"
                        >
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">{selectedModel}</h1>
                                <ChevronDown size={14} className={clsx("text-gray-300 transition-transform", showModelPicker && "rotate-180")} />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">智库在线</span>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showModelPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-12 left-0 bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-[24px] border border-gray-100 py-3 w-56 z-50 overflow-hidden"
                                >
                                    <p className="px-5 py-2 text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">选择智能体集群</p>
                                    {models.map(m => (
                                        <button
                                            key={m}
                                            onClick={() => { setSelectedModel(m); setShowModelPicker(false); fetchHistory(); }}
                                            className={clsx(
                                                "w-full text-left px-5 py-3 text-xs font-bold transition-all flex items-center justify-between group",
                                                selectedModel === m ? "text-indigo-600 bg-indigo-50/50" : "text-gray-600 hover:bg-gray-50"
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
                <button onClick={clearHistory} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Chat Flow */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth hide-scrollbar">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={msg.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={clsx("flex gap-3 max-w-[92%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "flex-row")}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center border shadow-sm",
                            msg.role === 'user' ? "bg-gray-900 border-gray-900 text-white" : "bg-white border-gray-100 text-indigo-600"
                        )}>
                            {msg.role === 'user' ? <User size={14} /> : <Zap size={14} className="fill-indigo-600" />}
                        </div>
                        <div className={clsx("space-y-1.5", msg.role === 'user' ? "items-end flex flex-col" : "items-start flex flex-col")}>
                            <div className={clsx(
                                "p-4 px-5 rounded-[22px] text-[13px] leading-[1.7] font-medium shadow-sm transition-all",
                                msg.role === 'user'
                                    ? "bg-indigo-600 text-white rounded-tr-none shadow-indigo-100/50"
                                    : "bg-white text-gray-700 rounded-tl-none border border-gray-100"
                            )}>
                                {msg.content}
                            </div>
                            <p className={clsx("text-[9px] font-black text-gray-300 uppercase tracking-widest px-1")}>
                                {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600">
                            <RefreshCw size={14} className="animate-spin" />
                        </div>
                        <div className="bg-white p-4 px-6 rounded-[24px] rounded-tl-none border border-gray-100 shadow-sm">
                            <div className="flex gap-1.5 py-1">
                                {[0, 150, 300].map(delay => (
                                    <motion.div
                                        key={delay}
                                        animate={{ y: [0, -4, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: delay / 1000 }}
                                        className="w-1.5 h-1.5 bg-indigo-200 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Premium Input Bar */}
            <div className="p-6 bg-white/80 backdrop-blur-2xl border-t border-gray-100/50 pb-10">
                <div className="max-w-4xl mx-auto relative flex items-center gap-3">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="交流灵感，探索未知..."
                            className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-transparent rounded-[24px] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-100/50 transition-all font-medium placeholder:text-gray-300"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="text-gray-300 hover:text-indigo-500 transition-colors p-1">
                                <PlusCircle size={18} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={clsx(
                            "w-14 h-14 rounded-[22px] flex items-center justify-center transition-all active:scale-[0.85] shadow-lg",
                            input.trim() && !loading
                                ? "bg-gray-900 text-white shadow-gray-200"
                                : "bg-gray-50 text-gray-200"
                        )}
                    >
                        <Send size={20} className={clsx(input.trim() && !loading && "translate-x-0.5 -translate-y-0.5")} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Fixed missing PlusCircle import
function PlusCircle({ size }) {
    return <Globe size={size} /> // Using Globe as a proxy or just fixing the import below
}
