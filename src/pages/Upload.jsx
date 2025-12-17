import { useState } from 'react';
import { Upload as UploadIcon, Check, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        url: '',
        thumb: '',
        title: '',
        category: 'Phone',
        tags: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        // If thumb is empty, use url
        const payload = {
            ...formData,
            thumb: formData.thumb || formData.url
        };

        try {
            const res = await fetch('/api/wallpapers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <UploadIcon className="mr-2" /> 上传壁纸
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 预览区域 */}
                <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-6 border-2 border-dashed border-gray-300 relative">
                    {formData.url ? (
                        <img src={formData.url} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <ImageIcon size={32} />
                            <span className="text-xs mt-2">输入URL预览</span>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">图片 URL</label>
                    <input
                        type="url"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">缩略图 URL (可选)</label>
                    <input
                        type="url"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="默认为原图"
                        value={formData.thumb}
                        onChange={e => setFormData({ ...formData, thumb: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">标题</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="例如：霓虹都市"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">分类</label>
                        <select
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Phone">手机壁纸</option>
                            <option value="PC">电脑壁纸</option>
                            <option value="Avatar">头像</option>
                            <option value="Emoji">表情包</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">标签</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="用逗号分隔，例如：风景,4K"
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                <button
                    disabled={status === 'loading'}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg mt-8 flex items-center justify-center transition
                        ${status === 'success' ? 'bg-green-500' : 'bg-purple-600 active:scale-95'}
                        ${status === 'loading' ? 'opacity-70' : ''}
                    `}
                >
                    {status === 'loading' && '提交中...'}
                    {status === 'success' && <><Check className="mr-2" /> 上传成功</>}
                    {status === 'idle' && '上传图片'}
                    {status === 'error' && '失败，重试'}
                </button>
            </form>
        </div>
    )
}
