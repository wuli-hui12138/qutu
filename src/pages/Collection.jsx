import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, Heart, Clock, ChevronLeft, Layers } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import EmptyState from '../components/EmptyState';

export default function Collection() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const type = searchParams.get('type') || 'likes'; // 'likes' or 'history'

    const [allImages, setAllImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('全部');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let rawData = [];
                const user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
                const userId = user.id;

                if (userId) {
                    // Try to fetch from Cloud
                    const res = await fetch(`/api/interactions/${type === 'likes' ? 'favorites' : 'history'}/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        // For interactions API, the result is in { image: {...} } format or direct array
                        rawData = data.map(item => item.image || item);
                    }
                } else {
                    // Fallback to LocalStorage
                    let ids = [];
                    if (type === 'likes') {
                        ids = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
                    } else {
                        const history = JSON.parse(localStorage.getItem('qutu_history') || '[]');
                        ids = history.map(item => item.id);
                    }

                    if (ids.length > 0) {
                        const res = await fetch(`/api/wallpapers?ids=${ids.join(',')}`);
                        if (res.ok) {
                            rawData = await res.json();
                            if (type === 'history') {
                                const historyOrder = JSON.parse(localStorage.getItem('qutu_history') || '[]');
                                const orderMap = new Map();
                                historyOrder.forEach((item, index) => orderMap.set(item.id, index));
                                rawData.sort((a, b) => orderMap.get(a.id) - orderMap.get(b.id));
                            }
                        }
                    }
                }

                setAllImages(rawData);
                setFilteredImages(rawData);

                // Extract categories from data
                const cats = new Set(['全部']);
                rawData.forEach(img => {
                    if (img.categories) {
                        img.categories.forEach(c => cats.add(typeof c === 'string' ? c : c.name));
                    }
                });
                setCategories(Array.from(cats));

            } catch (err) {
                console.error('Failed to load collection', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [type]);

    useEffect(() => {
        let result = allImages;

        if (activeCategory !== '全部') {
            result = result.filter(img =>
                img.categories?.some(c => (typeof c === 'string' ? c : c.name) === activeCategory)
            );
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(img =>
                img.title?.toLowerCase().includes(q) ||
                img.tags?.some(t => {
                    const tagName = typeof t === 'string' ? t : t.name;
                    return tagName.toLowerCase().includes(q);
                })
            );
        }

        setFilteredImages(result);
    }, [activeCategory, searchQuery, allImages]);

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <div className="pt-14 pb-4 px-4 bg-white space-y-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-2xl tracking-tighter text-gray-900 flex items-center gap-2">
                            {type === 'likes' ? <><Heart size={20} className="text-red-500 fill-red-500" /> 我的喜欢</> : <><Clock size={20} className="text-indigo-500" /> 浏览历史</>}
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            {filteredImages.length}条已记录 · {type === 'likes' ? 'Your Hearted Pixels' : 'Your Recent Footprints'}
                        </p>
                    </div>
                </div>

                {/* Local Search */}
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder={`在${type === 'likes' ? '喜欢' : '历史'}中搜索...`}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black placeholder:text-gray-300 transition-all font-bold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-4 py-2">
                <div className="flex items-center gap-2 mb-3">
                    <Layers size={14} className="text-gray-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">分类筛选</span>
                </div>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${activeCategory === cat
                                ? 'bg-black text-white border-black shadow-lg shadow-black/10'
                                : 'bg-gray-50 text-gray-400 border-transparent'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="px-4 mt-4">
                {loading ? (
                    <div className="py-20 flex justify-center uppercase font-black text-[10px] text-gray-300 tracking-[0.3em] animate-pulse">Loading Collection...</div>
                ) : filteredImages.length > 0 ? (
                    <div className="columns-2 gap-3 space-y-3 pb-10">
                        {filteredImages.map(item => (
                            <ImageCard
                                key={item.id}
                                id={item.id}
                                src={item.thumb}
                                blurData={item.blurData}
                                title={item.title}
                                categories={item.categories}
                                tags={item.tags}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        message="暂无匹配内容"
                        subMessage="No matching pixels found"
                        icon={type === 'likes' ? Heart : Clock}
                    />
                )}
            </div>
        </div>
    );
}
