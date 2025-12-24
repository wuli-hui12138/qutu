import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Image as ImageIcon, Send } from 'lucide-react';
import ImageCard from '../components/ImageCard';

export default function TopicDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/topics/${id}`)
            .then(res => res.json())
            .then(data => {
                setTopic(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="h-screen bg-white flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[10px]">Loading Essence...</div>;
    if (!topic) return <div className="h-screen bg-white flex items-center justify-center text-black font-black uppercase tracking-[0.3em] text-[10px]">Topic Lost</div>;

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header / Banner */}
            <div className="relative w-full aspect-[21/9] lg:aspect-[3/1]">
                <img src={topic.cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 w-10 h-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white active:scale-90 transition border border-white/10"
                >
                    <ChevronLeft size={24} />
                </button>
            </div>

            {/* Info Section */}
            <div className="px-6 -mt-10 relative z-10 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Topic Theme</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">{topic.title}</h1>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[90%]">{topic.description}</p>
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        onClick={() => navigate('/upload', { state: { topicId: topic.id, topicTitle: topic.title } })}
                        className="flex-1 bg-black text-white h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition shadow-2xl shadow-black/20"
                    >
                        <Plus size={18} /> 参与投稿
                    </button>
                </div>
            </div>

            {/* Images Grid */}
            <div className="px-4 mt-12">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <ImageIcon size={16} className="text-indigo-500" />
                    <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">图集内容 ({topic.images?.length || 0})</h3>
                    <div className="h-px flex-1 bg-gray-100 ml-2"></div>
                </div>

                {topic.images && topic.images.length > 0 ? (
                    <div className="columns-2 gap-3 space-y-3 pb-10">
                        {topic.images.map(item => (
                            <ImageCard
                                key={item.id}
                                id={item.id}
                                src={item.thumb}
                                blurData={item.blurData}
                                title={item.title}
                                categories={item.categories}
                                tags={item.tags}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center text-center space-y-4 rounded-[32px] bg-gray-50/50 border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 shadow-sm">
                            <Send size={28} className="-rotate-12" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-gray-900">期待您的灵感</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">Be the first to contribute <br />to this beautiful collection</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
