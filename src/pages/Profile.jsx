import { ChevronRight, Heart, History, HelpCircle, Settings, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [likedImages, setLikedImages] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Load History
        const localHistory = JSON.parse(localStorage.getItem('qutu_history') || '[]');
        setHistory(localHistory);

        // Load and Fetch Liked
        const likedIds = JSON.parse(localStorage.getItem('qutu_likes') || '[]');
        if (likedIds.length > 0) {
            fetch(`/api/wallpapers?ids=${likedIds.join(',')}`)
                .then(res => res.json())
                .then(data => setLikedImages(data))
                .catch(err => console.error(err));
        }
    }, []);

    return (
        <div className="bg-white min-h-screen overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
                {/* 现代化顶部背景 */}
                <div className="h-56 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* 用户信息卡片 */}
                <div className="px-4 -mt-10 relative z-10">
                    <div className="bg-white rounded-[32px] px-6 pb-8 pt-0 shadow-2xl shadow-gray-200/50 relative overflow-visible border border-gray-50">
                        {/* 头像 */}
                        <div className="absolute -top-14 left-6">
                            <div className="w-28 h-28 rounded-[38px] border-4 border-white overflow-hidden shadow-xl bg-gray-50">
                                <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover" alt="avatar" />
                            </div>
                        </div>

                        <div className="pt-16 pb-2 flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">像素收藏家</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                                </p>
                            </div>
                            <button className="bg-gray-50 text-gray-400 p-3 rounded-2xl active:scale-90 transition">
                                <Settings size={20} />
                            </button>
                        </div>

                        {/* 数据概览 */}
                        <div className="flex justify-between py-8">
                            <StatItem num={likedImages.length} label="我的喜欢" />
                            <StatItem num={history.length} label="最近浏览" />
                            <StatItem num="0" label="收藏夹" />
                        </div>
                    </div>
                </div>

                {/* 我的喜欢 横向列表 */}
                <div className="mt-8 space-y-4">
                    <div className="px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart size={16} className="text-red-500" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">我喜欢的</h3>
                        </div>
                        <Link to="/collection?type=likes" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">查看全部</Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 pb-2">
                        {likedImages.length > 0 ? likedImages.slice(0, 5).map(img => (
                            <Link
                                to={`/detail/${img.id}`}
                                key={img.id}
                                className="flex-none w-32 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden active:scale-95 transition"
                            >
                                <img src={img.thumb} className="w-full h-full object-cover" alt={img.title} />
                            </Link>
                        )) : (
                            <div className="w-full h-32 bg-gray-50 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-100 italic text-gray-300 text-[10px] font-bold">
                                <Heart size={20} className="mb-1" />
                                NOTHING LIKED YET
                            </div>
                        )}
                    </div>
                </div>

                {/* 浏览历史 横向列表 */}
                <div className="mt-8 space-y-4">
                    <div className="px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-500" />
                            <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">浏览历史</h3>
                        </div>
                        <Link to="/collection?type=history" className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-indigo-600 transition-colors">查看全部</Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar px-6 pb-2">
                        {history.length > 0 ? history.slice(0, 5).map(item => (
                            <Link
                                to={`/detail/${item.id}`}
                                key={item.id + '-' + item.time}
                                className="flex-none w-24 aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden active:scale-95 transition relative group"
                            >
                                <img src={item.thumb} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition" alt={item.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </Link>
                        )) : (
                            <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-widest gap-2">
                                <History size={16} /> No History
                            </div>
                        )}
                    </div>
                </div>

                {/* 常规菜单 */}
                <div className="px-4 mt-10 space-y-3">
                    <MenuItem icon={<HelpCircle size={18} />} color="text-green-500 bg-green-50" label="帮助与反馈" />
                    <MenuItem icon={<Clock size={18} />} color="text-purple-500 bg-purple-50" label="系统设置" to="/settings" />
                </div>
            </div>
        </div>
    )
}

function StatItem({ num, label }) {
    return (
        <div className="text-center group active:scale-95 transition cursor-pointer">
            <div className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{num}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
    )
}

function MenuItem({ icon, color, label, to = "/" }) {
    return (
        <Link to={to} className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm cursor-pointer border border-gray-50 hover:bg-gray-50 active:scale-[0.98] transition block">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color} shadow-sm`}>{icon}</div>
                <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
        </Link>
    )
}
