import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Trash2, Save, ExternalLink, ToggleLeft, ToggleRight, ListOrdered } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BannerManagement() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/banners');
            const data = await res.json();
            setBanners(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        const newBanner = {
            title: '新 Banner',
            imageUrl: '',
            link: '',
            order: banners.length,
            isActive: true,
            isNew: true
        };
        setBanners([...banners, newBanner]);
    };

    const handleSave = async (banner) => {
        setSaving(true);
        try {
            const method = banner.id ? 'PATCH' : 'POST';
            const url = banner.id ? `/api/banners/${banner.id}` : '/api/banners';

            // Clean up temporary props
            const { isNew, ...payload } = banner;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                fetchBanners();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            setBanners(banners.filter(b => b.id));
            return;
        }
        if (!window.confirm('确定删除此 Banner 吗？')) return;

        try {
            await fetch(`/api/banners/${id}`, { method: 'DELETE' });
            fetchBanners();
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (index, field, value) => {
        const newBanners = [...banners];
        newBanners[index][field] = value;
        setBanners(newBanners);
    };

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <div className="pt-14 pb-4 px-4 bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-50">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 rounded-xl text-gray-400 active:scale-90 transition">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-black text-xl tracking-tighter text-gray-900">Banner 管理</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Home Page Banners</p>
                    </div>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-90 transition shadow-lg shadow-black/20"
                >
                    <Plus size={14} /> 新增
                </button>
            </div>

            {/* List */}
            <div className="p-4 space-y-6">
                {loading ? (
                    <div className="py-20 flex justify-center uppercase font-black text-[10px] text-gray-300 tracking-[0.3em] animate-pulse">Loading Banners...</div>
                ) : banners.length > 0 ? (
                    banners.map((banner, index) => (
                        <div key={banner.id || index} className="bg-gray-50 rounded-[28px] p-6 space-y-4 border border-gray-100 shadow-sm relative overflow-hidden group">
                            {/* Preview image */}
                            {banner.imageUrl && (
                                <div className="w-full aspect-[21/9] bg-gray-200 rounded-[20px] overflow-hidden mb-4 border border-gray-100">
                                    <img src={banner.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Banner 标题</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold"
                                        value={banner.title || ''}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="输入标题..."
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">图片地址 (URL)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold"
                                        value={banner.imageUrl || ''}
                                        onChange={(e) => handleChange(index, 'imageUrl', e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">跳转链接 (可选)</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold"
                                            value={banner.link || ''}
                                            onChange={(e) => handleChange(index, 'link', e.target.value)}
                                            placeholder="/discover..."
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">权重排序 (数字)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold"
                                            value={banner.order}
                                            onChange={(e) => handleChange(index, 'order', parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                                <button
                                    onClick={() => handleChange(index, 'isActive', !banner.isActive)}
                                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${banner.isActive ? 'text-green-500' : 'text-gray-300'}`}
                                >
                                    {banner.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    {banner.isActive ? '已启用' : '已禁用'}
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="p-3 bg-red-50 text-red-500 rounded-2xl active:scale-90 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleSave(banner)}
                                        disabled={saving}
                                        className="p-3 bg-indigo-600 text-white rounded-2xl active:scale-90 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center gap-4 text-gray-300">
                        <Plus className="w-16 h-16 border-2 border-dashed rounded-3xl p-4 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Banners Created</span>
                    </div>
                )}
            </div>
        </div>
    );
}
