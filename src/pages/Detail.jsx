import { useNavigate, useParams, Link } from 'react-router-dom';
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
    const [previewType, setPreviewType] = useState(null); // 'mobile', 'pc', 'avatar', null

    useEffect(() => {
        setLoading(true);
        fetch(`/api/wallpapers/${id}`)
            .then(res => res.json())
            .then(data => {
                setImage(data);

                // Record History
                recordHistory(data);

                // Check if liked
                const likes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
                setIsLiked(likes.includes(data.id));

                // Fetch related if tags exist
                if (data && data.tags && data.tags.length > 0) {
                    const firstTag = data.tags[0].name;
                    fetch(`/api/wallpapers/related/${firstTag}`)
                        .then(res => res.json())
                        .then(rel => setRelated(rel.filter(item => item.id !== data.id))) // Exclude current
                        .catch(err => console.error(err));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const recordHistory = (img) => {
        if (!img) return;
        const history = JSON.parse(localStorage.getItem('qutu_history') || '[]');
        const filtered = history.filter(item => item.id !== img.id);
        const newHistory = [{
            id: img.id,
            thumb: img.thumb,
            title: img.title,
            time: new Date().getTime()
        }, ...filtered].slice(0, 50); // Keep last 50
        localStorage.setItem('qutu_history', JSON.stringify(newHistory));
    };

    const toggleLike = () => {
        if (!image) return;
        const likes = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
        let newLikes;
        if (likes.includes(image.id)) {
            newLikes = likes.filter(itemId => itemId !== image.id);
        } else {
            newLikes = [...likes, image.id];
        }
        localStorage.setItem('qutu_likes', JSON.stringify(newLikes));
        setIsLiked(!isLiked);

        // Optional: Sync with backend
        fetch(`/api/wallpapers/${image.id}/like`, { method: 'POST' }).catch(() => { });
    };

    const handleDownload = () => {
        // In a real local dev, image.url might be /uploads/xxx.
        // We'll just open it in a new tab.
        window.open(image.url, '_blank');
        setShowModal(true);
    };

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
    </div>;
    if (!image) return <div className="h-screen bg-black flex items-center justify-center text-white font-bold tracking-widest uppercase">Pixel Lost</div>;

    return (
        <div className="min-h-screen w-full bg-black relative flex flex-col pb-10">
            {/* 沉浸式顶部 */}
            <div className="absolute top-0 w-full pt-14 px-4 z-40 flex justify-between items-center pointer-events-none">
                <div
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white cursor-pointer pointer-events-auto active:scale-90 transition"
                >
                    <ChevronLeft size={24} />
                </div>
            </div>

            {/* Main Image Container (Changed to responsive) */}
            <div className="w-full min-h-[50vh] max-h-[75vh] flex items-center justify-center p-4 shrink-0 overflow-hidden">
                <motion.img
                    layoutId={`img-${image.id}`}
                    src={image.url}
                    className="w-full max-h-full object-contain rounded-3xl"
                    alt={image.title}
                />
            </div>

            {/* 信息面板 (不再绝对定位，适应图片高度) */}
            <div className="px-6 pb-20 pt-4 flex-1">
                <div className="bg-white/5 backdrop-blur-2xl rounded-[32px] p-8 border border-white/10 shadow-2xl">
                    {/* 信息面板 */}
                    <div className="mb-8 space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-white text-2xl font-black tracking-tight">{image.title}</h2>
                            <div className="flex items-center gap-3">
                                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Captured at {new Date(image.createdAt).toLocaleDateString()}</p>
                                {image.topic && (
                                    <div
                                        onClick={() => navigate(`/topics/${image.topic.id}`)}
                                        className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded text-indigo-300 text-[9px] font-black uppercase cursor-pointer hover:bg-indigo-500/30 transition-colors"
                                    >
                                        <Layers size={10} /> 专题: {image.topic.title}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 分类与标签 (移动到描述上方，支持展开/收起) */}
                        <ExpandableTags categories={image.categories} tags={image.tags} />

                        {/* 图片描述 (移动到标签下方) */}
                        {image.description && (
                            <div className="flex items-start gap-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 mt-6 min-h-[80px]">
                                <Info size={14} className="text-purple-400 mt-0.5 shrink-0" />
                                <p className="text-gray-200 text-xs leading-relaxed font-medium">
                                    {image.description}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPreviewType('mobile')}
                                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                            >
                                <Smartphone size={14} /> 手机预览
                            </button>
                            <button
                                onClick={() => setPreviewType('pc')}
                                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                            >
                                <Monitor size={14} /> 电脑预览
                            </button>
                            <button
                                onClick={() => setPreviewType('avatar')}
                                className="flex-1 bg-white/10 backdrop-blur-xl border border-white/10 text-white h-12 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
                            >
                                <User size={14} /> 头像预览
                            </button>
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={handleDownload}
                                className="flex-1 bg-white text-gray-900 h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition shadow-xl shadow-white/10"
                            >
                                <Download size={18} />
                                下载超清原图
                            </button>
                            <div className="flex gap-4">
                                <CircleBtn
                                    onClick={toggleLike}
                                    icon={
                                        <motion.div
                                            whileTap={{ scale: 0.8 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        >
                                            <Heart size={22} className={isLiked ? "fill-white" : ""} />
                                        </motion.div>
                                    }
                                    activeColor={isLiked ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] border-none" : "bg-white/10"}
                                />
                                <CircleBtn icon={<Share2 size={22} />} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Images Section */}
            {related.length > 0 && (
                <div className="px-6 py-10 bg-black">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-black flex items-center text-sm uppercase tracking-widest">
                            <ImageIcon size={16} className="mr-2 text-indigo-400" />
                            相关像素灵感
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
            )}

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
    )
}

function ExpandableTags({ categories = [], tags = [] }) {
    const [expanded, setExpanded] = useState(false);
    const hasMore = tags.length > 8;
    const displayTags = expanded ? tags : tags.slice(0, 8);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap mb-2">
                {categories.map(cat => <CategoryTag key={cat.id} text={cat.name} />)}
                {displayTags.map(tag => <Tag key={tag.id} text={`#${tag.name}`} />)}

                {hasMore && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="bg-white/5 backdrop-blur-md text-indigo-300 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-400/20 active:scale-95 transition"
                    >
                        {expanded ? '收起' : `展开+${tags.length - 8}`}
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


