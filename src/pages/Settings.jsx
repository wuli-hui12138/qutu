import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Hash, LayoutGrid, Info, ShieldCheck } from 'lucide-react';

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 h-screen overflow-hidden flex flex-col">
            {/* Header */}
            <div className="pt-14 px-4 bg-white sticky top-0 z-30 flex items-center gap-4 pb-4 border-b border-gray-100">
                <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                <div className="font-bold text-lg text-gray-800">设置</div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">管理菜单</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <SettingsItem
                            icon={<Hash size={18} className="text-purple-500" />}
                            label="图片标签管理"
                            onClick={() => navigate('/settings/tags')}
                        />
                        <SettingsItem
                            icon={<LayoutGrid size={18} className="text-blue-500" />}
                            label="图片分类管理"
                            onClick={() => navigate('/settings/categories')}
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">其他</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <SettingsItem icon={<ShieldCheck size={18} className="text-green-500" />} label="隐私政策" />
                        <SettingsItem icon={<Info size={18} className="text-gray-500" />} label="关于趣图匣子" />
                    </div>
                </div>

                <div className="pt-4">
                    <button className="w-full py-4 bg-white text-red-500 font-bold rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition">
                        退出登录
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsItem({ icon, label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    {icon}
                </div>
                <span className="font-medium text-gray-700">{label}</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
        </div>
    );
}
