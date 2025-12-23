import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PlusCircle, ArrowRight, MessageSquare, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Topics() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTopic, setNewTopic] = useState({ title: '', description: '', cover: '', creator: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTopics = () => {
        setLoading(true);
        fetch('/api/topics')
            .then(res => res.json())
            .then(data => {
                setTopics(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTopic)
            });
            if (res.ok) {
                setShowCreateModal(false);
                setNewTopic({ title: '', description: '', cover: '', creator: '' });
                fetchTopics();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="pt-14 pb-4 px-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-gray-900">专题共建</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Theme Co-creation Collections
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-black/20"
                >
                    <PlusCircle size={14} /> 发起专题
                </button>
            </div>

            <div className="px-4 mt-6 space-y-6">
                {loading ? (
                    <div className="py-20 flex justify-center uppercase font-black text-[10px] text-gray-300 tracking-[0.3em] animate-pulse">Loading Topics...</div>
                ) : topics.length > 0 ? (
                    topics.map(topic => (
                        <div
                            key={topic.id}
                            onClick={() => navigate(`/topics/${topic.id}`)}
                            className="group relative w-full aspect-[16/9] rounded-[32px] overflow-hidden shadow-xl shadow-gray-200/50 cursor-pointer active:scale-[0.98] transition-all"
                        >
                            <img src={topic.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-0.5 bg-indigo-500 rounded text-[8px] text-white font-black uppercase tracking-wider">
                                                {topic.creator || 'OFFICIAL'}
                                            </span>
                                            <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest">
                                                {topic._count?.images || 0} PIXELS SUBMITTED
                                            </span>
                                        </div>
                                        <h2 className="text-white text-xl font-black tracking-tight">{topic.title}</h2>
                                        <p className="text-white/60 text-xs font-medium line-clamp-1">{topic.description}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-sm font-black text-gray-900">暂无活动专题</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Next theme is brewing...</p>
                    </div>
                )}
            </div>

            {/* Create Topic Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-xl text-gray-900 tracking-tight text-center flex-1">发起新专题</h3>
                                <button onClick={() => setShowCreateModal(false)} className="absolute right-6 top-8 p-2 text-gray-400 hover:text-black">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTopic} className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">专题标题</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="例如：2025年冬日穿搭"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        value={newTopic.title}
                                        onChange={e => setNewTopic({ ...newTopic, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">专题描述</label>
                                    <textarea
                                        required
                                        placeholder="简要介绍这个专题的意义..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none h-24 resize-none"
                                        value={newTopic.description}
                                        onChange={e => setNewTopic({ ...newTopic, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">封面图片地址</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        value={newTopic.cover}
                                        onChange={e => setNewTopic({ ...newTopic, cover: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">发起人名称</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="您的昵称"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                        value={newTopic.creator}
                                        onChange={e => setNewTopic({ ...newTopic, creator: e.target.value })}
                                    />
                                </div>
                                <button
                                    disabled={isSubmitting}
                                    className="w-full bg-black text-white py-5 rounded-[22px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all mt-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? '正在发布...' : '立即开启专题'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}
