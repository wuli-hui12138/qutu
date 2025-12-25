import { useState, useEffect } from 'react';
import { Sparkles, Send, Download, Save, RefreshCw, Wand2, History, ChevronRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function AIGenerator() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [error, setError] = useState(null);
    const [steps, setSteps] = useState([]);
    const [history, setHistory] = useState([]);
    const [models, setModels] = useState(['dall-e-3', 'flux']);
    const [selectedModel, setSelectedModel] = useState('dall-e-3');
    const [tasks, setTasks] = useState([]);

    // Load local history and models on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('ai_gen_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const res = await fetch('/api/ai/models', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                setModels(data.imageModels);
                if (data.imageModels.length > 0) setSelectedModel(data.imageModels[0]);
            }
        } catch (err) {
            console.error('Failed to fetch models');
        }
    };

    const addToHistory = (result, promptText) => {
        const newEntry = { ...result, prompt: promptText, date: new Date().toISOString() };
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('ai_gen_history', JSON.stringify(updatedHistory));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        // Limit active tasks to 4
        const activeTasks = tasks.filter(t => t.status === 'executing');
        if (activeTasks.length >= 4) {
            alert('当前生成任务已达上限(4个)，请稍候。');
            return;
        }

        const taskId = Date.now();
        const newTask = {
            id: taskId,
            prompt: prompt,
            status: 'executing',
            model: selectedModel,
            createdAt: new Date().toISOString()
        };

        setTasks(prev => [newTask, ...prev]);
        setPrompt(''); // Clear input for next prompt
        setError(null);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: newTask.prompt, model: selectedModel })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || '生成失败');
            }

            const data = await response.json(); // { url, thumb }

            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status: 'done', result: data } : t
            ));
            setResultImage(data.url); // Set as main preview if it's the latest
            addToHistory(data, newTask.prompt);

        } catch (err) {
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status: 'failed', error: err.message } : t
            ));
        }
    };

    const handleSaveToGallery = async () => {
        if (!resultImage) return;

        try {
            const res = await fetch('/api/ai/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: resultImage,
                    title: prompt.slice(0, 20) || 'AI Generated',
                    description: `Generated from prompt: ${prompt}`
                })
            });
            if (res.ok) {
                alert('已成功保存至画廊（待审核）');
            } else {
                alert('保存失败');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20 pt-16 px-4 overflow-y-auto hide-scrollbar flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                    <div>
                        <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            AI 绘图
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">AIGC ART STUDIO</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                        <Wand2 size={24} />
                    </div>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="text-[10px] font-bold text-gray-400 bg-gray-50 border-none rounded-lg px-2 py-1 outline-none appearance-none cursor-pointer"
                    >
                        {models.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>

            {/* Prompt Area */}
            <div className="space-y-3">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="输入你想生成的画面描述，例如：一个赛博朋克风格的未来城市，霓虹灯火璀璨..."
                        className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm leading-relaxed hide-scrollbar resize-none"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !prompt.trim()}
                        className={clsx(
                            "absolute bottom-3 right-3 p-3 rounded-xl transition-all shadow-lg flex items-center gap-2",
                            isGenerating || !prompt.trim()
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white active:scale-95"
                        )}
                    >
                        {isGenerating ? <RefreshCw className="animate-spin" size={20} /> : <Send size={20} />}
                        <span className="text-sm font-bold pr-1">{isGenerating ? '生图中...' : '生成'}</span>
                    </button>
                </div>

                {/* Shortcuts */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
                    {['2K壁纸', '插画风格', '动漫', '写实摄影', '极简主义'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setPrompt(p => p + (p ? ', ' : '') + tag)}
                            className="bg-gray-100/50 text-[10px] font-bold text-gray-500 px-3 py-1.5 rounded-full whitespace-nowrap border border-transparent hover:border-purple-100 transition-colors"
                        >
                            +{tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Area */}
            <div className="flex-1 space-y-4">
                {tasks.length > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">当前任务 ({tasks.filter(t => t.status === 'executing').length}/4)</h3>
                            <button onClick={() => setTasks([])} className="text-[10px] font-bold text-gray-300">全部清除</button>
                        </div>
                        {tasks.map(task => (
                            <div key={task.id} className="bg-white border border-gray-100 rounded-[24px] p-4 flex gap-4 items-center shadow-sm relative overflow-hidden group">
                                {task.status === 'executing' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 animate-pulse pointer-events-none"></div>
                                )}

                                <div className="w-16 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-50">
                                    {task.status === 'executing' ? (
                                        <RefreshCw size={20} className="text-purple-200 animate-spin" />
                                    ) : task.status === 'done' ? (
                                        <img src={task.result.thumb} className="w-full h-full object-cover" alt="thumb" />
                                    ) : (
                                        <div className="text-red-300">!</div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] text-gray-400 font-bold mb-1 truncate">{task.model}</p>
                                    <p className="text-xs text-gray-800 font-medium line-clamp-2 leading-snug">{task.prompt}</p>
                                    {task.status === 'failed' && (
                                        <p className="text-[10px] text-red-500 mt-1 font-bold">错误: {task.error}</p>
                                    )}
                                </div>

                                {task.status === 'done' && (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setResultImage(task.result.url)}
                                            className="p-2 bg-purple-50 text-purple-600 rounded-lg active:scale-95 transition-all"
                                        >
                                            <Sparkles size={16} />
                                        </button>
                                        <button
                                            onClick={() => window.open(task.result.url, '_blank')}
                                            className="p-2 bg-gray-50 text-gray-600 rounded-lg active:scale-95 transition-all"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full h-80 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="p-4 bg-white rounded-2xl text-gray-100">
                            <ImageIcon size={48} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 italic">暂无任务，开启你的创作吧</p>
                            <p className="text-[10px] text-gray-300 mt-2 leading-relaxed">支持多任务并行生成，每秒钟都是灵感</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Preview Modal if resultImage is set */}
            {resultImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                    <button
                        onClick={() => setResultImage(null)}
                        className="absolute top-10 right-6 text-white/50 hover:text-white"
                    >
                        关闭预览
                    </button>
                    <div className="w-full aspect-[9/16] max-w-[320px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative mb-6">
                        <img src={resultImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <div className="flex gap-4 w-full max-w-[320px]">
                        <button
                            onClick={handleSaveToGallery}
                            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> 保存到画廊
                        </button>
                        <button
                            onClick={() => window.open(resultImage, '_blank')}
                            className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* History Brief */}
            {history.length > 0 && (
                <div className="mt-4 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <History size={16} className="text-gray-400" /> 历史杰作
                        </h3>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                        {history.map((item, i) => (
                            <div key={i} onClick={() => setResultImage(item.url)} className="w-16 h-28 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer active:scale-95 transition-all shadow-sm">
                                <img src={item.thumb || item.url} className="w-full h-full object-cover" alt="history" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
