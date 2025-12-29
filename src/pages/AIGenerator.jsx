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
    Trash2,
    Smartphone,
    Monitor,
    UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import PreviewOverlay from '../components/PreviewOverlay';

export default function AIGenerator() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [showNegative, setShowNegative] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(null);
    const [selectedModel, setSelectedModel] = useState('Stable Diffusion XL');
    const [models, setModels] = useState(['Stable Diffusion XL']);
    const [showModelPicker, setShowModelPicker] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Preview State
    const [previewType, setPreviewType] = useState(null); // 'mobile', 'pc', 'avatar'
    const [previewImage, setPreviewImage] = useState(null);

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    const aspectRatios = [
        { label: '1:1', icon: <div className="w-4 h-4 border-2 border-current rounded-sm" /> },
        { label: '9:16', icon: <div className="w-3 h-5 border-2 border-current rounded-sm" /> },
        { label: '16:9', icon: <div className="w-5 h-3 border-2 border-current rounded-sm" /> }
    ];

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('/api/ai/models', { method: 'POST' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.imageModels && data.imageModels.length > 0) {
                        setModels(data.imageModels);
                        if (!selectedModel || !data.imageModels.includes(selectedModel)) {
                            setSelectedModel(data.imageModels[0]);
                        }
                    }
                }
            } catch (err) {
                console.error('Fetch models failed', err);
            }
        };
        fetchModels();
    }, []);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 3000); // Polling every 3s
        return () => clearInterval(interval);
    }, [userId]);

    const fetchTasks = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/ai/tasks?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            console.error('Fetch tasks failed', err);
        }
    };

    const handleARChange = (newAR) => {
        if (aspectRatio === newAR) {
            setAspectRatio(null); // Unset if clicking already selected
        } else {
            setAspectRatio(newAR);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() || !userId) return;

        // Check if there are already too many active tasks
        const activeTasks = tasks.filter(t => t.status === 'PROCESSING');
        if (activeTasks.length >= 4) {
            alert('当前生成任务已达上限 (4)，请稍候。');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: prompt,
                    negativePrompt: showNegative ? negativePrompt : '',
                    model: selectedModel,
                    userId,
                    ...(aspectRatio ? { aspect_ratio: aspectRatio } : {})
                })
            });

            if (!response.ok) throw new Error('生成失败');

            setPrompt('');
            await fetchTasks();
        } catch (err) {
            console.error(err);
            alert('生成请求提交失败，请重试');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `qutu-ai-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Download failed', err);
            // Fallback to direct link opening if blob fetch fails
            window.open(url, '_blank');
        }
    };

    return (
        <div className="bg-white min-h-screen text-gray-900 font-sans flex flex-col overflow-hidden selection:bg-indigo-100 uppercase-buttons">
            {/* Header */}
            <header className="flex-shrink-0 z-50 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
                <div onClick={() => navigate('/ai')} className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all text-gray-600">
                    <ArrowLeft size={18} />
                </div>

                {/* Model Switcher */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="relative">
                        <div
                            onClick={() => setShowModelPicker(!showModelPicker)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200/50 rounded-full cursor-pointer hover:bg-gray-100 transition-all select-none group shadow-sm"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
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
                                    <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">选择绘画模型</p>
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
                                            {selectedModel === m && <Check size={14} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-9 h-9" />
            </header>

            <div className="flex-1 overflow-y-auto hide-scrollbar bg-gray-50/50">
                <main className="max-w-6xl mx-auto px-8 py-10">
                    {/* Creation Area */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">灵感提示词</span>
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

                        {/* Aspect Ratio & Generate */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                            <div className="lg:col-span-2 space-y-4">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">选择画幅比例 (参数联动)</span>
                                <div className="flex gap-4">
                                    {aspectRatios.map(ar => (
                                        <button
                                            key={ar.label}
                                            onClick={() => handleARChange(ar.label)}
                                            className={clsx(
                                                "flex-1 py-4 rounded-2xl border transition-all flex items-center justify-center gap-3",
                                                aspectRatio === ar.label ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200"
                                            )}
                                        >
                                            {ar.icon}
                                            <span className="text-[10px] font-bold">{ar.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!prompt.trim() || isGenerating}
                                className={clsx(
                                    "w-full py-5 rounded-[24px] flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-xl",
                                    prompt.trim() && !isGenerating
                                        ? "bg-indigo-600 text-white font-black uppercase text-sm tracking-[0.2em] hover:bg-indigo-700 shadow-indigo-100"
                                        : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                                )}
                            >
                                {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} className="fill-current" />}
                                {isGenerating ? '正在提交...' : '立即生成'}
                            </button>
                        </div>
                    </div>

                    {/* Pending Tasks (Horizontal Stream) */}
                    {tasks.some(t => t.status === 'PROCESSING') && (
                        <div className="mt-8 space-y-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="animate-spin text-indigo-500" />
                                正在进行的任务 ({tasks.filter(t => t.status === 'PROCESSING').length})
                            </span>
                            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                                {tasks.filter(t => t.status === 'PROCESSING').map(task => (
                                    <div key={task.id} className="flex-shrink-0 w-64 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <RefreshCw size={20} className="animate-spin" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[12px] font-medium text-gray-700 truncate">"{task.prompt}"</p>
                                            <div className="w-full h-1 bg-gray-50 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-indigo-500 animate-pulse w-1/2" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>

                {/* Results Section */}
                <section className="bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-8 py-16">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <LayoutGrid size={20} className="text-gray-300" />
                                <h2 className="text-[12px] font-bold uppercase tracking-widest text-gray-400">历史创作画廊</h2>
                            </div>
                            <div className="px-3 py-1 bg-gray-50 rounded-full border border-gray-100 text-[10px] font-bold text-gray-400">
                                {tasks.filter(t => t.status === 'COMPLETED').length} 作品
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks.filter(t => t.status === 'COMPLETED').map((task) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={task.id}
                                    className="group relative bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                                        <img
                                            src={task.thumbUrl || task.resultUrl}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            alt="result"
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <p className="text-white/90 text-[13px] font-medium mb-6 line-clamp-3 leading-relaxed">
                                                "{task.prompt}"
                                            </p>

                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                <button
                                                    onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('mobile'); }}
                                                    className="py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-1 hover:bg-white hover:text-indigo-600 transition-all"
                                                >
                                                    <Smartphone size={16} />
                                                    <span className="text-[9px] font-bold uppercase">手机</span>
                                                </button>
                                                <button
                                                    onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('pc'); }}
                                                    className="py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-1 hover:bg-white hover:text-indigo-600 transition-all"
                                                >
                                                    <Monitor size={16} />
                                                    <span className="text-[9px] font-bold uppercase">电脑</span>
                                                </button>
                                                <button
                                                    onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('avatar'); }}
                                                    className="py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-1 hover:bg-white hover:text-indigo-600 transition-all"
                                                >
                                                    <UserCircle size={16} />
                                                    <span className="text-[9px] font-bold uppercase">头像</span>
                                                </button>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDownload(task.resultUrl)}
                                                    className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Download size={14} /> 下载原图
                                                </button>
                                                <button
                                                    onClick={() => setPrompt(task.prompt)}
                                                    className="w-12 h-12 bg-white rounded-xl text-indigo-600 flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg shrink-0"
                                                    title="一键同款"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {tasks.filter(t => t.status === 'COMPLETED').length === 0 && (
                                <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
                                    <Box size={64} className="mb-6 text-gray-300" />
                                    <p className="text-sm font-bold uppercase tracking-[0.5em] text-gray-400">历史创作尚空</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            {/* Global Previews */}
            <AnimatePresence>
                {previewType && (
                    <PreviewOverlay
                        type={previewType}
                        imageSrc={previewImage}
                        onClose={() => setPreviewType(null)}
                    />
                )}
            </AnimatePresence>

            <style sx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 20s linear infinite;
                }
                .uppercase-buttons button {
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
}
