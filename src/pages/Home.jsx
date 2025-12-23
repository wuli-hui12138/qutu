import { Search, Monitor, User, Image as ImageIcon, Smartphone, PlusSquare, ArrowRight, ChevronRight } from 'lucide-react';
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
            {/* 顶部导航栏 (改为 absolute，随页面滚动) */}
            <div className={`absolute top-0 left-0 right-0 z-40 transition-all duration-300 px-4 pt-10 pb-4 ${scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg shadow-black/20">QT</div>
                        <div className="font-black text-xl tracking-tighter text-gray-900">
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

            {/* 沉浸式搜索条 */}
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

            {/* 动态 Banner 区域 (替换原分类导航) */}
            <div className="px-4 mb-10 overflow-hidden">
                <BannerSection />
            </div>

            {/* 瀑布流内容 */}
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
                            key={`wall-${item.id}`} // Ensure unique key
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

function BannerSection() {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetch('/api/wallpapers?isBanner=true')
            .then(res => res.json())
            .then(data => setBanners(data || []))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (banners.length === 0) {
        return (
            <div className="w-full aspect-[21/9] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-[32px] flex items-center justify-center border border-dashed border-gray-100 italic text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase">
                Awaiting Pixels
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <div
            onClick={() => navigate(`/detail/${currentBanner.id}`)}
            className="relative w-full aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-500/10 group cursor-pointer active:scale-[0.98] transition-all duration-500"
        >
            <img
                src={currentBanner.url} // Use original URL for banner
                className="w-full h-full object-cover"
                alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-white/60 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Featured Spot</span>
                        <h4 className="text-white font-black text-sm tracking-tight">{currentBanner.title || '探索无限灵感'}</h4>
                    </div>
                    <ChevronRight size={16} className="text-white" />
                </div>
            </div>

            {/* Pagination Dots */}
            {banners.length > 1 && (
                <div className="absolute top-4 right-6 flex gap-1.5">
                    {banners.map((_, idx) => (
                        <div
                            key={`banner-dot-${idx}`}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/30'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
