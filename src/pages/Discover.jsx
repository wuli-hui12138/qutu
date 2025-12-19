import { useState, useEffect } from 'react';
import { Search, Heart, Filter, X, ChevronRight, Hash, Layers } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [wallpapers, setWallpapers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters from URL
    const activeCategory = searchParams.get('category') || '';
    const activeTag = searchParams.get('tag') || '';
    const searchQuery = searchParams.get('q') || '';

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catsRes, tagsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/tags')
                ]);
                setCategories(await catsRes.json());
                setTags(await tagsRes.json());
            } catch (err) {
                console.error('Fetch filters fail', err);
            }
        };
        fetchFilters();
    }, []);

    useEffect(() => {
        const fetchWallpapers = async () => {
            setLoading(true);
            try {
                let url = '/api/wallpapers?';
                if (activeCategory) url += `category=${encodeURIComponent(activeCategory)}&`;
                if (activeTag) url += `tag=${encodeURIComponent(activeTag)}&`;
                if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;

                const res = await fetch(url);
                setWallpapers(await res.json());
            } catch (err) {
                console.error('Fetch wallpapers fail', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWallpapers();
    }, [activeCategory, activeTag, searchQuery]);

    const setFilter = (type, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(type, value);
        } else {
            newParams.delete(type);
        }
        setSearchParams(newParams);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header with Search */}
            <div className="pt-14 pb-4 px-4 bg-white sticky top-0 z-30 space-y-4 shadow-sm shadow-gray-100/50">
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl tracking-tighter text-gray-900">探索发现</h1>
                    <div className="flex items-center gap-2">
                        {(activeCategory || activeTag || searchQuery) && (
                            <button
                                onClick={() => setSearchParams({})}
                                className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1"
                            >
                                <X size={10} /> Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="模糊检索：尝试输入关键词..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black placeholder:text-gray-300 transition-all"
                        value={searchQuery}
                        onChange={(e) => setFilter('q', e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 py-4 space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Layers size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">分类检索</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter('category', activeCategory === cat.name ? '' : cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeCategory === cat.name
                                        ? 'bg-black text-white border-black shadow-md shadow-black/10'
                                        : 'bg-white text-gray-500 border-gray-100'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular Tags */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Hash size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">标签云集</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => setFilter('tag', activeTag === tag.name ? '' : tag.name)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeTag === tag.name
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="px-4 mt-2">
                <div className="flex items-center gap-2 mb-4 text-gray-400">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Match Results ({wallpapers.length})</span>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin"></div>
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Filtering Space</span>
                    </div>
                ) : (
                    <div className="columns-2 gap-3 space-y-3 pb-10">
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
                            <div className="col-span-2 py-32 text-center space-y-2">
                                <div className="text-3xl opacity-20">📭</div>
                                <p className="text-gray-300 text-[11px] font-bold uppercase tracking-widest">No matching pixels found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function ImageCard({ id, src, tag, liked }) {
    return (
        <Link to={`/detail/${id}`} className="block break-inside-avoid rounded-2xl overflow-hidden shadow-sm bg-white mb-3 active:scale-[0.98] transition border border-gray-50">
            <img src={src} className="w-full" alt="img" loading="lazy" />
            <div className="p-2 flex justify-between items-center bg-white">
                <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[9px] font-black text-black bg-gray-100 px-2 py-0.5 rounded tracking-tighter">#{tag}</span>
                </div>
                <Heart size={12} className={liked ? "fill-black text-black" : "text-gray-200"} />
            </div>
        </Link>
    )
}
