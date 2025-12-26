import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Image as ImageIcon,
    RefreshCw,
    Download,
    Heart,
    Share2,
    ArrowLeft,
    Layers,
    Clock,
    Zap,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIGenerator() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('Stable Diffusion XL');
    const [tasks, setTasks] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const models = ['Stable Diffusion XL', 'Midjourney v6', 'DALL-E 3', 'Flux.1'];

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    const fetchTasks = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/ai/tasks?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
                if (data.length > 0 && !selectedTask) {
                    setSelectedTask(data[0]);
                }
            }
        } catch (err) {
            console.error('Fetch tasks failed', err);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || !userId) return;

        const activeTasks = tasks.filter(t => t.status === 'PROCESSING');
        if (activeTasks.length >= 4) {
            alert('当前生成任务已达上限 (4)，请稍候。');
            return;
        }

        const originalPrompt = prompt;
        setPrompt('');
        setError(null);
        setIsGenerating(true);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: originalPrompt,
                    model: selectedModel,
                    userId
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || '生成失败');
            }

            await fetchTasks();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const saveToGallery = async (task) => {
        if (!task.resultUrl) return;
        try {
            const res = await fetch('/api/ai/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: task.resultUrl,
                    title: task.prompt.substring(0, 20),
                    description: task.prompt
                })
            });
            if (res.ok) {
                alert('已成功同步至全球灵感集锦');
            }
        } catch (err) {
            alert('同步失败，请重试');
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col md:flex-row overflow-hidden selection:bg-indigo-500/30">
            {/* Sidebar / Controls */}
            <div className="w-full md:w-[400px] border-r border-white/5 flex flex-col relative z-20 bg-black/40 backdrop-blur-3xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div onClick={() => navigate('/ai')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    <div className="text-right">
                        <h1 className="text-xl font-black tracking-tight uppercase leading-none mb-1">CREATION STUDIO</h1>
                        <p className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">V 4.0 Pro</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
                    {/* Model Selector */}
                    <section>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 text-center md:text-left">选择计算核心</p>
                        <div className="grid grid-cols-2 gap-3">
                            {models.map(m => (
                                <button
                                    key={m}
                                    onClick={() => setSelectedModel(m)}
                                    className={clsx(
                                        "px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border",
                                        selectedModel === m
                                            ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Prompt Input */}
                    <section>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 text-center md:text-left">输入灵感片段</p>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="描述您脑海中的视觉奇观..."
                                className="w-full h-40 bg-white/5 border border-white/5 rounded-[32px] p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all resize-none placeholder:text-white/10"
                            />
                            <div className="absolute right-4 bottom-4 flex gap-2">
                                <button
                                    onClick={handleGenerate}
                                    disabled={!prompt.trim() || isGenerating}
                                    className={clsx(
                                        "px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95",
                                        prompt.trim() && !isGenerating
                                            ? "bg-white text-black font-black uppercase text-[10px] tracking-widest shadow-xl shadow-white/10"
                                            : "bg-white/5 text-white/20 cursor-not-allowed"
                                    )}
                                >
                                    {isGenerating ? <RefreshCw size={14} className="animate-spin" /> : <Zap size={14} />}
                                    {isGenerating ? '重构中' : '开始生成'}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Task History List */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">实验室序列</p>
                            <span className="text-[9px] font-bold text-white/40">{tasks.length} 任务</span>
                        </div>
                        <div className="space-y-3">
                            {tasks.slice(0, 10).map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTask(task)}
                                    className={clsx(
                                        "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group",
                                        selectedTask?.id === task.id ? "bg-white/5 border-white/20" : "bg-transparent border-transparent hover:bg-white/5"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-white/30 transition-all">
                                        {task.status === 'COMPLETED' ? (
                                            <img src={task.resultUrl} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <RefreshCw size={14} className="text-white/20 animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-bold truncate text-white/60">{task.prompt}</p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">{task.status}</p>
                                    </div>
                                    <ChevronRight size={14} className={clsx("transition-transform", selectedTask?.id === task.id ? "text-white rotate-0" : "text-white/10")} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Main Stage (Immersive Preview) */}
            <div className="flex-1 relative flex items-center justify-center p-8 md:p-20 bg-[#080808]">
                {/* Background Glow */}
                <div className="absolute inset-0 z-0 opacity-10 blur-[150px] pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500 rounded-full" />
                </div>

                <AnimatePresence mode="wait">
                    {selectedTask ? (
                        <motion.div
                            key={selectedTask.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="relative z-10 w-full max-w-4xl aspect-square md:aspect-auto md:h-full max-h-[80vh] flex flex-col group"
                        >
                            <div className="flex-1 bg-white/5 rounded-[48px] overflow-hidden border border-white/10 p-4 relative">
                                {selectedTask.status === 'COMPLETED' ? (
                                    <>
                                        <img
                                            src={selectedTask.resultUrl}
                                            alt="result"
                                            className="w-full h-full object-cover rounded-[36px] shadow-2xl transition-transform duration-1000 group-hover:scale-[1.02]"
                                        />
                                        {/* Floating Actions overlay */}
                                        <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 px-4">
                                            <div className="flex gap-3">
                                                <button onClick={() => saveToGallery(selectedTask)} className="p-4 rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                                                    <Download size={20} />
                                                </button>
                                                <button className="p-4 rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/20 text-white hover:bg-white hover:text-black transition-all">
                                                    <Share2 size={20} />
                                                </button>
                                            </div>
                                            <button onClick={() => saveToGallery(selectedTask)} className="px-8 py-4 rounded-3xl bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-500/40 hover:bg-indigo-400 transition-all">
                                                存入灵感库
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full border-2 border-white/5 border-t-indigo-500 animate-spin" />
                                            <Sparkles size={24} className="absolute inset-0 m-auto text-indigo-500 animate-pulse" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-black tracking-tight uppercase mb-2">正在重塑视觉粒子</h3>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] animate-pulse">Neural Reconstruction in Progress</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="mt-8 flex items-center justify-between px-2">
                                <div className="max-w-xl">
                                    <p className="text-2xl font-black tracking-tight leading-tight line-clamp-2">{selectedTask.prompt}</p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Layers size={14} className="text-white/20" />
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{selectedTask.model}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-white/20" />
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{new Date(selectedTask.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="p-6 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all active:scale-90">
                                    <Heart size={24} className="text-red-500 fill-red-500" />
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-center opacity-20">
                            <ImageIcon size={80} className="mx-auto mb-6" />
                            <p className="text-sm font-black uppercase tracking-[0.5em]">等待灵感降临</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
