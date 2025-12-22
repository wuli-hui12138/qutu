import { useState, useEffect } from 'react';
import { Search, Check, X, Trash2, Eye, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ImageManagement() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const [editingImage, setEditingImage] = useState(null);
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/wallpapers/admin?search=${encodeURIComponent(search)}`);
            if (res.ok) {
                setImages(await res.json());
            }
        } catch (err) {
            console.error('Fetch images fail', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [catsRes, tagsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/tags')
                ]);
                setAvailableCategories(await catsRes.json());
                setAvailableTags(await tagsRes.json());
            } catch (err) {
                console.error('Fetch metadata fail', err);
            }
        };
        fetchMetadata();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchImages();
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await fetch(`/api/wallpapers/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setImages(prev => prev.map(img => img.id === id ? { ...img, status } : img));
            }
        } catch (err) {
            alert('操作失败');
        }
    };

    const handleUpdateMetadata = async (id, data) => {
        try {
            const res = await fetch(`/api/wallpapers/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const updated = await res.json();
                setImages(prev => prev.map(img => img.id === id ? updated : img));
                setEditingImage(null);
            }
        } catch (err) {
            alert('更新失败');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('确定要永久删除这张图片及其文件吗？')) return;
        try {
            const res = await fetch(`/api/wallpapers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setImages(prev => prev.filter(img => img.id !== id));
            }
        } catch (err) {
            alert('删除失败');
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20 pt-14 px-4 overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter">图片管理</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Image Audit & Control</p>
                </div>
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-full active:scale-95 transition">
                    <X size={20} />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="按标题或描述进行全局检索..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-black placeholder:text-gray-300 transition-all font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard label="待审核" count={images.filter(i => i.status === 'PENDING').length} color="text-amber-500" />
                <StatCard label="已上线" count={images.filter(i => i.status === 'APPROVED').length} color="text-emerald-500" />
                <StatCard label="总计" count={images.length} color="text-gray-900" />
            </div>

            {/* List */}
            <div className="space-y-4 pb-10">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : images.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                        <p className="text-gray-300 text-xs font-bold uppercase tracking-widest">No images found</p>
                    </div>
                ) : images.map(img => (
                    <div key={img.id} className="bg-white border border-gray-100 rounded-3xl p-3 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                            <img src={img.thumb} className="w-full h-full object-cover" alt="" />
                            <div className={`absolute top-1 right-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-white shadow-sm ${img.status === 'APPROVED' ? 'bg-emerald-500' :
                                img.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                                }`}>
                                {img.status}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black text-gray-900 truncate tracking-tight">{img.title || 'Untitled'}</h3>
                                <div className="flex flex-wrap gap-1">
                                    {img.categories?.map(cat => (
                                        <span key={cat.id} className="text-[8px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded tracking-tighter capitalize">
                                            {cat.name}
                                        </span>
                                    ))}
                                    {img.tags?.slice(0, 2).map(tag => (
                                        <span key={tag.id} className="text-[8px] font-bold text-gray-400 bg-gray-50 px-1 py-0.5 rounded tracking-tighter capitalize">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                {img.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleUpdateStatus(img.id, 'APPROVED')}
                                        className="flex-1 h-8 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition flex items-center justify-center gap-1"
                                    >
                                        <CheckCircle size={12} /> 通过
                                    </button>
                                )}
                                <button
                                    onClick={() => setEditingImage(img)}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl active:scale-95 transition"
                                    title="编辑"
                                >
                                    <Filter size={14} />
                                </button>
                                <button
                                    onClick={() => navigate(`/detail/${img.id}`)}
                                    className="p-2 bg-gray-50 text-gray-500 rounded-xl active:scale-95 transition"
                                >
                                    <Eye size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="p-2 bg-rose-50 text-rose-500 rounded-xl active:scale-95 transition"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingImage && (
                <EditModal
                    image={editingImage}
                    availableCategories={availableCategories}
                    availableTags={availableTags}
                    onClose={() => setEditingImage(null)}
                    onSave={(data) => handleUpdateMetadata(editingImage.id, data)}
                />
            )}
        </div>
    );
}

function EditModal({ image, availableCategories, availableTags, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: image.title || '',
        description: image.description || '',
        categories: image.categories?.map(c => c.name).join(',') || '',
        tags: image.tags?.map(t => t.name).join(',') || ''
    });

    const toggleMetadata = (type, name) => {
        const current = formData[type] ? formData[type].split(',').map(t => t.trim()).filter(Boolean) : [];
        let next;
        if (current.includes(name)) {
            next = current.filter(t => t !== name);
        } else {
            next = [...current, name];
        }
        setFormData({ ...formData, [type]: next.join(',') });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] p-6 relative z-10 max-h-[90vh] overflow-y-auto hide-scrollbar shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden"></div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-gray-900 tracking-tighter">编辑图片详情</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full active:scale-90 transition"><X size={18} /></button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">作品标题</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm font-bold"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">描述信息</label>
                        <textarea
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm h-24 resize-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">所属分类 (可多选)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleMetadata('categories', cat.name)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${formData.categories.split(',').includes(cat.name)
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20 scale-105'
                                        : 'bg-white text-gray-400 border-gray-100'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">标签云 (可多选)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.id}
                                    onClick={() => toggleMetadata('tags', tag.name)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all border ${formData.tags.split(',').includes(tag.name)
                                        ? 'bg-purple-600 text-white border-purple-600'
                                        : 'bg-gray-100 text-gray-400 border-transparent'
                                        }`}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="逗号分隔手动输入..."
                            className="w-full mt-3 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mt-10 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest active:scale-95 transition">取消</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="flex-[2] py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest active:scale-95 transition shadow-xl shadow-gray-200"
                    >
                        保存更改
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, count, color }) {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{label}</p>
            <p className={`text-xl font-black ${color}`}>{count}</p>
        </div>
    );
}
