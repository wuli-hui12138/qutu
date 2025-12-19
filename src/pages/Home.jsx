import { Search, Monitor, User, Image as ImageIcon, Smartphone, Heart, PlusSquare, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [wallpapers, setWallpapers] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch Approved Wallpapers and Categories
        Promise.all([
            fetch('/api/wallpapers').then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([walls, cats]) => {
            setWallpapers(walls);
            setCategories(cats);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 顶部导航栏 */}
            <div className="pt-14 pb-2 px-4 bg-white sticky top-0 z-30 flex items-center justify-between">
                <div className="font-bold text-xl tracking-wider text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs font-black">QT</div>
                    趣图匣子
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/upload" className="text-gray-800 active:scale-95 transition">
                        <PlusSquare size={24} />
                    </Link>
                </div>
            </div>

            {/* 搜索框入口 - 引导至发现页 */}
            <div className="px-4 py-2 bg-white sticky top-[88px] z-20 shadow-sm shadow-gray-100/50">
                <div
                    onClick={() => navigate('/discover')}
                    className="bg-gray-100 rounded-full px-4 py-2.5 flex items-center text-gray-400 text-sm cursor-pointer active:opacity-80 transition-all border border-transparent active:border-gray-200"
                >
                    <Search size={16} className="mr-2" />
                    <span>搜索壁纸、头像、背景图...</span>
                </div>
            </div>

            {/* 分类快捷导航 - 更加精致的图标列表 */}
            <div className="flex justify-between px-6 py-8 gap-4 overflow-x-auto hide-scrollbar">
                {(categories.length > 0 ? categories.slice(0, 4) : [
                    { name: '手机壁纸', icon: <Smartphone size={22} />, color: 'bg-indigo-50 text-indigo-600' },
                    { name: '个性头像', icon: <User size={22} />, color: 'bg-rose-50 text-rose-500' },
                    { name: '背景图', icon: <ImageIcon size={22} />, color: 'bg-emerald-50 text-emerald-500' },
                    { name: '动图', icon: <Monitor size={22} />, color: 'bg-amber-50 text-amber-500' }
                ]).map((cat, idx) => (
                    <div
                        key={cat.id || idx}
                        onClick={() => navigate(`/discover?category=${cat.name}`)}
                        className="flex-none flex flex-col items-center gap-2.5 cursor-pointer group"
                    >
                        <div className={`w-14 h-14 ${cat.color || 'bg-gray-100 text-gray-600'} rounded-[20px] flex items-center justify-center shadow-sm group-active:scale-90 transition-all`}>
                            {cat.icon || <ImageIcon size={22} />}
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 tracking-tight">{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* 热门内容列表 */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-black text-gray-900 flex items-center text-base tracking-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                        热门推荐
                    </h3>
                    <button onClick={() => navigate('/discover')} className="text-[11px] font-bold text-gray-400 flex items-center gap-0.5">
                        查看更多 <ArrowRight size={12} />
                    </button>
                </div>

                <div className="columns-2 gap-3 space-y-3 pb-8">
                    {wallpapers.map(item => (
                        <ImageCard
                            key={item.id}
                            id={item.id}
                            src={item.thumb}
                            tag={item.tags && item.tags.length > 0 ? item.tags[0].name : '壁纸'}
                            liked={item.likes > 0}
                        />
                    ))}
                    {wallpapers.length === 0 && (
                        <div className="text-gray-400 text-xs text-center col-span-2 py-32 flex flex-col items-center gap-3 w-full">
                            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-black"></div>
                            <span className="font-medium tracking-widest uppercase text-[10px]">Loading Essence</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ImageCard({ id, src, tag, liked }) {
    return (
        <Link to={`/detail/${id}`} className="block break-inside-avoid rounded-2xl overflow-hidden shadow-sm bg-white mb-3 active:scale-[0.98] transition">
            <img src={src} className="w-full" alt="img" loading="lazy" />
            <div className="p-2 flex justify-between items-center bg-white">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase tracking-wider">#{tag}</span>
                </div>
                <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-gray-300"} />
            </div>
        </Link>
    )
}
