import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';

export default function Collection() {
    const navigate = useNavigate();

    return (
        <div className=" bg-white min-h-screen pb-10">
            {/* Header */}
            <div className="pt-14 px-4 bg-white sticky top-0 z-30 flex items-center gap-4 pb-4 border-b border-gray-100">
                <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                <div className="font-bold text-lg text-gray-800">专题详情</div>
            </div>

            {/* Banner */}
            <div className="p-4">
                <div className="w-full h-48 rounded-2xl overflow-hidden relative shadow-lg mb-4">
                    <img src="https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
                        <h2 className="text-white text-2xl font-bold font-serif italic mb-2">City Vibes</h2>
                        <p className="text-gray-200 text-xs">感受城市的脉搏，精选30张城市夜景与建筑美学壁纸。</p>
                    </div>
                </div>
                <div className="flex justify-between items-center px-2">
                    <span className="text-sm text-gray-500">共 32 张图片</span>
                    <button className="text-purple-600 text-sm font-bold flex items-center gap-1 active:opacity-70">
                        <Star size={16} /> 收藏专题
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="px-4 pb-10 grid grid-cols-2 gap-3">
                <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-48 object-cover rounded-lg" loading="lazy" />
                <img src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-48 object-cover rounded-lg" loading="lazy" />
                <img src="https://images.unsplash.com/photo-1449824913929-49aa7149c435?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-48 object-cover rounded-lg" loading="lazy" />
                <img src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" className="w-full h-48 object-cover rounded-lg" loading="lazy" />
            </div>
        </div>
    )
}
