import { Search, Monitor, User, Image as ImageIcon, Smartphone, PlusSquare, ArrowRight, History, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ImageCard from '../components/ImageCard';

export default function Home() {
    const navigate = useNavigate();
    const [wallpapers, setWallpapers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch Approved Wallpapers and Categories
        Promise.all([
            fetch('/api/wallpapers').then(res => res.json()),
            fetch('/api/categories').then(res => res.json())
        ]).then(([walls, cats]) => {
            setWallpapers(walls);
            setCategories(cats);
        }).catch(err => console.error(err));

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* 沉浸式顶部导航栏 */}
            <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 pt-10 pb-4 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-black/20">QT</div>
                        <div className={`font-black text-xl tracking-tighter transition-colors ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>
                            趣图匣子
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/upload')} className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center active:scale-90 transition">
                            <PlusSquare size={20} className="text-gray-900" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 沉浸式搜索条 - 浮动且透明度变化 */}
            <div className="pt-32 px-4 mb-8">
                <div
                    onClick={() => navigate('/discover')}
                    className="relative group cursor-pointer"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[24px] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-gray-50/50 backdrop-blur-sm border border-gray-100 rounded-[22px] px-5 py-4 flex items-center gap-3 text-gray-400">
                        <Search size={18} className="text-gray-400" />
                        <span className="text-sm font-medium tracking-tight">探索数万张超清动态壁纸...</span>
                    </div>
                </div>
            </div>

            {/* 快速分类导航 - 现代化圆角大图标 */}
            <div className="px-1 mb-10">
                <div className="flex gap-5 overflow-x-auto hide-scrollbar px-3 py-2">
                    {(categories.length > 0 ? categories : [
                        { name: '手机壁纸', icon: <Smartphone size={24} />, color: 'bg-blue-50 text-blue-600' },
                        { name: '个性头像', icon: <User size={24} />, color: 'bg-rose-50 text-rose-500' },
                        { name: '动态视频', icon: <Monitor size={24} />, color: 'bg-amber-50 text-amber-500' },
                        { name: '背景图片', icon: <ImageIcon size={24} />, color: 'bg-emerald-50 text-emerald-500' }
                    ]).map((cat, idx) => (
                        <div
                            key={cat.id || idx}
                            onClick={() => navigate(`/discover?category=${cat.name}`)}
                            className="flex-none flex flex-col items-center gap-3 cursor-pointer group"
                        >
                            <div className={`w-16 h-16 ${cat.color || 'bg-gray-50 text-gray-400'} rounded-[24px] flex items-center justify-center shadow-sm group-active:scale-95 transition-all duration-300 border border-white`}>
                                {cat.icon || <ImageIcon size={24} />}
                            </div>
                            <span className="text-[11px] font-black text-gray-600 tracking-tighter uppercase whitespace-nowrap">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 瀑布流内容 - 真正的全屏宽度感 */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-6 px-1">
                    <div>
                        <h3 className="font-black text-xl text-gray-900 tracking-tighter flex items-center gap-2">
                            热门精选
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Curated Hot Picking</p>
                    </div>
                    <button
                        onClick={() => navigate('/discover')}
                        className="px-3 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center gap-1"
                    >
                        更多 <ArrowRight size={10} />
                    </button>
                </div>

                <div className="columns-2 gap-3 space-y-3 pb-10">
                    {wallpapers.map(item => (
                        <ImageCard
                            key={item.id}
                            id={item.id}
                            src={item.thumb}
                            title={item.title}
                            categories={item.categories}
                            tags={item.tags}
                        />
                    ))}
                    {wallpapers.length === 0 && (
                        <div className="col-span-2 py-40 flex flex-col items-center justify-center gap-4 w-full">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <span className="font-black tracking-[0.3em] uppercase text-[10px] text-gray-300">Loading Pixels</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

