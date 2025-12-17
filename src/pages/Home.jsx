import { Search, Monitor, User, Image as ImageIcon, Smartphone, Heart } from 'lucide-react';

import { useState, useEffect } from 'react';

export default function Home() {
    const [wallpapers, setWallpapers] = useState([]);

    useEffect(() => {
        fetch('/api/wallpapers')
            .then(res => res.json())
            .then(data => setWallpapers(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* 顶部导航栏 */}
            <div className="pt-14 pb-2 px-4 bg-white sticky top-0 z-30 flex items-center justify-between">
                <div className="font-bold text-xl tracking-wider text-gray-800">趣图匣子</div>
                <div className="flex items-center justify-around w-20 h-8 bg-white/60 border border-black/10 rounded-full backdrop-blur-sm">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
            </div>

            {/* 搜索框 */}
            <div className="px-4 py-2 bg-white sticky top-[88px] z-20">
                <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center text-gray-400 text-sm">
                    <Search size={16} className="mr-2" />
                    <span>搜索壁纸、头像、表情包...</span>
                </div>
            </div>

            {/* Banner 轮播 */}
            <div className="mt-2 px-4">
                <div className="w-full h-40 rounded-2xl overflow-hidden relative shadow-sm">
                    <img
                        src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        className="w-full h-full object-cover"
                        alt="Banner"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-bold">每周精选 | 森系自然风光</p>
                    </div>
                </div>
            </div>

            {/* 金刚区图标 */}
            <div className="flex justify-between px-6 py-6">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm active:scale-95 transition-transform">
                        <Smartphone size={24} />
                    </div>
                    <span className="text-xs text-gray-600">手机壁纸</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm active:scale-95 transition-transform">
                        <User size={24} />
                    </div>
                    <span className="text-xs text-gray-600">个性头像</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm active:scale-95 transition-transform">
                        <Monitor size={24} />
                    </div>
                    <span className="text-xs text-gray-600">电脑壁纸</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm active:scale-95 transition-transform">
                        <ImageIcon size={24} />
                    </div>
                    <span className="text-xs text-gray-600">动态图</span>
                </div>
            </div>

            {/* 瀑布流内容 */}
            <div className="px-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                    <span className="text-red-500 mr-2">🔥</span> 热门推荐
                </h3>
                {/* Simple CSS Columns for Masonry effect */}
                <div className="columns-2 gap-4 space-y-4">
                    {wallpapers.map(item => (
                        <ImageCard
                            key={item.id}
                            src={item.thumb}
                            tag={item.tags ? item.tags.split(',')[0] : '壁纸'}
                            liked={item.likes > 0}
                        />
                    ))}
                    {wallpapers.length === 0 && <p className="text-gray-400 text-sm text-center col-span-2 py-10">加载中...</p>}
                </div>
            </div>
        </div>
    )
}

import { Link } from 'react-router-dom';

function ImageCard({ src, tag, liked }) {
    return (
        <Link to="/detail/1" className="block break-inside-avoid rounded-xl overflow-hidden shadow-sm bg-white mb-4 active:opacity-90 transition-opacity">
            <img src={src} className="w-full" alt="img" loading="lazy" />
            <div className="p-2 flex justify-between items-center">
                <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500">{tag}</span>
                <Heart size={14} className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </div>
        </Link>
    )
}
