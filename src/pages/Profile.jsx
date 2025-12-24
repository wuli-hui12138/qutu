import { ChevronRight, Heart, History, HelpCircle, Settings, Clock, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [likedImages, setLikedImages] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({ likes: 0, history: 0, creations: 0 });

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem('qutu_user'));
        if (localUser) {
            setUser(localUser);
            fetchUserStats(localUser.id);
        }

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

    const fetchUserStats = async (userId) => {
        try {
            const [favsRes, histRes, userRes] = await Promise.all([
                fetch(`/api/interactions/favorites/${userId}`),
                fetch(`/api/interactions/history/${userId}`),
                fetch(`/api/users/${userId}`)
            ]);

            if (favsRes.ok && histRes.ok && userRes.ok) {
                const favs = await favsRes.json();
                const hist = await histRes.json();
                const uData = await userRes.json();

                setStats({
                    likes: favs.length,
                    history: hist.length,
                    creations: uData._count?.images || 0
                });
            }
        } catch (e) {
            console.error('Failed to fetch stats', e);
        }
    };

    const handleLogin = async () => {
        // Mock Login
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    openid: 'mock_openid_' + Math.floor(Math.random() * 1000),
                    nickname: '像素收藏家',
                    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
                })
            });
            if (res.ok) {
                const userData = await res.json();
                localStorage.setItem('qutu_user', JSON.stringify(userData));
                setUser(userData);
                fetchUserStats(userData.id);
            }
        } catch (e) {
            console.error('Login failed', e);
        }
    };

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
                            <div className="w-28 h-28 rounded-[38px] border-4 border-white overflow-hidden shadow-xl bg-gray-50 flex items-center justify-center">
                                {user ? (
                                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-16 pb-2 flex justify-between items-start">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {user ? user.nickname : '未登录用户'}
                                </h2>
                                {user ? (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 已同步云端
                                    </p>
                                ) : (
                                    <button
                                        onClick={handleLogin}
                                        className="text-[10px] text-indigo-500 font-black uppercase tracking-widest hover:underline"
                                    >
                                        点击快速模拟登录
                                    </button>
                                )}
                            </div>
                            <button className="bg-gray-50 text-gray-400 p-3 rounded-2xl active:scale-90 transition">
                                <Settings size={20} />
                            </button>
                        </div>

                        {/* 数据概览 */}
                        <div className="flex justify-between py-8">
                            <StatItem
                                num={user ? stats.likes : likedImages.length}
                                label="我的喜欢"
                                onClick={() => navigate('/collection?type=likes')}
                            />
                            <StatItem
                                num={user ? stats.history : history.length}
                                label="最近浏览"
                                onClick={() => navigate('/collection?type=history')}
                            />
                            <StatItem
                                num={user ? stats.creations : "0"}
                                label="我的创作"
                            />
                        </div>
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

function StatItem({ num, label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="text-center group active:scale-95 transition cursor-pointer"
        >
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
