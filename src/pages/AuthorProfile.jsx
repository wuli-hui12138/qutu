import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, User, Heart, Image as ImageIcon, Smartphone, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ImageCard from '../components/ImageCard';

export default function AuthorProfile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/users/${id}`)
            .then(res => res.json())
            .then(data => {
                setAuthor(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>;

    if (!author) return <div className="h-screen bg-white flex items-center justify-center font-black uppercase text-gray-300">Creator Not Found</div>;

    return (
        <div className="bg-white min-h-screen pb-24">
            <div className="pt-14 px-4 pb-10 bg-gradient-to-b from-indigo-50/50 to-white">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-xl text-gray-400 shadow-sm mb-8 active:scale-90 transition">
                    <ChevronLeft size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl mb-4">
                        <img src={author.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"} className="w-full h-full object-cover" alt="avatar" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{author.nickname}</h1>
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[10px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">Premium Creator</span>
                        <span className="text-[10px] font-bold text-gray-400">ID: {author.id}</span>
                    </div>

                    <div className="flex gap-10">
                        <div className="text-center">
                            <div className="text-xl font-black text-gray-900">{author._count?.images || 0}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">作品总数</div>
                        </div>
                        <div className="text-center border-x border-gray-100 px-10">
                            <div className="text-xl font-black text-gray-900">{author._count?.followers || 0}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">粉丝人数</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-black text-gray-900">{author._count?.following || 0}</div>
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">我的关注</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-sm text-gray-900 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} className="text-indigo-600" /> 作品合集
                    </h3>
                    <div className="h-px flex-1 mx-4 bg-gray-50"></div>
                </div>

                {author.images && author.images.length > 0 ? (
                    <div className="columns-2 gap-3 space-y-3">
                        {author.images.map(img => (
                            <ImageCard
                                key={img.id}
                                id={img.id}
                                src={img.thumb}
                                blurData={img.blurData}
                                title={img.title}
                                categories={img.categories}
                                tags={img.tags}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-gray-200">
                        <ImageIcon size={40} />
                        <span className="text-[10px] font-black uppercase tracking-widest">还没有发布作品</span>
                    </div>
                )}
            </div>
        </div>
    );
}
