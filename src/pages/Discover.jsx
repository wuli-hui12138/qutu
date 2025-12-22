import { useState, useEffect } from 'react';
import { Search, Filter, X, Hash, Layers, Monitor, Compass } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ImageCard from '../components/ImageCard';

export default function Discover() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [wallpapers, setWallpapers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters from URL (Multi-select)
    const activeCategories = searchParams.get('categories') ? searchParams.get('categories').split(',').filter(Boolean) : [];
    const activeTags = searchParams.get('tags') ? searchParams.get('tags').split(',').filter(Boolean) : [];
    const searchQuery = searchParams.get('q') || '';

    const hasFilters = activeCategories.length > 0 || activeTags.length > 0 || searchQuery;

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
        if (!hasFilters) {
            setWallpapers([]);
            return;
        }

        const fetchWallpapers = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                activeCategories.forEach(c => params.append('categories', c));
                activeTags.forEach(t => params.append('tags', t));
                if (searchQuery) params.append('search', searchQuery);

                const res = await fetch(`/api/wallpapers?${params.toString()}`);
                if (res.ok) {
                    setWallpapers(await res.json());
                }
            } catch (err) {
                console.error('Fetch wallpapers fail', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWallpapers();
    }, [searchParams, hasFilters]);

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
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-gray-900">探索发现</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Explore for inspiration</p>
                    </div>
                    {hasFilters && (
                        <button
                            onClick={() => setSearchParams({})}
                            className="bg-red-50 text-red-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 active:scale-90 transition"
                        >
                            <X size={12} /> 重置全部
                        </button>
                    )}
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="模糊检索：尝试输入关键词..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black placeholder:text-gray-300 transition-all font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Section */}
            <div className="px-4 py-4 space-y-8">
                {/* Categories */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                        <Layers size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">分类检索</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => toggleFilter('categories', cat.name)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${activeCategories.includes(cat.name)
                                    ? 'bg-black text-white border-black shadow-xl shadow-black/20 scale-105'
                                    : 'bg-white text-gray-400 border-gray-100'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Popular Tags */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-900">
                        <Hash size={14} className="text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">热门标签</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 15).map(tag => (
                            <button
                                key={tag.id}
                                onClick={() => toggleFilter('tags', tag.name)}
                                className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all border ${activeTags.includes(tag.name)
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                    : 'bg-gray-100 text-gray-400 border-transparent'
                                    }`}
                            >
                                #{tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="px-4 mt-6">
                {!hasFilters ? (
                    <div className="py-20 flex flex-col items-center text-center space-y-6">
                        <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200">
                            <Compass size={40} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900 tracking-tight">开启你的像素探索之旅</p>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-2">Select filters or type keywords to start</p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Pixel Matching...</span>
                    </div>
                ) : wallpapers.length === 0 ? (
                    <div className="py-16 flex flex-col items-center text-center space-y-6">
                        <img
                            src="file:///C:/Users/sems.wlcs2/.gemini/antigravity/brain/a4658014-6fe8-4126-ba75-1546cb553d03/no_results_illustration_1766371853821.png"
                            className="w-48 h-auto opacity-80"
                            alt="No results"
                        />
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight">未找到匹配的素材</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Try adjusting filters or search keywords</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-6 px-1 text-gray-400">
                            <Filter size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Match Results ({wallpapers.length})</span>
                        </div>
                        <div className="columns-2 gap-3 space-y-3 pb-20">
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

