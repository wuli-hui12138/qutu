import { useNavigate, useParams, Link } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronLeft, Heart, Share2, Download, Check, Image as ImageIcon, Info, Smartphone, Monitor, User, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PreviewOverlay from '../components/PreviewOverlay';

export default function Detail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [related, setRelated] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [previewType, setPreviewType] = useState(null); // 'mobile', 'pc', 'avatar', null

    useEffect(() => {
        setLoading(true);
        fetch(`/api/wallpapers/${id}`)
            .then(res => res.json())
            .then(async data => {
                setImage(data);
                recordHistory(data);

                // Fetch Recommendations (4 from tags, 2 from categories)
                try {
                    const tagNames = (data.tags || []).map(t => t.name).join(',');
                    const catNames = (data.categories || []).map(c => c.name).join(',');

                    const [tagRes, catRes] = await Promise.all([
                        fetch(`/api/wallpapers?tags=${tagNames}&limit=10`),
                        fetch(`/api/wallpapers?categories=${catNames}&limit=10`)
                    ]);

                    const tagRelated = tagRes.ok ? await tagRes.json() : [];
                    const catRelated = catRes.ok ? await catRes.json() : [];

                    // 4+2 logic
                    const fromTags = tagRelated.filter(t => t.id !== data.id).slice(0, 4);
                    const fromCats = catRelated
                        .filter(c => c.id !== data.id && !fromTags.some(t => t.id === c.id))
                        .slice(0, 2);

                    setRelated([...fromTags, ...fromCats]);
                } catch (err) {
                    console.error('Failed to fetch recommendations', err);
                }

                setLoading(false);

                // Initialize like state
                const likes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
                setIsLiked(likes.includes(data.id));
                setLikeCount(data.likes || 0);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const recordHistory = async (img) => {
        if (!img) return;

        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;

        // Local storage record
        const history = JSON.parse(localStorage.getItem('qutu_history') || '[]');
        const filtered = history.filter(item => item.id !== img.id);
        const newHistory = [{
            id: img.id,
            thumb: img.thumb,
            title: img.title,
            time: new Date().getTime()
        }, ...filtered].slice(0, 50);
        localStorage.setItem('qutu_history', JSON.stringify(newHistory));

        // Cloud sync if logged in
        if (userId) {
            try {
                await fetch('/api/interactions/history', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, imageId: img.id })
                });
            } catch (err) {
                console.error('Failed to sync history', err);
            }
        }
    };

    const toggleLike = async () => {
        const qutu_user = JSON.parse(localStorage.getItem('qutu_user') || '{}');
        const userId = qutu_user.id;

        // Optimistic update
        const prevLiked = isLiked;
        setIsLiked(!prevLiked);
        setLikeCount(prev => prevLiked ? prev - 1 : prev + 1);

        if (userId) {
            try {
                const res = await fetch('/api/interactions/favorite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, imageId: image.id })
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsLiked(data.isLiked);
                    setLikeCount(data.likes);

                    let finalLikes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
                    if (data.isLiked) {
                        if (!finalLikes.includes(image.id)) finalLikes.push(image.id);
                    } else {
                        finalLikes = finalLikes.filter(id => id !== image.id);
                    }
                    localStorage.setItem('qutu_likes', JSON.stringify(finalLikes));
                }
            } catch (err) {
                console.error('Failed to sync favorite', err);
                setIsLiked(prevLiked);
            }
        } else {
            let localLikes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
            if (prevLiked) {
                localLikes = localLikes.filter(id => id !== image.id);
            } else {
                localLikes = [...localLikes, image.id];
            }
            localStorage.setItem('qutu_likes', JSON.stringify(localLikes));
        }
    };

    const handleDownload = () => {
        // In a real local dev, image.url might be /uploads/xxx.
        // We'll just open it in a new tab.
        window.open(image.url, '_blank');
        setShowModal(true);
    };

    if (loading) return (
        <div className="h-screen bg-black flex items-center justify-center text-white">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>
    );
    if (!image) return (
        <div className="h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">
            Pixel Lost
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-black relative flex flex-col pb-10">
            {/* 顶部导航 (非悬浮) */}
            <div className="w-full flex justify-between items-center px-6 py-4 bg-black border-b border-white/5">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => { /* share logic */ }}
                        className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white active:scale-95 transition-all"
                    >
                        <Share2 size={18} />
                    </button>
                    <button
                        onClick={toggleLike}
                        className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                            isLiked
                                ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                                : "bg-white/5 border-white/10 text-white"
                        )}
                    >
                        <Heart size={18} className={isLiked ? "fill-white" : ""} />
                    </button>
                </div>
            </div>

            {/* Main Image Container (Changed to responsive) */}
            <div className="w-full min-h-[50vh] max-h-[75vh] flex items-center justify-center p-4 shrink-0 overflow-hidden relative">
                <motion.img
                    layoutId={`img-${image.id}`}
                    src={image.url}
                    className="w-full max-h-full object-contain rounded-3xl"
                    alt={image.title}
                />
            </div>

            {/* 快捷预览功能 (移动至此) */}
            <div className="flex gap-3 px-6 py-4">
                <button
                    onClick={() => setPreviewType('mobile')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <Smartphone size={14} /> 手机预览
                </button>
                <button
                    onClick={() => setPreviewType('pc')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <Monitor size={14} /> 电脑预览
                </button>
                <button
                    onClick={() => setPreviewType('avatar')}
                    className="flex-1 bg-white/5 border border-white/10 text-white h-11 rounded-2xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                >
                    <User size={14} /> 头像预览
                </button>
            </div>

            {/* 信息面板 (不再绝对定位，适应图片高度) */}
            <div className="px-6 pb-20 pt-4 flex-1">
                <div className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
                    {/* 信息面板 */}
                    <div className="mb-8 space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="text-white text-2xl font-black tracking-tight leading-tight flex-1">{image.title}</h2>
                                <div className="flex flex-col items-end shrink-0 pt-1">
                                    <div className="text-[12px] font-black text-white flex items-center gap-1 mb-0.5">
                                        <Heart size={12} className="text-red-500 fill-red-500" />
                                        {likeCount}
                                    </div>
                                    <div className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Fans LIKED</div>
                                </div>
                            </div>

                            {/* Improved Author Section - Below Title */}
                            <div className="flex items-center gap-3 py-1">
                                <Link to={`/profile/${image.author?.id}`} className="flex items-center gap-2 group">
                                    <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 ring-2 ring-white/5 group-hover:ring-indigo-500/50 transition-all">
                                        <img
                                            src={image.author?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                            className="w-full h-full object-cover"
                                            alt="author"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-white text-[11px] font-black group-hover:text-indigo-400 transition-colors uppercase tracking-wide">{image.author?.nickname || "未名画师"}</div>
                                        <div className="text-[7px] text-gray-500 font-bold uppercase tracking-[0.1em] mt-0.5 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                                            Verified Artist
                                        </div>
                                    </div>
                                </Link>
                                <div className="h-3 w-px bg-white/10 mx-1"></div>
                                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest leading-none">
                                    {new Date(image.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* 分类与标签 (移动到描述上方，支持展开/收起) */}
                        <ExpandableTags categories={image.categories} tags={image.tags} />
                    </div>

                    {/* 图片描述 (带一键绘图功能) */}
                    {image.description && (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6 min-h-[80px]">
                            <div className="flex items-start gap-2 mb-3">
                                <Info size={13} className="text-purple-400 mt-0.5 shrink-0" />
                                <p className="text-gray-300 text-[11px] leading-relaxed font-medium">
                                    {image.description}
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/ai/image', { state: { prompt: image.description } })}
                                className="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                            >
                                <Sparkles size={12} />
                                一键以此灵感绘图
                            </button>
                        </div>
                    )}
                </div>

                {/* 操作按钮 (移除点赞按钮) */}
                <div className="px-6 py-8">
                    <button
                        onClick={handleDownload}
                        className="w-full bg-white text-gray-900 h-16 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-[0.98] transition shadow-2xl shadow-indigo-500/10"
                    >
                        <Download size={20} />
                        保存高清原图
                    </button>
                </div>

                {/* Related Images Section */}
                {
                    related.length > 0 && (
                        <div className="px-6 py-10 bg-black">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-white font-black flex items-center text-[10px] uppercase tracking-[0.25em]">
                                    <ImageIcon size={14} className="mr-3 text-indigo-400" />
                                    相关推荐
                                </h3>
                                <div className="h-px flex-1 mx-4 bg-white/10"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {related.map(item => (
                                    <Link to={`/detail/${item.id}`} key={item.id} className="aspect-[3/4] rounded-xl overflow-hidden relative active:scale-95 transition group">
                                        <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Preview Overlay */}
                <AnimatePresence>
                    {previewType && (
                        <PreviewOverlay
                            type={previewType}
                            imageSrc={image.url}
                            onClose={() => setPreviewType(null)}
                        />
                    )}
                </AnimatePresence>

                {/* Download Success Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white rounded-[32px] p-8 flex flex-col items-center w-full max-w-sm relative z-10"
                            >
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6">
                                    <Check size={40} />
                                </div>
                                <h3 className="font-black text-gray-900 text-xl mb-2 tracking-tight">保存成功</h3>
                                <p className="text-center text-gray-400 text-sm font-medium mb-8">高清像素已在您的下载任务中，快去设为壁纸吧！</p>

                                <div className="flex flex-col w-full gap-3">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="w-full py-4 rounded-2xl bg-black text-white text-sm font-black uppercase tracking-widest active:scale-95 transition"
                                    >
                                        返回发现列表
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-4 rounded-2xl border border-gray-100 text-gray-400 text-sm font-black uppercase tracking-widest active:bg-gray-50 transition"
                                    >
                                        留在本页
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ExpandableTags({ categories = [], tags = [] }) {
    const [expanded, setExpanded] = useState(false);
    const limit = 6;

    // Merge categories and tags for unified limiting
    const allItems = [
        ...(categories || []).map(c => ({ type: 'category', ...c })),
        ...(tags || []).map(t => ({ type: 'tag', ...t }))
    ];

    const hasMore = allItems.length > limit;
    const displayItems = expanded ? allItems : allItems.slice(0, limit);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap mb-2">
                {displayItems.map((item, idx) => (
                    item.type === 'category'
                        ? <CategoryTag key={`cat-${item.id}`} text={item.name} />
                        : <Tag key={`tag-${item.id}`} text={`#${item.name}`} />
                ))}

                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="bg-white/5 backdrop-blur-md text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-400/20 active:scale-95 transition"
                    >
                        {expanded ? '收起' : `展开+${allItems.length - limit}`}
                    </button>
                )}
            </div>
        </div>
    );
}

function Tag({ text }) {
    return <span className="bg-white/5 backdrop-blur-md text-white/60 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">{text}</span>
}

function CategoryTag({ text }) {
    return <span className="bg-indigo-600/30 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-400/20">{text}</span>
}

function CircleBtn({ icon, activeColor, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition transform ${activeColor}`}
        >
            {icon}
        </button>
    )
}


