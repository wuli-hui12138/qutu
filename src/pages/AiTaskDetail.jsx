import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, Send, Trash2, RefreshCw, Smartphone, Monitor, UserCircle, Sparkles, Clock, Info, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewOverlay from '../components/PreviewOverlay';
import clsx from 'clsx';

export default function AiTaskDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewType, setPreviewType] = useState(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
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
        fetchTask();
        fetchMetadata();
    }, [id]);

    const fetchTask = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/ai/task-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: parseInt(id) })
            });
            if (res.ok) {
                const data = await res.json();
                setTask(data);
                // Initialize form data
                setFormData(prev => ({
                    ...prev,
                    title: `AI 创作 - ${new Date(data.createdAt).toLocaleDateString()}`,
                    description: data.prompt
                }));
            }
        } catch (err) {
            console.error('Fetch task failed', err);
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

    const handleDownload = async () => {
        const url = task.resultUrl;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `qutu-ai-${id}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            window.open(url, '_blank');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('确定要删除这张创作吗？此操作无法撤销。')) return;
        try {
            const res = await fetch('/api/ai/delete-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: task.id })
            });
            if (res.ok) {
                navigate(-1);
            } else {
                alert('删除失败');
            }
        } catch (err) {
            console.error(err);
            alert('删除出错');
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

    const handleSubmitForReview = async (e) => {
        e.preventDefault();
        if (!formData.categories) return alert('请至少选择一个分类');

        setSubmitLoading(true);
        try {
            const res = await fetch('/api/ai/submit-to-gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId: task.id,
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

    if (loading) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
            <RefreshCw size={32} className="animate-spin text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Retrieving Neural Record</span>
        </div>
    );

    if (!task) return (
        <div className="h-screen bg-black flex items-center justify-center text-white font-black tracking-[0.5em] uppercase">
            Record Not Found
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-black relative flex flex-col pb-24">
            {/* Header (Non-floating) */}
            <div className="w-full flex justify-between items-center px-6 py-4 bg-black border-b border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={handleDelete}
                    className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 active:scale-95 transition"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="w-full flex-1 flex items-center justify-center p-6 min-h-[60vh] relative">
                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={task.resultUrl}
                    className="max-w-full max-h-[80vh] object-contain rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
                    alt="AI Result"
                />
            </div>

            {/* Quick Previews (Moved here) */}
            <div className="flex gap-3 px-6 py-2">
                <button
                    onClick={() => setPreviewType('mobile')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <Smartphone size={14} /> 手机预览
                </button>
                <button
                    onClick={() => setPreviewType('pc')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <Monitor size={14} /> 电脑预览
                </button>
                <button
                    onClick={() => setPreviewType('avatar')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-12 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <UserCircle size={14} /> 头像预览
                </button>
            </div>

            {/* Info Panel */}
            <div className="px-6 space-y-4">
                <div className="bg-white/5 backdrop-blur-3xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2.5 mb-2">
                                <span className="px-2.5 py-0.5 bg-indigo-500 rounded text-[8px] font-black text-white uppercase tracking-widest">
                                    {task.model}
                                </span>
                                <div className="flex items-center gap-1 text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                                    <Clock size={9} />
                                    {new Date(task.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <h1 className="text-white text-2xl font-black tracking-tight leading-tight">AI 创作详情</h1>
                        </div>
                    </div>

                    {/* Prompt Box */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 relative group">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={12} className="text-indigo-400" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Prompt Logic</span>
                        </div>
                        <p className="text-gray-200 text-xs leading-relaxed font-medium italic">
                            "{task.prompt}"
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleDownload}
                        className="flex-1 bg-white text-gray-900 h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/10"
                    >
                        <Download size={20} />
                        下载原图
                    </button>
                    <button
                        onClick={() => setShowSubmitModal(true)}
                        className="flex-1 bg-indigo-600 text-white h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-500 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/20"
                    >
                        <Send size={20} />
                        发布至画廊
                    </button>
                </div>
            </div>

            {/* Modals & Overlays */}
            <AnimatePresence>
                {previewType && (
                    <PreviewOverlay
                        type={previewType}
                        imageSrc={task.resultUrl}
                        onClose={() => setPreviewType(null)}
                    />
                )}
            </AnimatePresence>

            {/* Submit Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 flex flex-col relative">
                                <button onClick={() => setShowSubmitModal(false)} className="absolute right-8 top-8 p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                    <X size={24} />
                                </button>

                                <div className="mb-10 text-center">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">发布作品审核</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Share Your Creation with the World</p>
                                </div>

                                <form onSubmit={handleSubmitForReview} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">作品标题</label>
                                        <input
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
                                            placeholder="Enter artwork title..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">作品分类</label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleMeta('categories', cat.name)}
                                                    className={clsx(
                                                        "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        formData.categories.split(',').includes(cat.name)
                                                            ? "bg-indigo-600 text-white shadow-lg"
                                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                                    )}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-6 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowSubmitModal(false)}
                                            className="px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-gray-100 transition-all"
                                        >
                                            取消
                                        </button>
                                        <button
                                            disabled={submitLoading}
                                            type="submit"
                                            className={clsx(
                                                "flex-1 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3",
                                                submitLoading ? "bg-gray-100 text-gray-400 animate-pulse" : "bg-gray-900 text-white hover:bg-black"
                                            )}
                                        >
                                            {submitLoading ? <RefreshCw className="animate-spin" size={18} /> : <Check size={18} />}
                                            {submitLoading ? 'SUBMITTING...' : '确认发布'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
