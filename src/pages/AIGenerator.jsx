import { useState, useEffect } from 'react';
import { Sparkles, Send, Download, Save, RefreshCw, Wand2, History, ChevronRight } from 'lucide-react';
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

    // Load local history on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem('ai_gen_history');
        if (savedHistory) setHistory(JSON.parse(savedHistory));
    }, []);

    const addToHistory = (imageUrl, promptText) => {
        const newEntry = { url: imageUrl, prompt: promptText, date: new Date().toISOString() };
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        setHistory(updatedHistory);
        localStorage.setItem('ai_gen_history', JSON.stringify(updatedHistory));
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setIsGenerating(true);
        setError(null);
        setResultImage(null);
        setSteps(['🚀 正在建立连接...', '🧠 AI 正在构思...', '🎨 绘制细节中...', '✨ 渲染最终效果...']);

        try {
            const response = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || '生成失败，请检查 API 配置');
            }

            const data = await response.json();
            setResultImage(data.url);
            addToHistory(data.url, prompt);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsGenerating(false);
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Sparkles className="text-purple-600" /> AI 创意实验室
                    </h1>
                    <p className="text-xs text-gray-400 mt-1 font-medium italic">Transform your imagination into visuals</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-xl text-purple-600">
                    <Wand2 size={24} />
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

            {/* Result Area */}
            <div className="flex-1">
                {isGenerating ? (
                    <div className="w-full aspect-[9/16] bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center p-8 text-center gap-6 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent animate-pulse"></div>
                        <div className="w-16 h-16 relative">
                            <RefreshCw size={64} className="text-purple-200 animate-spin" />
                            <Sparkles size={24} className="text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="space-y-4 relative z-10 w-full max-w-[200px]">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.5}s` }}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                    <span className="text-xs font-medium text-gray-600">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : resultImage ? (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                        <div className="w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                            <img src={resultImage} className="w-full h-full object-cover" alt="AI Generated" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => window.open(resultImage, '_blank')}
                                className="flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold text-sm active:scale-95 transition-all"
                            >
                                <Download size={18} /> 高清预览
                            </button>
                            <button
                                onClick={handleSaveToGallery}
                                className="flex items-center justify-center gap-2 py-4 bg-black text-white rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg"
                            >
                                <Save size={18} /> 保存到画廊
                            </button>
                        </div>
                    </div>
                ) : error ? (
                    <div className="w-full aspect-[9/16] bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="p-4 bg-white rounded-full text-red-500 shadow-sm"><RefreshCw size={32} /></div>
                        <div>
                            <p className="text-sm font-bold text-red-900">生成出错</p>
                            <p className="text-xs text-red-600 mt-1 max-w-[200px] leading-relaxed">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full aspect-[9/16] bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="p-4 bg-white rounded-2xl text-gray-200">
                            <Wand2 size={48} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 italic">等待你的灵感爆发...</p>
                            <p className="text-[10px] text-gray-300 mt-2 leading-relaxed">Generated images are high-resolution and optimized for wallpapers</p>
                        </div>
                    </div>
                )}
            </div>

            {/* History Brief */}
            {history.length > 0 && (
                <div className="mt-4 pb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <History size={16} className="text-gray-400" /> 最近记录
                        </h3>
                        <button className="text-[10px] font-bold text-purple-600 flex items-center">
                            查看全部 <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                        {history.map((item, i) => (
                            <div key={i} onClick={() => setResultImage(item.url)} className="w-16 h-28 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer active:scale-95 transition-all shadow-sm">
                                <img src={item.url} className="w-full h-full object-cover" alt="history" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
