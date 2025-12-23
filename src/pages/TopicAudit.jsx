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
                                        <div className="flex items-center gap-3 mt-2">
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
