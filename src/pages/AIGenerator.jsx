import { useState, useEffect } from 'react';
import { Sparkles, Send, Download, Save, RefreshCw, Wand2, History, ChevronRight, ArrowLeft, Image as ImageIcon, Layers, Zap, Info, Maximize2, X, Share2 } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIGenerator() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewTask, setPreviewTask] = useState(null); // Full task for previewing
    const [error, setError] = useState(null);
    const [models, setModels] = useState(['dall-e-3', 'flux']);
    const [selectedModel, setSelectedModel] = useState('dall-e-3');
    const [tasks, setTasks] = useState([]);
    const [isPolling, setIsPolling] = useState(false);

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    // Initialize: load models and tasks
    useEffect(() => {
        fetchModels();
        fetchTasks();
    }, []);

    // Polling logic: if any task is 'PROCESSING', poll every 3 seconds
    useEffect(() => {
        const hasProcessing = tasks.some(t => t.status === 'PROCESSING');
        if (hasProcessing && !isPolling) {
            setIsPolling(true);
            const timer = setInterval(() => {
                fetchTasks();
            }, 3000);
            return () => {
                clearInterval(timer);
                setIsPolling(false);
            };
        } else if (!hasProcessing && isPolling) {
            setIsPolling(false);
        }
    }, [tasks, isPolling]);

    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/ai/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, limit: 20 })
            });
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            }
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        }
    };

    const fetchModels = async () => {
        try {
            const res = await fetch('/api/ai/models', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setModels(data.imageModels);
                if (data.imageModels.length > 0 && !selectedModel) setSelectedModel(data.imageModels[0]);
            }
        } catch (err) {
            console.error('Failed to fetch models');
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        // Limit active tasks to 4
        const activeTasks = tasks.filter(t => t.status === 'PROCESSING');
        if (activeTasks.length >= 4) {
            alert('当前生成任务已达上限(4个)，请稍候。');
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

    const handleSaveToGallery = async (task) => {
        if (!task || !task.resultUrl) return;

        try {
            const res = await fetch('/api/ai/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: task.resultUrl,
                    title: task.prompt.slice(0, 20) || 'AI Generated',
                    description: `Prompt: ${task.prompt}`
                })
            });
            if (res.ok) {
                alert('已同步至公共集锦（待审核）');
            } else {
                alert('保存失败');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-16 font-sans">
            {/* Minimalist Header */}
            <div className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer active:scale-90 transition-all border border-gray-100"
                    >
                        <ArrowLeft size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-gray-900 leading-none mb-1">提示词实验室</h1>
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">神经元引擎 v4.0</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden xs:flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">活跃模型</span>
                        <span className="text-[11px] font-bold text-gray-900">{selectedModel}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                        <Layers size={20} />
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 space-y-10">
                {/* Control Panel */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden"
                >
                    <div className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">描述您的创意愿景</span>
                            </div>
                            <select
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="text-[10px] font-black text-gray-400 uppercase bg-gray-50 rounded-full px-4 py-1.5 border border-gray-100 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                {models.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>

                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="在这里输入您的创意提示词..."
                                className="w-full h-28 p-0 text-gray-900 text-lg font-medium placeholder:text-gray-200 outline-none resize-none hide-scrollbar transition-all leading-relaxed"
                            />
                            {prompt && (
                                <motion.button
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    onClick={() => setPrompt('')}
                                    className="absolute top-0 right-0 p-1 text-gray-300 hover:text-gray-900 transition-colors"
                                >
                                    <X size={16} />
                                </motion.button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['4K高清', '电影感滤镜', '赛博朋克', '莫奈风', '写实主义', '虚幻引擎'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setPrompt(p => p + (p ? ', ' : '') + tag)}
                                    className="px-4 py-2 bg-gray-50 rounded-full text-[11px] font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
                                >
                                    +{tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className={clsx(
                            "w-full py-6 flex items-center justify-center gap-3 transition-all font-black text-sm uppercase tracking-[0.3em]",
                            isGenerating || !prompt.trim()
                                ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-black active:scale-[0.99] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
                        )}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} className="fill-white" />}
                        {isGenerating ? '正在计算...' : '开始初始化创作'}
                    </button>
                </motion.div>

                {/* Studio History / Gallery */}
                <div className="space-y-6 pb-12">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">实验创作档案</h2>
                            <div className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-black text-gray-400">
                                {tasks.length} 项工程
                            </div>
                        </div>
                        <button onClick={fetchTasks} className="text-gray-300 hover:text-gray-900 transition-colors">
                            <RefreshCw size={14} className={isPolling ? "animate-spin" : ""} />
                        </button>
                    </div>

                    {tasks.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {tasks.map((task, idx) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => task.status === 'COMPLETED' && setPreviewTask(task)}
                                    className="group relative aspect-[3/4] bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-all"
                                >
                                    {task.status === 'PROCESSING' ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-t-indigo-500 animate-spin" />
                                                <Zap size={16} className="absolute inset-0 m-auto text-indigo-500 fill-indigo-500 animate-pulse" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">正在合成<br />像素粒子...</p>
                                        </div>
                                    ) : task.status === 'FAILED' ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-2 bg-red-50/30">
                                            <Info size={24} className="text-red-400" />
                                            <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">服务异常</p>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={task.thumbUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Result" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                                                <p className="text-white text-[10px] font-medium line-clamp-2 leading-relaxed mb-3">{task.prompt}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">{task.model}</span>
                                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                                                        <Maximize2 size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 grayscale pointer-events-none">
                            <ImageIcon size={48} className="mb-4 text-gray-400" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">等待灵感降临</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Preview Lightbox */}
            <AnimatePresence>
                {previewTask && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white flex flex-col overflow-y-auto hide-scrollbar"
                    >
                        <div className="sticky top-0 z-50 flex items-center justify-between px-8 py-6">
                            <button
                                onClick={() => setPreviewTask(null)}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 active:scale-90 transition-all"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 active:scale-90 transition-all">
                                    <Share2 size={18} />
                                </button>
                                <button
                                    onClick={() => window.open(previewTask.resultUrl, '_blank')}
                                    className="px-6 h-12 rounded-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
                                >
                                    <Download size={16} /> 保存原图
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-8 pb-12 gap-12">
                            <div className="w-full max-w-sm aspect-[9/16] bg-gray-50 rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200">
                                <img src={previewTask.resultUrl} className="w-full h-full object-cover" alt="Full Preview" />
                            </div>

                            <div className="w-full max-w-sm space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">杰作元数据</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">提示词详情</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                                        "{previewTask.prompt}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-gray-50 rounded-[28px] space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">算法引擎</p>
                                        <p className="text-xs font-bold text-gray-900">{previewTask.model}</p>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-[28px] space-y-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">创作时间</p>
                                        <p className="text-xs font-bold text-gray-900">{new Date(previewTask.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveToGallery(previewTask)}
                                    className="w-full py-5 bg-indigo-50 rounded-[28px] text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> 同步至公共集锦
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
