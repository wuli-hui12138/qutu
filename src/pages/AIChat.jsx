import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, User, Bot, Sparkles, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function AIChat() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('ai_chat_history');
        return saved ? JSON.parse(saved) : [
            { id: 1, role: 'assistant', content: '您好！我是您的 AI 创作助手，有什么我可以帮您的吗？' }
        ];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState(['gpt-4o', 'qwen-plus']);
    const [selectedModel, setSelectedModel] = useState('gpt-4o');
    const [showModelPicker, setShowModelPicker] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchModels();
    }, []);

    useEffect(() => {
        localStorage.setItem('ai_chat_history', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const fetchModels = async () => {
        try {
            const res = await fetch('/api/ai/models', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setModels(data.chatModels);
                if (data.chatModels.length > 0) setSelectedModel(data.chatModels[0]);
            }
        } catch (err) {
            console.error('Failed to fetch models');
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { id: Date.now(), role: 'user', content: input };
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
                setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.content }]);
            } else {
                throw new Error('Chat failed');
            }
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '抱歉，服务出现了一点问题，请稍后再试。' }]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm('确定要清空聊天记录吗？')) {
            setMessages([{ id: 1, role: 'assistant', content: '聊天已清空。您可以开始新的对话。' }]);
        }
    };

    return (
        <div className="bg-gray-50 h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <div className="pt-14 px-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                    <div className="relative">
                        <button
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 active:scale-95 transition-all"
                        >
                            <span className="text-xs font-bold text-gray-800">{selectedModel}</span>
                            <ChevronDown size={14} className={clsx("text-gray-400 transition-transform", showModelPicker && "rotate-180")} />
                        </button>

                        {showModelPicker && (
                            <div className="absolute top-10 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-40 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                {models.map(m => (
                                    <button
                                        key={m}
                                        onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                                        className={clsx(
                                            "w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-gray-50",
                                            selectedModel === m ? "text-purple-600 bg-purple-50/50" : "text-gray-600"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button onClick={clearHistory} className="text-[10px] font-bold text-gray-300 hover:text-gray-400">清空记录</button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                            msg.role === 'user' ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-500"
                        )}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={clsx(
                            "max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-100"
                                : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 shadow-sm">
                            <div className="flex gap-1.5 py-1">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 pb-8">
                <div className="max-w-4xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="想聊点什么..."
                        className="w-full pl-5 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 transition-all font-medium"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className={clsx(
                            "absolute right-2 top-2 bottom-2 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90",
                            input.trim() && !loading ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-300"
                        )}
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
