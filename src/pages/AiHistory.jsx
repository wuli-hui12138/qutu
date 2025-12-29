import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    RefreshCw,
    Smartphone,
    Monitor,
    UserCircle,
    LayoutGrid,
    Box,
    Send,
    Trash2,
    Check,
    X,
    Clock,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import PreviewOverlay from '../components/PreviewOverlay';

export default function AiHistory() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewType, setPreviewType] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Review Modal State
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submittingTask, setSubmittingTask] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        categories: '',
        tags: '',
        description: ''
    });

    const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
    const userId = qutu_user.id;

    useEffect(() => {
        fetchTasks();
        fetchMetadata();
    }, [userId]);

    const fetchTasks = async () => {
        if (!userId) return;
        try {
            const res = await fetch('/api/ai/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, limit: 100 }) // Fetch more for history
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data.filter(t => t.status === 'COMPLETED'));
            }
        } catch (err) {
            console.error('Fetch history failed', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetadata = async () => {
        try {
            const [catsRes, tagsRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/tags')
            ]);
            if (catsRes.ok) setCategories(await catsRes.json());
            if (tagsRes.ok) setTags(await tagsRes.json());
        } catch (err) {
            console.error('Fetch metadata failed', err);
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
            window.open(url, '_blank');
        }
    };

    const handleOpenSubmit = (task) => {
        setSubmittingTask(task);
        setFormData({
            title: `AI 创作 - ${new Date().toLocaleDateString()}`,
            categories: '',
            tags: '',
            description: task.prompt
        });
        setShowSubmitModal(true);
    };

    const handleSubmitForReview = async (e) => {
        e.preventDefault();
        if (!formData.categories) return alert('请至少选择一个分类');

        setSubmitLoading(true);
        try {
            const res = await fetch('/api/ai/submit-to-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: submittingTask.id,
                    ...formData
                })
            });
            if (res.ok) {
                alert('提交成功！请等待管理员审核。');
                setShowSubmitModal(false);
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Submit failed');
            }
        } catch (err) {
            console.error(err);
            alert(`提交失败: ${err.message}`);
        } finally {
            setSubmitLoading(false);
        }
    };

    const toggleMeta = (field, name) => {
        const current = formData[field] ? formData[field].split(',').map(s => s.trim()).filter(Boolean) : [];
        if (current.includes(name)) {
            setFormData({ ...formData, [field]: current.filter(s => s !== name).join(',') });
        } else {
            setFormData({ ...formData, [field]: [...current, name].join(',') });
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm('确定要删除这张创作吗？此操作无法撤销。')) return;
        try {
            const res = await fetch('/api/ai/delete-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (res.ok) {
                setTasks(tasks.filter(t => t.id !== id));
            } else {
                alert('删除失败');
            }
        } catch (err) {
            console.error(err);
            alert('删除出错');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-24 font-sans selection:bg-indigo-100">
            {/* Header */}
            <div className="pt-14 px-6 bg-white sticky top-0 z-40 flex items-center justify-between pb-6 border-b border-gray-100/50 backdrop-blur-xl bg-white/80">
                <div className="flex items-center gap-5">
                    <div
                        onClick={() => navigate('/ai/image')}
                        className="p-2.5 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                    >
                        <ArrowLeft size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">创作历史</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Your Neural Masterpieces</p>
                    </div>
                </div>
                <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{tasks.length} 作品</span>
                </div>
            </div>

            <main className="p-4 md:p-8">
                {loading ? (
                    <div className="py-40 flex flex-col items-center justify-center gap-4">
                        <RefreshCw size={32} className="animate-spin text-indigo-500" />
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">正在检索您的数字画廊...</span>
                    </div>
                ) : (
                    <>
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={task.id}
                                    className="group relative bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all break-inside-avoid"
                                >
                                    <div className="relative overflow-hidden bg-gray-50">
                                        <img
                                            src={task.thumbUrl || task.resultUrl}
                                            className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                                            alt="result"
                                            loading="lazy"
                                        />

                                        {/* Hover Actions - Fixed with scroll and nesting */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 overflow-y-auto custom-scrollbar">
                                            <div className="min-h-full flex flex-col justify-end">
                                                <p className="text-white/90 text-[10px] md:text-[11px] font-medium mb-3 line-clamp-3 leading-relaxed italic">
                                                    "{task.prompt}"
                                                </p>

                                                <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                                                    <button
                                                        onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('mobile'); }}
                                                        className="py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-0.5 hover:bg-white hover:text-indigo-600 transition-all"
                                                    >
                                                        <Smartphone size={12} />
                                                        <span className="text-[7px] font-bold uppercase">手机</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('pc'); }}
                                                        className="py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-0.5 hover:bg-white hover:text-indigo-600 transition-all"
                                                    >
                                                        <Monitor size={12} />
                                                        <span className="text-[7px] font-bold uppercase">电脑</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setPreviewImage(task.resultUrl); setPreviewType('avatar'); }}
                                                        className="py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white flex flex-col items-center gap-0.5 hover:bg-white hover:text-indigo-600 transition-all"
                                                    >
                                                        <UserCircle size={12} />
                                                        <span className="text-[7px] font-bold uppercase">头像</span>
                                                    </button>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDownload(task.resultUrl)}
                                                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5"
                                                    >
                                                        <Download size={10} /> 下载
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenSubmit(task)}
                                                        className="px-2.5 bg-white text-indigo-600 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-1"
                                                    >
                                                        <Send size={10} /> 发布
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="w-10 bg-red-500/80 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-all"
                                                        title="删除"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/50 backdrop-blur-md flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 overflow-hidden">
                                            <Sparkles size={10} className="text-indigo-400 shrink-0" />
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">{task.model}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-gray-300">
                                            <Clock size={10} />
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
                                <Box size={64} className="mb-6 text-gray-300" />
                                <p className="text-sm font-bold uppercase tracking-[0.5em] text-gray-400">历史创作尚空</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Submit Modal - Simplified */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-white/20"
                        >
                            <div className="p-8 flex flex-col relative">
                                <button onClick={() => setShowSubmitModal(false)} className="absolute right-6 top-6 p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                    <X size={20} />
                                </button>

                                <div className="mb-8">
                                    <h2 className="text-lg font-black text-gray-900 tracking-tight">发布作品审核</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 italic">Submit for Review</p>
                                </div>

                                <form onSubmit={handleSubmitForReview} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">作品标题 (必填)</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all shadow-sm"
                                            placeholder="给您的创作起个名字"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">选择分类 (必选)</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleMeta('categories', cat.name)}
                                                    className={clsx(
                                                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        formData.categories.split(',').includes(cat.name)
                                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                                                            : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 block">常用标签 (多选)</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map(tag => (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => toggleMeta('tags', tag.name)}
                                                    className={clsx(
                                                        "px-3 py-1.5 rounded-full text-[9px] font-bold transition-all border",
                                                        formData.tags.split(',').includes(tag.name)
                                                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                                            : "bg-white border-gray-100 text-gray-400 hover:border-indigo-200"
                                                    )}
                                                >
                                                    #{tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowSubmitModal(false)}
                                            className="px-6 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
                                        >
                                            取消
                                        </button>
                                        <button
                                            disabled={submitLoading}
                                            type="submit"
                                            className={clsx(
                                                "flex-1 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3",
                                                submitLoading ? "bg-gray-100 text-gray-400 animate-pulse" : "bg-gray-900 text-white hover:bg-black active:scale-[0.98]"
                                            )}
                                        >
                                            {submitLoading ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                                            {submitLoading ? '提交中...' : '提交人工审核'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .break-inside-avoid { break-inside: avoid; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
}
