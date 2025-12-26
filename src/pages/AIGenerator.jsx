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
    ChevronRight,
    Dices,
    ChevronDown,
    LayoutGrid,
    Maximize,
    Split,
    Info,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AIGenerator() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [showNegative, setShowNegative] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('Realistic');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [selectedModel, setSelectedModel] = useState('Stable Diffusion XL');
    const [cfgScale, setCfgScale] = useState(7);
    const [imageCount, setImageCount] = useState(1);
    const [tasks, setTasks] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    const styles = [
        { name: 'Realistic', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200' },
        { name: 'Anime', img: 'https://images.unsplash.com/photo-1578632738980-43318b773537?auto=format&fit=crop&q=80&w=200&h=200' },
        { name: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200' },
        { name: 'Watercolor', img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=200&h=200' },
        { name: 'Oil Painting', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200&h=200' },
        { name: '3D Render', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200' }
    ];

    const aspectRatios = [
        { label: '1:1', icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
        { label: '9:16', icon: <div className="w-3 h-5 border-2 border-current rounded-sm" /> },
        { label: '16:9', icon: <div className="w-5 h-3 border-2 border-current rounded-sm" /> }
    ];

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
                if (data.length > 0 && !selectedTask) setSelectedTask(data[0]);
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

        setIsGenerating(true);
        try {
            const fullPrompt = `${prompt} --style ${selectedStyle} --ar ${aspectRatio}`;
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    negativePrompt: showNegative ? negativePrompt : '',
                    model: selectedModel,
                    userId
                })
            });

            if (!response.ok) throw new Error('生成失败');

            // Clear input after success
            setPrompt('');
            await fetchTasks();
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const randomizePrompt = () => {
        const prompts = [
            "末日后的丛林之城，摩天大楼被发光的藤蔓覆盖",
            "一位身着赛博朋克服饰的武士，在霓虹绚烂的雨中独行",
            "一颗被冰雪覆盖的行星，地平线上升起三颗紫色的太阳",
            "古风亭台楼阁悬浮在云海之上，仙鹤在周围翱翔"
        ];
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col overflow-hidden selection:bg-indigo-500/30">
            {/* Header */}
            <header className="flex-shrink-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div onClick={() => navigate('/ai')} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white hover:text-black transition-all">
                    <ArrowLeft size={16} />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-sm font-black tracking-widest uppercase">CREATION LAB</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Compute Center Online</span>
                    </div>
                </div>
                <div className="w-9 h-9" />
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {/* Creation Panel */}
                <section className="max-w-4xl mx-auto px-8 py-10 space-y-12">
                    {/* Prompt Box */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">提示词灵感</span>
                            <button onClick={randomizePrompt} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
                                <Dices size={14} /> 随机灵感
                            </button>
                        </div>
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="描述您脑海中的视觉奇观..."
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-[24px] p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/30 transition-all resize-none placeholder:text-white/10"
                            />

                            <div className="absolute left-6 bottom-4">
                                <button
                                    onClick={() => setShowNegative(!showNegative)}
                                    className={clsx("text-[10px] font-black uppercase tracking-widest transition-colors", showNegative ? "text-red-400" : "text-white/20 hover:text-white")}
                                >
                                    {showNegative ? '- 移除负向提示' : '+ 添加负向提示'}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showNegative && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                    <textarea
                                        value={negativePrompt}
                                        onChange={(e) => setNegativePrompt(e.target.value)}
                                        placeholder="不希望在画面中出现的内容（如：模糊、多余的手指...）"
                                        className="w-full h-20 bg-red-500/5 border border-red-500/10 rounded-[20px] p-4 text-[13px] font-medium focus:outline-none focus:border-red-500/20 transition-all resize-none placeholder:text-red-500/20 text-red-100"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Style Selector */}
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">风格选择器</span>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                            {styles.map(style => (
                                <button
                                    key={style.name}
                                    onClick={() => setSelectedStyle(style.name)}
                                    className={clsx(
                                        "flex-shrink-0 w-32 group relative rounded-[20px] overflow-hidden border-2 transition-all active:scale-95",
                                        selectedStyle === style.name ? "border-indigo-500 shadow-xl shadow-indigo-500/20" : "border-white/5 hover:border-white/20"
                                    )}
                                >
                                    <img src={style.img} alt={style.name} className="w-full h-24 object-cover" />
                                    <div className={clsx("absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-100 transition-opacity", selectedStyle === style.name ? "bg-indigo-500/20" : "group-hover:bg-black/20")}>
                                        <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-lg">{style.name}</span>
                                    </div>
                                    {selectedStyle === style.name && (
                                        <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1 border border-white/20">
                                            <Check size={8} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">图片比例</span>
                                <span className="text-[10px] font-bold text-indigo-400">{aspectRatio}</span>
                            </div>
                            <div className="flex gap-4">
                                {aspectRatios.map(ar => (
                                    <button
                                        key={ar.label}
                                        onClick={() => setAspectRatio(ar.label)}
                                        className={clsx(
                                            "flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2",
                                            aspectRatio === ar.label ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" : "bg-white/5 border-white/5 text-white/20 hover:border-white/10"
                                        )}
                                    >
                                        {ar.icon}
                                        <span className="text-[10px] font-black">{ar.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">精细度 (CFG Scale)</span>
                                <span className="text-[10px] font-bold text-indigo-400">{cfgScale}</span>
                            </div>
                            <div className="px-2">
                                <input
                                    type="range" min="1" max="20" step="0.5"
                                    value={cfgScale}
                                    onChange={(e) => setCfgScale(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-white/5 rounded-full appearance-none accent-indigo-500 cursor-pointer"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[8px] font-black text-white/10">1 (随意)</span>
                                    <span className="text-[8px] font-black text-white/10">20 (严谨)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className={clsx(
                            "w-full py-6 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl",
                            prompt.trim() && !isGenerating
                                ? "bg-white text-black font-black uppercase text-sm tracking-[0.4em] shadow-white/5"
                                : "bg-white/5 text-white/10 cursor-not-allowed"
                        )}
                    >
                        {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} className="fill-current" />}
                        {isGenerating ? '正在执行神经重构...' : '立即启动初始化生成'}
                    </button>
                </section>

                {/* Result Section */}
                <section className="bg-black/40 border-t border-white/5 mt-10">
                    <div className="max-w-4xl mx-auto px-8 py-20">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={18} className="text-white/20" />
                                <h2 className="text-sm font-black uppercase tracking-[0.3em]">实验记录网格</h2>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-white/40 uppercase tracking-widest">
                                {tasks.length} 项成果
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={task.id}
                                    className="group relative bg-[#111] border border-white/5 rounded-[40px] overflow-hidden"
                                >
                                    {task.status === 'COMPLETED' ? (
                                        <>
                                            <div className="aspect-[4/5] relative">
                                                <img src={task.resultUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="result" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                                                        <div className="flex gap-2">
                                                            <button className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-3xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">U (精制)</button>
                                                            <button className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-3xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">V (变体)</button>
                                                        </div>
                                                        <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all">
                                                            <Heart size={16} />
                                                        </button>
                                                    </div>

                                                    <div className="absolute bottom-6 left-6 right-6 space-y-4">
                                                        <p className="text-xs text-white/70 line-clamp-2 leading-relaxed italic">"{task.prompt}"</p>
                                                        <div className="flex gap-2">
                                                            <button className="flex-1 py-3.5 bg-white rounded-2xl text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95">下载成果</button>
                                                            <button
                                                                onClick={() => setPrompt(task.prompt)}
                                                                className="flex-1 py-3.5 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:border-indigo-500 transition-all"
                                                            >一键做同款</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="aspect-[4/5] flex flex-col items-center justify-center p-12 text-center gap-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-full border-2 border-white/5 border-t-indigo-500 animate-spin" />
                                                <ImageIcon size={24} className="absolute inset-0 m-auto text-indigo-500 animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2">正在重塑视觉粒子</h3>
                                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed">Neural Reconstruction in Progress... (Est. 15s)</p>
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-1/3 h-full bg-indigo-500 animate-progress" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="col-span-1 md:col-span-2 py-40 flex flex-col items-center justify-center text-center opacity-10">
                                    <ImageIcon size={64} className="mb-6" />
                                    <p className="text-sm font-black uppercase tracking-[0.5em]">实验室未初始化</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <style sx>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    border: 4px solid #6366f1;
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 15s linear infinite;
                }
            `}</style>
        </div>
    );
}
