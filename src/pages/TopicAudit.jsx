import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, X, Clock, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopicAudit() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllTopics = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/topics/admin/all');
            const data = await res.json();
            setTopics(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllTopics();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('确定要永久删除该专题吗？此操作无法撤销。')) return;
        try {
            const res = await fetch(`/api/topics/${id}`, { method: 'DELETE' });
            if (res.ok) fetchAllTopics();
        } catch (err) {
            console.error(err);
        }
    };

    const [editTopic, setEditTopic] = useState(null);
    const [topicImages, setTopicImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);

    const openEditModal = async (topic) => {
        setEditTopic(topic);
        setTopicImages([]);
        setLoadingImages(true);
        try {
            const res = await fetch(`/api/topics/admin/${topic.id}`);
            const data = await res.json();
            setTopicImages(data.images || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingImages(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/topics/${editTopic.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editTopic)
            });
            if (res.ok) {
                setEditTopic(null);
                fetchAllTopics();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAudit = async (id, status) => {
        try {
            const res = await fetch(`/api/topics/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                fetchAllTopics();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
            <div className="pt-14 pb-4 px-4 bg-white sticky top-0 z-30 flex items-center gap-4 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition">
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-gray-800">专题审核管理</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Review User Submissions</p>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {loading ? (
                    <div className="py-20 flex justify-center uppercase font-black text-[10px] text-gray-300 tracking-[0.3em] animate-pulse">Fetching Submissions...</div>
                ) : topics.length > 0 ? (
                    <div className="space-y-4 pb-10">
                        {topics.map(topic => (
                            <div key={topic.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                                <div className="flex gap-4">
                                    <img src={topic.cover} className="w-20 h-20 rounded-2xl object-cover bg-gray-100 shrink-0" alt="" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-black text-gray-900 truncate pr-2">{topic.title}</h3>
                                            <StatusBadge status={topic.status} />
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">{topic.description}</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <button
                                                onClick={() => openEditModal(topic)}
                                                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-gray-200"
                                            >
                                                编辑
                                            </button>
                                            <button
                                                onClick={() => handleDelete(topic.id)}
                                                className="px-3 py-1 bg-red-50 text-red-400 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-red-100"
                                            >
                                                删除
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center gap-1 text-[10px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                                                权重: {topic.sortOrder || 0}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                                <User size={10} /> {topic.creator || 'ANONYMOUS'}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                                <Clock size={10} /> {new Date(topic.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {topic.status === 'PENDING' && (
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => handleAudit(topic.id, 'APPROVED')}
                                            className="flex-1 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition shadow-lg shadow-emerald-500/20"
                                        >
                                            <Check size={14} /> 批准发布
                                        </button>
                                        <button
                                            onClick={() => handleAudit(topic.id, 'REJECTED')}
                                            className="flex-1 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                                        >
                                            <X size={14} /> 驳回申请
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-sm font-black text-gray-900">暂无待审核专题</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Everything is up to date</p>
                    </div>
                )}
            </div>
            {/* Edit Modal */}
            <AnimatePresence>
                {editTopic && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-md rounded-[40px] p-8 shadow-2xl relative"
                        >
                            <button onClick={() => setEditTopic(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition">
                                <X size={24} />
                            </button>
                            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">编辑专题内容</h2>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">标题</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={editTopic.title}
                                        onChange={e => setEditTopic({ ...editTopic, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">排序权重 (越大越靠前)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        placeholder="默认为 0"
                                        value={editTopic.sortOrder}
                                        onChange={e => setEditTopic({ ...editTopic, sortOrder: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">设置封面 (从专题内选取)</label>
                                        <span className="text-[8px] font-bold text-gray-300">仅限当前专题投稿</span>
                                    </div>

                                    <div className="max-h-60 overflow-y-auto pr-2 grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100 scrollbar-thin">
                                        {loadingImages ? (
                                            <div className="col-span-4 py-8 text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest animate-pulse">Loading Pool...</div>
                                        ) : topicImages.length > 0 ? (
                                            topicImages.map(img => (
                                                <div
                                                    key={img.id}
                                                    onClick={() => setEditTopic({ ...editTopic, cover: img.url })}
                                                    className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${editTopic.cover === img.url ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                                >
                                                    <img src={img.thumb || img.url} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-4 py-8 text-center text-[10px] font-bold text-gray-300 uppercase underline decoration-dashed underline-offset-4">该专题暂无投稿图片</div>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 ml-1">当前图片地址 (只读)</label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-2 px-4 text-[10px] font-mono text-gray-400 focus:outline-none"
                                            value={editTopic.cover}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">专题描述</label>
                                    <textarea
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none transition-all"
                                        value={editTopic.description}
                                        onChange={e => setEditTopic({ ...editTopic, description: e.target.value })}
                                    />
                                </div>

                                <button className="w-full bg-black text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all mt-2">
                                    应用修改
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        PENDING: "bg-orange-50 text-orange-500",
        APPROVED: "bg-emerald-50 text-emerald-500",
        REJECTED: "bg-red-50 text-red-500"
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
}
