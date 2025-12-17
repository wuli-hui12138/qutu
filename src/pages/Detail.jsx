import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Download, Check, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Detail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [related, setRelated] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/wallpapers/${id}`)
            .then(res => res.json())
            .then(data => {
                setImage(data);
                // Fetch related if tags exist
                if (data && data.tags) {
                    const firstTag = data.tags.split(',')[0];
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

    const handleDownload = () => {
        setShowModal(true);
    };

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white">加载中...</div>;
    if (!image) return <div className="h-screen bg-black flex items-center justify-center text-white">未找到图片</div>;

    return (
        <div className="min-h-screen w-full bg-black relative flex flex-col pb-10">
            {/* 沉浸式顶部 */}
            <div className="absolute top-0 w-full pt-14 px-4 z-40 flex justify-between items-center pointer-events-none">
                <div
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer pointer-events-auto active:scale-95 transition"
                >
                    <ChevronLeft size={20} />
                </div>
                {/* Capsule Dark */}
                <div className="flex items-center justify-around w-20 h-8 bg-black/20 border border-white/20 rounded-full backdrop-blur-sm pointer-events-auto">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>

            {/* Main Image Container */}
            <div className="w-full h-[85vh] relative shrink-0">
                <img
                    src={image.url}
                    className="w-full h-full object-cover"
                    alt={image.title}
                />

                {/* 底部渐变遮罩 */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end pb-8 px-5 pt-32">
                    {/* 作者信息 (Mock) */}
                    <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-700 flex items-center justify-center text-white text-xs">
                            Q
                        </div>
                        <div className="ml-3 text-shadow">
                            <p className="text-white text-sm font-bold">{image.title}</p>
                            <p className="text-gray-300 text-[10px] mt-0.5">发布于 {new Date(image.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button className="ml-auto bg-purple-600/80 backdrop-blur text-white text-xs px-4 py-1.5 rounded-full font-medium active:scale-95 transition">关注</button>
                    </div>

                    {/* 标签 */}
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {image.tags ? image.tags.split(',').map(tag => <Tag key={tag} text={`#${tag}`} />) : <Tag text="#壁纸" />}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-between items-center gap-4">
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-white text-gray-900 h-12 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition"
                        >
                            <Download size={18} />
                            下载
                        </button>
                        <div className="flex gap-4">
                            <CircleBtn icon={<Heart size={20} />} activeColor={image.likes > 0 ? "bg-red-500 border-none" : ""} />
                            <CircleBtn icon={<Share2 size={20} />} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Images Section */}
            {related.length > 0 && (
                <div className="px-4 py-6">
                    <h3 className="text-white font-bold mb-4 flex items-center text-sm">
                        <ImageIcon size={16} className="mr-2 text-purple-400" />
                        更多相关推荐
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {related.map(item => (
                            <Link to={`/detail/${item.id}`} key={item.id} className="aspect-[3/4] rounded-lg overflow-hidden relative active:opacity-80 transition">
                                <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Download Success Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 flex flex-col items-center w-72 relative z-10"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <Check size={32} />
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg mb-2">保存成功</h3>
                            <p className="text-center text-gray-500 text-sm mb-6">图片已保存至系统相册</p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 rounded-full border border-gray-200 text-gray-600 text-sm active:bg-gray-50"
                                >
                                    留在本页
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="flex-1 py-2 rounded-full bg-purple-600 text-white text-sm active:bg-purple-700"
                                >
                                    返回列表
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function Tag({ text }) {
    return <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs">{text}</span>
}

function CircleBtn({ icon, activeColor }) {
    return (
        <button className={`w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-95 transition ${activeColor}`}>
            {icon}
        </button>
    )
}

