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
    Check,
    Box,
    X,
    Trash2
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
    const [tasks, setTasks] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    const styles = [
        { name: 'Realistic', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200' },
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
            const fullPrompt = `${prompt} --ar ${aspectRatio}`;
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    negativePrompt: showNegative ? negativePrompt : '',
                    model: selectedModel,
                    userId,
                    style: selectedStyle
                })
            });

            if (!response.ok) throw new Error('生成失败');

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
        <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col overflow-hidden selection:bg-indigo-100">
            {/* Header */}
            <header className="flex-shrink-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
                <div onClick={() => navigate('/ai')} className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all text-gray-600">
                    <ArrowLeft size={18} />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-sm font-black tracking-widest text-gray-900 uppercase">CREATION LAB</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)] animate-pulse" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Compute Ready</span>
                    </div>
                </div>
                <div className="w-9 h-9" />
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar bg-gray-50/50">
                {/* Creation Section */}
                <section className="max-w-4xl mx-auto px-8 py-8 space-y-8">
                    {/* Prompt Box */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">灵感提示词</span>
                            <button onClick={randomizePrompt} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all">
                                <Dices size={14} /> 随机灵感
                            </button>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="描述您脑海中的视觉奇观..."
                                className="w-full h-32 bg-gray-50 border border-gray-100 rounded-[20px] p-6 text-[15px] font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-200 transition-all resize-none placeholder:text-gray-300"
                            />
                            <div className="absolute left-6 bottom-4">
                                <button
                                    onClick={() => setShowNegative(!showNegative)}
                                    className={clsx("text-[10px] font-bold uppercase tracking-widest transition-colors", showNegative ? "text-red-500" : "text-gray-400 hover:text-gray-600")}
                                >
                                    {showNegative ? '✕ 移除负向提示' : '+ 添加负向提示'}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showNegative && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                    <textarea
                                        value={negativePrompt}
                                        onChange={(e) => setNegativePrompt(e.target.value)}
                                        placeholder="不希望在画面中出现的内容（如：模糊、变形的手指...）"
                                        className="w-full h-20 bg-red-50 border border-red-100 rounded-[16px] p-4 text-[13px] font-medium focus:outline-none focus:border-red-200 transition-all resize-none placeholder:text-red-200 text-red-700 mt-2"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Style Selector */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">创意风格</span>
                            <span className="text-[10px] font-bold text-indigo-600">{selectedStyle}</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                            {styles.map(style => (
                                <button
                                    key={style.name}
                                    onClick={() => setSelectedStyle(style.name)}
                                    className={clsx(
                                        "flex-shrink-0 w-28 group relative rounded-[20px] overflow-hidden border-2 transition-all active:scale-95",
                                        selectedStyle === style.name ? "border-indigo-500 shadow-lg shadow-indigo-100" : "border-gray-100 hover:border-gray-200"
                                    )}
                                >
                                    <img src={style.img} alt={style.name} className="w-full h-24 object-cover" />
                                    <div className={clsx("absolute inset-x-0 bottom-0 py-2 bg-white/90 backdrop-blur-sm border-t border-gray-100 flex items-center justify-center transition-all", selectedStyle === style.name ? "text-indigo-600" : "text-gray-500")}>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{style.name}</span>
                                    </div>
                                    {selectedStyle === style.name && (
                                        <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1 shadow-sm">
                                            <Check size={8} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameters Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">画幅比例</span>
                                <span className="text-[10px] font-bold text-indigo-600">{aspectRatio}</span>
                            </div>
                            <div className="flex gap-3">
                                {aspectRatios.map(ar => (
                                    <button
                                        key={ar.label}
                                        onClick={() => setAspectRatio(ar.label)}
                                        className={clsx(
                                            "flex-1 py-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2",
                                            aspectRatio === ar.label ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200"
                                        )}
                                    >
                                        {ar.icon}
                                        <span className="text-[10px] font-bold">{ar.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">精细程度 (CFG)</span>
                                <span className="text-[10px] font-bold text-indigo-600">{cfgScale}</span>
                            </div>
                            <div className="px-1 py-4">
                                <input
                                    type="range" min="1" max="20" step="1"
                                    value={cfgScale}
                                    onChange={(e) => setCfgScale(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-indigo-600 cursor-pointer"
                                />
                                <div className="flex justify-between mt-3">
                                    <span className="text-[9px] font-bold text-gray-300">自然自由</span>
                                    <span className="text-[9px] font-bold text-gray-300">严格还原</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className={clsx(
                            "w-full py-6 rounded-[32px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-xl",
                            prompt.trim() && !isGenerating
                                ? "bg-indigo-600 text-white font-black uppercase text-sm tracking-[0.4em] hover:bg-indigo-700 shadow-indigo-100"
                                : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                        )}
                    >
                        {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} className="fill-current" />}
                        {isGenerating ? '正在构建像素粒子...' : '一键开启视觉创作'}
                    </button>
                </section>

                {/* Results Section */}
                <section className="bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-8 py-16">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={20} className="text-gray-300" />
                                <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-400">历史创作画廊</h2>
                            </div>
                            <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-bold text-gray-400">
                                {tasks.length} 作品
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={task.id}
                                    className="group relative bg-white border border-gray-100 rounded-[36px] overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    {task.status === 'COMPLETED' ? (
                                        <div className="aspect-[4/5] relative overflow-hidden">
                                            <img src={task.resultUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="result" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <div className="absolute top-6 right-6 flex flex-col gap-2">
                                                    <button className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all">
                                                        <Heart size={16} />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-6 left-6 right-6 space-y-4">
                                                    <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-medium">"{task.prompt}"</p>
                                                    <div className="flex gap-2">
                                                        <button className="flex-1 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all">U (精制)</button>
                                                        <button className="flex-1 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all">V (变体)</button>
                                                    </div>
                                                    <button
                                                        onClick={() => setPrompt(task.prompt)}
                                                        className="w-full py-3.5 bg-white rounded-xl text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
                                                    >一键做同款</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-[4/5] flex flex-col items-center justify-center p-12 text-center bg-gray-50/50">
                                            <div className="relative mb-6">
                                                <div className="w-20 h-20 rounded-full border-2 border-gray-100 border-t-indigo-500 animate-spin" />
                                                <ImageIcon size={24} className="absolute inset-0 m-auto text-indigo-300 animate-pulse" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">正在重塑视觉粒子</h3>
                                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] leading-relaxed">Crafting Masterpiece... (Est. 20s)</p>
                                            </div>
                                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-6">
                                                <div className="w-1/3 h-full bg-indigo-500 animate-progress" />
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {tasks.length === 0 && (
                                <div className="col-span-1 md:col-span-2 py-40 flex flex-col items-center justify-center text-center opacity-20">
                                    <Box size={64} className="mb-6 text-gray-300" />
                                    <p className="text-sm font-bold uppercase tracking-[0.5em] text-gray-400">实验室尚未开启</p>
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
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    border: 4px solid #4f46e5;
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
