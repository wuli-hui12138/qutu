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
            {/* 顶部导航栏 (改为自然布局，随页面滚动) */}
            <div className="px-4 pt-10 pb-4 bg-transparent transition-colors duration-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white text-[10px] font-black shadow-2xl shadow-black/30 transform hover:rotate-3 transition-transform">QT</div>
                        <div className="font-black text-2xl tracking-tighter text-gray-900">
                            趣图匣子
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/upload')}
                            className="group w-11 h-11 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all hover:bg-gray-50"
                        >
                            <PlusSquare size={20} className="text-gray-900 group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 沉浸式搜索条 */}
            <div className="pt-6 px-4 mb-8">
                <div
                    onClick={() => navigate('/discover')}
                    className="relative group cursor-pointer"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[24px] blur-lg opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative bg-gray-50/50 backdrop-blur-md border border-gray-100 rounded-[22px] px-6 py-4.5 flex items-center gap-3 text-gray-400 group-hover:border-indigo-100 transition-colors">
                        <Search size={18} className="text-gray-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium tracking-tight">探索数万张超清壁纸与头像...</span>
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
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const navigate = useNavigate();

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

    const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentIndex(prev => (prev + 1) % banners.length);
        }
        if (isRightSwipe) {
            setCurrentIndex(prev => (prev - 1 + banners.length) % banners.length);
        }
        setTouchStart(0);
        setTouchEnd(0);
    };

    if (banners.length === 0) {
        return (
            <div className="w-full aspect-[21/9] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[32px] flex flex-col items-center justify-center border border-gray-100 overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <ImageIcon size={32} className="text-indigo-200 mb-2 opacity-50" />
                <span className="text-[10px] font-black text-indigo-300 tracking-[0.3em] uppercase">Curating Premium Pixels</span>
            </div>
        );
    }

    const currentBanner = banners[currentIndex];

    return (
        <div
            onClick={() => navigate(`/detail/${currentBanner.id}`)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl shadow-indigo-500/10 group cursor-pointer active:scale-[0.98] transition-all duration-500"
        >
            <img
                key={currentBanner.id}
                src={currentBanner.url}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s]"
                alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-7">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                            <span className="text-white/80 text-[9px] font-black uppercase tracking-[0.2em]">Featured Release</span>
                        </div>
                        <h4 className="text-white font-extrabold text-lg tracking-tight leading-tight max-w-[240px]">
                            {currentBanner.title || '探索无限创意边界'}
                        </h4>
                    </div>
                </div>
            </div>

            {/* Pagination Dots (Fixed positions) */}
            {banners.length > 1 && (
                <div className="absolute top-6 right-8 flex gap-2">
                    {banners.map((_, idx) => (
                        <div
                            key={`banner-dot-${idx}`}
                            className={`h-1 rounded-full transition-all duration-500 bg-white ${idx === currentIndex ? 'w-6 opacity-100' : 'w-1.5 opacity-30 focus:opacity-50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
