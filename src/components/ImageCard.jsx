import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ImageCard({ id, src, title, categories, tags }) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const likes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
        setIsLiked(likes.includes(id));
    }, [id]);

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const likes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
        let newLikes;
        if (likes.includes(id)) {
            newLikes = likes.filter(itemId => itemId !== id);
        } else {
            newLikes = [...likes, id];
        }
        localStorage.setItem('qutu_likes', JSON.stringify(newLikes));
        setIsLiked(!isLiked);

        // Optional: Sync with backend
        fetch(`/api/wallpapers/${id}/like`, { method: 'POST' }).catch(() => { });
    };

    return (
        <Link
            to={`/detail/${id}`}
            className="block break-inside-avoid rounded-2xl overflow-hidden shadow-sm bg-white mb-3 active:scale-[0.98] transition-all group border border-gray-100"
        >
            <div className="relative overflow-hidden">
                <img
                    src={src}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={title}
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <button
                    onClick={toggleLike}
                    className={`absolute top-3 right-3 p-2 backdrop-blur-md rounded-full text-white transition-all transform active:scale-90 ${isLiked ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-black/20 group-hover:bg-black/40'
                        }`}
                >
                    <Heart size={14} className={isLiked ? "fill-white" : ""} />
                </button>
            </div>

            <div className="p-3">
                <div className="text-[11px] font-black text-gray-800 truncate mb-2 px-0.5 tracking-tight group-hover:text-black transition-colors">
                    {title || '未命名作品'}
                </div>

                <div className="flex flex-wrap gap-1.5 min-h-[16px]">
                    {categories && categories.slice(0, 1).map(cat => (
                        <span key={cat.id} className="text-[8px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full tracking-tighter uppercase whitespace-nowrap">
                            {cat.name}
                        </span>
                    ))}
                    {tags && tags.slice(0, 8).map(tag => (
                        <span key={tag.id} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full tracking-tighter lowercase whitespace-nowrap">
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
