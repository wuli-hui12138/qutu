import { useState, useEffect } from 'react';
import { Search, Heart, Filter, X, ChevronRight, Hash, Layers } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [wallpapers, setWallpapers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters from URL (Multi-select)
    const activeCategories = searchParams.get('categories') ? searchParams.get('categories').split(',').filter(Boolean) : [];
    const activeTags = searchParams.get('tags') ? searchParams.get('tags').split(',').filter(Boolean) : [];
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
                if (activeCategories.length > 0) {
                    activeCategories.forEach(c => url += `entities[categories][]=${encodeURIComponent(c)}&`);
                    // Note: My backend implementation used categories=val1&categories=val2 etc or comma separated?
                    // Let's re-check backend implementation of findAll
                }
                // Correcting the fetch URL construction based on how NestJS/Express handles arrays
                const params = new URLSearchParams();
                activeCategories.forEach(c => params.append('categories', c));
                activeTags.forEach(t => params.append('tags', t));
                if (searchQuery) params.append('search', searchQuery);

                const res = await fetch(`/api/wallpapers?${params.toString()}`);
                setWallpapers(await res.json());
            } catch (err) {
                console.error('Fetch wallpapers fail', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWallpapers();
    }, [searchParams]); // Re-fetch when URL changes

    const toggleFilter = (type, value) => {
        const newParams = new URLSearchParams(searchParams);
        const currentValues = newParams.get(type) ? newParams.get(type).split(',').filter(Boolean) : [];

        let nextValues;
        if (currentValues.includes(value)) {
            nextValues = currentValues.filter(v => v !== value);
        } else {
            nextValues = [...currentValues, value];
        }

        if (nextValues.length > 0) {
            newParams.set(type, nextValues.join(','));
        } else {
            newParams.delete(type);
        }
        setSearchParams(newParams);
    };

    const setSearch = (val) => {
        const newParams = new URLSearchParams(searchParams);
        if (val) newParams.set('q', val);
        else newParams.delete('q');
        setSearchParams(newParams);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header with Search */}
            <div className="pt-14 pb-4 px-4 bg-white sticky top-0 z-30 space-y-4 shadow-sm shadow-gray-100/50">
                <div className="flex items-center justify-between">
                    <h1 className="font-black text-2xl tracking-tighter text-gray-900">探索发现</h1>
                    <div className="flex items-center gap-2">
                        {(activeCategories.length > 0 || activeTags.length > 0 || searchQuery) && (
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
                        className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black placeholder:text-gray-300 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 py-4 space-y-6">
                {/* Categories */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Layers size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">分类检索 (多选)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => toggleFilter('categories', cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${activeCategories.includes(cat.name)
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
                        <span className="text-[10px] font-bold uppercase tracking-widest">标签云集 (并集检索)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => toggleFilter('tags', tag.name)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeTags.includes(tag.name)
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
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
                    <div className="columns-2 gap-2 space-y-2 pb-10">
                        {wallpapers.map(item => (
                            <ImageCard
                                key={item.id}
                                id={item.id}
                                src={item.thumb}
                                title={item.title}
                                categories={item.categories}
                                tags={item.tags}
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

function ImageCard({ id, src, title, categories, tags, liked }) {
    return (
        <Link to={`/detail/${id}`} className="block break-inside-avoid rounded-xl overflow-hidden shadow-sm bg-white mb-2 active:scale-[0.98] transition group border border-gray-50">
            <div className="relative">
                <img src={src} className="w-full" alt="img" loading="lazy" />
                <div className="absolute top-2 right-2 p-1.5 bg-black/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                    <Heart size={12} className={liked ? "fill-red-500 text-red-500" : "text-white"} />
                </div>
            </div>
            <div className="p-2 bg-white">
                <div className="text-[10px] font-black text-gray-900 truncate mb-1 px-0.5">{title || 'Untitled'}</div>
                <div className="flex flex-wrap gap-1">
                    {categories && categories.slice(0, 1).map(cat => (
                        <span key={cat.id} className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded tracking-tighter">
                            {cat.name}
                        </span>
                    ))}
                    {tags && tags.slice(0, 1).map(tag => (
                        <span key={tag.id} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded tracking-tighter">
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    )
}
