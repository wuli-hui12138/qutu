import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Collection() {
    const navigate = useNavigate();
    const { tag } = useParams();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/wallpapers/related/${tag}`);
                if (res.ok) {
                    const data = await res.json();
                    setImages(data);
                }
            } catch (err) {
                console.error('Failed to fetch collection:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [tag]);

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="pt-14 px-4 bg-white sticky top-0 z-30 flex items-center gap-4 pb-4 border-b border-gray-100">
                <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                <div className="font-bold text-lg text-gray-800">#{tag} 专题</div>
            </div>

            {/* Banner/Intro */}
            <div className="p-4">
                <div className="w-full h-40 rounded-2xl overflow-hidden relative shadow-md mb-4 bg-gray-100">
                    {images.length > 0 ? (
                        <img src={images[0].url} className="w-full h-full object-cover blur-[2px] opacity-70" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ImageIcon size={48} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center p-6">
                        <h2 className="text-white text-2xl font-bold mb-1 tracking-widest">{tag}</h2>
                        <p className="text-gray-200 text-xs">探索关于 {tag} 的精选灵感素材</p>
                    </div>
                </div>
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm text-gray-500">共 {images.length} 张图片</span>
                    <button className="text-purple-600 text-sm font-bold flex items-center gap-1 active:opacity-70">
                        <Star size={16} /> 收藏专题
                    </button>
                </div>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="px-4 flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            ) : images.length > 0 ? (
                <div className="px-4 grid grid-cols-2 gap-3">
                    {images.map(img => (
                        <Link key={img.id} to={`/detail/${img.id}`} className="block h-60 rounded-xl overflow-hidden shadow-sm active:scale-95 transition">
                            <img src={img.thumb || img.url} className="w-full h-full object-cover" loading="lazy" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="px-4 py-20 text-center text-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                    <p>暂无相关图片</p>
                </div>
            )}
        </div>
    )
}
