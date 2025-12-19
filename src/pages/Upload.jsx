import { useState, useEffect } from 'react';
import { Upload as UploadIcon, Check, Image as ImageIcon, X, Hash, LayoutGrid, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        tags: '',
        description: ''
    });
    const [status, setStatus] = useState('idle');
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, tagsRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/tags')
                ]);
                if (catsRes.ok) {
                    const cats = await catsRes.json();
                    setAvailableCategories(cats);
                    if (cats.length > 0) {
                        setFormData(prev => ({ ...prev, category: cats[0].name }));
                    }
                }
                if (tagsRes.ok) {
                    setAvailableTags(await tagsRes.json());
                }
            } catch (err) {
                console.error('Failed to pre-fetch categories/tags', err);
            }
        };
        fetchData();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    const toggleTag = (name) => {
        const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
        if (currentTags.includes(name)) {
            setFormData({ ...formData, tags: currentTags.filter(t => t !== name).join(',') });
        } else {
            setFormData({ ...formData, tags: [...currentTags, name].join(',') });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('请先选择图片');
        if (!formData.category) return alert('请选择分类');

        setStatus('loading');
        const data = new FormData();
        data.append('file', file);
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('tags', formData.tags);
        data.append('description', formData.description);

        try {
            const res = await fetch('/api/wallpapers', { method: 'POST', body: data });
            if (res.ok) {
                setStatus('success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="bg-white min-h-screen pb-20 pt-14 px-4 overflow-y-auto hide-scrollbar">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <UploadIcon className="mr-2" /> 上传发布
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div
                    onClick={() => document.getElementById('fileInput').click()}
                    className="w-full h-64 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 relative cursor-pointer active:bg-gray-100 transition shadow-sm"
                >
                    {preview ? (
                        <img src={preview} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <UploadIcon size={48} className="mb-2 opacity-20" />
                            <span className="text-sm font-medium">点击上传图片</span>
                        </div>
                    )}
                </div>

                <input id="fileInput" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">标题</label>
                    <input
                        type="text"
                        required
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        placeholder="给作品起个好听的名字..."
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">全部分类</label>
                        <div className="flex flex-wrap gap-2">
                            {availableCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.name })}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${formData.category === cat.name
                                        ? 'bg-purple-600 text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                            {availableCategories.length === 0 && (
                                <button type="button" onClick={() => navigate('/settings/categories')} className="text-xs text-purple-600 flex items-center">
                                    <Plus size={14} className="mr-1" /> 去创建分类
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">常用标签</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {availableTags.map(tag => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => toggleTag(tag.name)}
                                className={`px-3 py-1.5 rounded-full text-xs transition-all border ${formData.tags.split(',').includes(tag.name)
                                    ? 'bg-purple-50 border-purple-200 text-purple-600'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-purple-100'
                                    }`}
                            >
                                #{tag.name}
                            </button>
                        ))}
                        {availableTags.length === 0 && (
                            <button type="button" onClick={() => navigate('/settings/tags')} className="text-xs text-purple-600 flex items-center">
                                <Plus size={14} className="mr-1" /> 去创建标签
                            </button>
                        )}
                    </div>
                    <input
                        type="text"
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm text-sm"
                        placeholder="或手动输入标签，用逗号分隔"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">描述 (可选)</label>
                    <textarea
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm text-sm h-24 resize-none"
                        placeholder="关于这张图的更多细节..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="bg-amber-50 rounded-xl p-4 flex gap-3 items-start border border-amber-100">
                    <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px] font-bold">!</div>
                    <div className="space-y-1">
                        <p className="text-[11px] font-bold text-amber-900">审核说明</p>
                        <p className="text-[10px] text-amber-700 leading-relaxed">
                            为了维护内容质量，新上传的图片将进入后台审核队列。审核通过后将正式公开展示。
                        </p>
                    </div>
                </div>

                <button
                    disabled={status === 'loading'}
                    className={`w-full py-4 rounded-2xl text-white font-bold text-lg mt-4 flex items-center justify-center transition-all shadow-lg
                        ${status === 'success' ? 'bg-green-500 shadow-green-100' : 'bg-black active:scale-95 shadow-gray-200'}
                        ${status === 'loading' ? 'opacity-70 animate-pulse' : ''}
                    `}
                >
                    {status === 'loading' && '同步数据中...'}
                    {status === 'success' && <><Check className="mr-2" /> 发布成功(待审核)</>}
                    {status === 'idle' && '确认发布'}
                    {status === 'error' && '发布失败，请重试'}
                </button>
            </form>
        </div>
    )
}
