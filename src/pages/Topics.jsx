import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PlusCircle, ArrowRight, MessageSquare } from 'lucide-react';

export default function Topics() {
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

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
        </div>
    );
}
