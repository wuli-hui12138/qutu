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
    const [isManageMode, setIsManageMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

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
        await handleBatchDelete([id]);
    };

    const handleBatchDelete = async (ids) => {
        if (ids.length === 0) return;
        if (!window.confirm(`确定要删除选中的 ${ids.length} 张创作吗？此操作无法撤销。`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch('/api/ai/delete-tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids })
            });
            if (res.ok) {
                setTasks(tasks.filter(t => !ids.includes(t.id)));
                setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
            } else {
                alert('删除失败');
            }
        } catch (err) {
            console.error(err);
            alert('删除出错');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const selectAll = () => {
        if (selectedIds.length === tasks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(tasks.map(t => t.id));
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setIsManageMode(!isManageMode);
                            if (isManageMode) setSelectedIds([]);
                        }}
                        className={clsx(
                            "px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            isManageMode
                                ? "bg-black text-white shadow-lg"
                                : "bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100"
                        )}
                    >
                        {isManageMode ? <X size={14} /> : <LayoutGrid size={14} />}
                        {isManageMode ? '取消选择' : '批量管理'}
                    </button>
                    {!isManageMode && (
                        <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{tasks.length} 作品</span>
                        </div>
                    )}
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
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                        opacity: 1,
                                        scale: selectedIds.includes(task.id) ? 0.94 : 1,
                                    }}
                                    key={task.id}
                                    className={clsx(
                                        "group relative bg-white border rounded-[28px] overflow-hidden transition-all break-inside-avoid",
                                        selectedIds.includes(task.id) ? "border-indigo-500 shadow-2xl ring-4 ring-indigo-500/10" : "border-gray-100 shadow-sm"
                                    )}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        if (!isManageMode) {
                                            setIsManageMode(true);
                                            setSelectedIds([task.id]);
                                        }
                                    }}
                                >
                                    <div
                                        onClick={() => isManageMode ? toggleSelect(task.id) : navigate(`/ai/task/${task.id}`)}
                                        className="relative overflow-hidden bg-gray-50 cursor-pointer"
                                    >
                                        <img
                                            src={task.thumbUrl || task.resultUrl}
                                            className={clsx(
                                                "w-full h-auto object-cover transition-all duration-700",
                                                selectedIds.includes(task.id) ? "brightness-90 scale-105" : "group-hover:scale-105"
                                            )}
                                            alt="result"
                                            loading="lazy"
                                        />

                                        {/* Selection Circular Badge */}
                                        {isManageMode && (
                                            <div className="absolute top-4 left-4 z-50">
                                                <div
                                                    onClick={(e) => { e.stopPropagation(); toggleSelect(task.id); }}
                                                    className={clsx(
                                                        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
                                                        selectedIds.includes(task.id)
                                                            ? "bg-indigo-600 border-white text-white shadow-xl scale-110"
                                                            : "bg-black/20 border-white/60 backdrop-blur-md"
                                                    )}
                                                >
                                                    {selectedIds.includes(task.id) ? (
                                                        <Check size={14} strokeWidth={4} />
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Selection Overlay */}
                                        {selectedIds.includes(task.id) && (
                                            <div className="absolute inset-0 bg-indigo-600/5 backdrop-blur-[2px] pointer-events-none" />
                                        )}

                                        {/* Simplified Hover Info */}
                                        {!isManageMode && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-white text-[9px] font-black uppercase tracking-widest bg-indigo-600 px-2 py-0.5 rounded-lg">查看详情</span>
                                                </div>
                                                <p className="text-white/70 text-[10px] font-medium line-clamp-2 leading-relaxed italic">"{task.prompt}"</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 bg-white flex items-center justify-between border-t border-gray-50">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <Sparkles size={8} className="text-indigo-400" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{task.model}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-300">
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

            {/* Batch Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        className="fixed bottom-8 left-1/2 z-[60] w-[92%] max-w-sm"
                    >
                        <div className="bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <div className="flex-1 flex items-center gap-4 pl-6">
                                <span className="text-white font-black text-lg">{selectedIds.length}</span>
                                <div className="flex flex-col">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Selected</span>
                                    <span className="text-white text-[10px] font-bold">ITEMS READY</span>
                                </div>
                            </div>

                            <button
                                onClick={selectAll}
                                className="px-6 py-4 rounded-2xl text-[10px] font-black text-white hover:bg-white/5 uppercase tracking-widest transition-colors"
                            >
                                {selectedIds.length === tasks.length ? '取消' : '全选'}
                            </button>

                            <button
                                onClick={() => handleBatchDelete(selectedIds)}
                                disabled={isDeleting}
                                className={clsx(
                                    "px-8 py-4 rounded-[24px] text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all",
                                    isDeleting
                                        ? "bg-gray-800 text-gray-500"
                                        : "bg-red-500 text-white shadow-xl shadow-red-500/20 active:scale-95"
                                )}
                            >
                                {isDeleting ? (
                                    <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                删除
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
