import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ImageCard({ id, src, title, categories, tags, className }) {
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Link
                to={`/detail/${id}`}
                className="block break-inside-avoid rounded-[28px] overflow-hidden shadow-sm bg-white mb-4 active:scale-[0.98] transition-all group border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50"
            >
                <div className={`relative overflow-hidden ${className || ''}`}>
                    <motion.img
                        src={src}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover"
                        alt={title}
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleLike}
                        className={`absolute top-4 right-4 p-2.5 backdrop-blur-xl rounded-full text-white transition-all transform ${isLiked ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] border-none' : 'bg-black/20 group-hover:bg-black/40 border border-white/10'
                            }`}
                    >
                        <Heart size={16} className={isLiked ? "fill-white" : ""} />
                    </motion.button>
                </div>

                <div className="p-4 bg-white/80 backdrop-blur-sm text-left">
                    <div className="text-xs font-black text-gray-900 truncate mb-2.5 px-0.5 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {title || '未命名作品'}
                    </div>

                    <div className="flex flex-wrap gap-2 min-h-[16px]">
                        {categories && categories.slice(0, 1).map(cat => (
                            <span key={cat.id} className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg tracking-tighter uppercase whitespace-nowrap">
                                {cat.name}
                            </span>
                        ))}
                        {tags && tags.slice(0, 2).map(tag => (
                            <span key={tag.id} className="text-[9px] font-bold text-gray-400 bg-gray-50/50 px-2.5 py-1 rounded-lg tracking-tighter lowercase whitespace-nowrap border border-gray-100">
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
