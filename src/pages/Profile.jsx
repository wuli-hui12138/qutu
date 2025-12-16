import { ChevronRight, Heart, History, HelpCircle, Settings } from 'lucide-react';

export default function Profile() {
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Top Gradient Background */}
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                <div className="absolute top-14 right-4 flex items-center justify-around w-20 h-8 bg-black/20 border border-white/20 rounded-full backdrop-blur-sm">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>

            {/* User Info Card */}
            <div className="px-4 -mt-6 relative z-10">
                <div className="bg-white rounded-[30px] px-6 pb-6 pt-0 shadow-sm relative overflow-visible">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md bg-white">
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    <div className="pt-14 pb-4 border-b border-gray-100 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Momo酱</h2>
                            <p className="text-gray-400 text-xs mt-1">ID: 8899201</p>
                        </div>
                        <button className="bg-gray-800 text-white text-xs px-4 py-2 rounded-full active:scale-95 transition">编辑资料</button>
                    </div>

                    {/* Data Overview */}
                    <div className="flex justify-around py-6">
                        <StatItem num="142" label="收藏" />
                        <StatItem num="28" label="下载" />
                        <StatItem num="5" label="关注" />
                    </div>

                    {/* Menu List */}
                    <div className="space-y-4">
                        <MenuItem icon={<Heart size={16} />} color="text-red-500 bg-red-50" label="我的喜欢" />
                        <MenuItem icon={<History size={16} />} color="text-blue-500 bg-blue-50" label="浏览历史" />
                        <MenuItem icon={<HelpCircle size={16} />} color="text-green-500 bg-green-50" label="帮助与反馈" />
                        <MenuItem icon={<Settings size={16} />} color="text-gray-500 bg-gray-50" label="设置" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatItem({ num, label }) {
    return (
        <div className="text-center">
            <div className="text-xl font-bold text-gray-800">{num}</div>
            <div className="text-xs text-gray-400">{label}</div>
        </div>
    )
}

function MenuItem({ icon, color, label }) {
    return (
        <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer border border-gray-50 hover:bg-gray-50 active:scale-[0.99] transition">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>{icon}</div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    )
}
