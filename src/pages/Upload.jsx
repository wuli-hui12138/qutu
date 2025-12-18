import { useState } from 'react';
import { Upload as UploadIcon, Check, Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        category: 'Phone',
        tags: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('请先选择图片');
            return;
        }
        setStatus('loading');

        const data = new FormData();
        data.append('file', file);
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('tags', formData.tags);

        try {
            const res = await fetch('/api/wallpapers', {
                method: 'POST',
                body: data
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => navigate('/'), 1500);
            } else {
                console.error('Upload failed with status:', res.status);
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
                <UploadIcon className="mr-2" /> 上传本地壁纸
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 预览/选择区域 */}
                <div
                    onClick={() => document.getElementById('fileInput').click()}
                    className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden mb-6 border-2 border-dashed border-gray-300 relative cursor-pointer active:bg-gray-300 transition"
                >
                    {preview ? (
                        <>
                            <img src={preview} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                <span className="text-white text-sm font-bold bg-black/40 px-4 py-2 rounded-full">点击更换</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <UploadIcon size={48} className="mb-2" />
                            <span className="text-sm">点击选择要上传的图片</span>
                            <span className="text-[10px] mt-1 text-gray-500">支持 JPG, PNG, WebP</span>
                        </div>
                    )}
                </div>

                <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">图片标题</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="例如：赛博朋克霓虹街头"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-700 mb-1">所属分类</label>
                        <select
                            className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Phone">手机壁纸</option>
                            <option value="PC">电脑壁纸</option>
                            <option value="Avatar">个性头像</option>
                            <option value="Emoji">趣味表情</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">标签</label>
                    <input
                        type="text"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="用逗号分隔，例如：风景,4K,插画"
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
                    {status === 'loading' && '正在上传文件...'}
                    {status === 'success' && <><Check className="mr-2" /> 上传发布成功</>}
                    {status === 'idle' && '确认发布'}
                    {status === 'error' && '上传失败，请重试'}
                </button>
            </form>
        </div>
    )
}
