import { Search, Monitor, User, Image as ImageIcon, Smartphone, Heart, PlusSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [wallpapers, setWallpapers] = useState([]);
    const [collections, setCollections] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch All
        Promise.all([
            fetch('/api/wallpapers').then(res => res.json()),
            fetch('/api/collections').then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([walls, colls, cats]) => {
            setWallpapers(walls);
            setCollections(colls);
            setCategories(cats);
        }).catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 顶部导航栏 */}
            <div className="pt-14 pb-2 px-4 bg-white sticky top-0 z-30 flex items-center justify-between">
                <div className="font-bold text-xl tracking-wider text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs">QT</span>
                    趣图匣子
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/upload" className="text-gray-800 active:scale-95 transition">
                        <PlusSquare size={24} />
                    </Link>
                </div>
            </div>

            {/* 搜索框 */}
            <div className="px-4 py-2 bg-white sticky top-[88px] z-20 shadow-sm shadow-gray-100">
                <div
                    onClick={() => navigate('/collection/推荐')}
                    className="bg-gray-100 rounded-full px-4 py-2.5 flex items-center text-gray-400 text-sm cursor-pointer active:opacity-80"
                >
                    <Search size={16} className="mr-2" />
                    <span>搜索壁纸、头像、表情包...</span>
                </div>
            </div>

            {/* Banner 轮播 / Collections */}
            {collections.length > 0 && (
                <div className="mt-4 px-4 overflow-x-auto hide-scrollbar flex gap-4 snap-x">
                    {collections.map(coll => (
                        <Link
                            key={coll.id}
                            to={`/collection/${coll.name}`}
                            className="flex-none w-[85%] h-44 rounded-2xl overflow-hidden relative shadow-md snap-center active:scale-[0.98] transition"
                        >
                            <img
                                src={coll.cover || (coll.images[0] ? coll.images[0].url : '')}
                                className="w-full h-full object-cover"
                                alt={coll.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                                <h3 className="text-white text-lg font-bold">{coll.name}</h3>
                                <p className="text-white/70 text-[10px] mt-1 line-clamp-1">{coll.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* 金刚区图标 / Categories */}
            <div className="flex overflow-x-auto hide-scrollbar px-4 py-6 gap-6">
                {(categories.length > 0 ? categories : [
                    { name: '手机壁纸', icon: <Smartphone size={24} />, color: 'bg-purple-100 text-purple-600' },
                    { name: '个性头像', icon: <User size={24} />, color: 'bg-pink-100 text-pink-500' },
                    { name: '电脑壁纸', icon: <Monitor size={24} />, color: 'bg-blue-100 text-blue-500' },
                    { name: '动态图', icon: <ImageIcon size={24} />, color: 'bg-orange-100 text-orange-500' }
                ]).map((cat, idx) => (
                    <Link
                        key={cat.id || idx}
                        to={`/collection/${cat.name}`}
                        className="flex-none flex flex-col items-center gap-2 active:scale-95 transition"
                    >
                        <div className={`w-12 h-12 ${cat.color || 'bg-indigo-50 text-indigo-500'} rounded-2xl flex items-center justify-center shadow-sm`}>
                            {cat.icon || <ImageIcon size={20} />}
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">{cat.name}</span>
                    </Link>
                ))}
            </div>

            {/* 瀑布流内容 */}
            <div className="px-4">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm">
                    <span className="text-red-500 mr-2">🔥</span> 热门推荐
                </h3>
                <div className="columns-2 gap-3 space-y-3">
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
                        <div className="text-gray-400 text-xs text-center col-span-2 py-20 flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mb-2"></div>
                            加载精彩内容中...
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
