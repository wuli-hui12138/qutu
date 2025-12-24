import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Hash, LayoutGrid, Info, ShieldCheck, Image as ImageIcon, Settings2 } from 'lucide-react';

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
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">业务管理</h3>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <LinkSection
                            icon={<Hash size={20} className="text-purple-600" />}
                            title="图片标签库"
                            desc="预设及维护快捷标签"
                            to="/settings/tags"
                        />
                        <LinkSection
                            icon={<LayoutGrid size={20} className="text-blue-600" />}
                            title="分类中心"
                            desc="管理全局业务分类"
                            to="/settings/categories"
                        />
                        <LinkSection
                            icon={<ImageIcon size={20} className="text-emerald-600" />}
                            title="图片管理"
                            desc="素材管理、Banner 及可见性控制"
                            to="/settings/images"
                        />
                        <LinkSection
                            icon={<ShieldCheck size={20} className="text-orange-600" />}
                            title="专题审核"
                            desc="通过或拒绝用户发起的专题"
                            to="/settings/topics-audit"
                        />
                        <LinkSection
                            icon={<Settings2 size={20} className="text-gray-600" />}
                            title="配置管理"
                            desc="管理 AI 密钥及系统参数"
                            to="/settings/config"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">其他</h3>
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden text-sm">
                        <SettingsItem icon={<ShieldCheck size={18} className="text-green-500" />} label="隐私政策" />
                        <SettingsItem icon={<Info size={18} className="text-gray-500" />} label="关于趣图匣子" />
                    </div>
                </div>

                <div className="pt-4">
                    <button className="w-full py-4 bg-white text-gray-400 font-bold rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition text-sm">
                        退出登录
                    </button>
                </div>
            </div>
        </div>
    );
}

function LinkSection({ icon, title, desc, to }) {
    return (
        <Link to={to} className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer border-b border-gray-50 last:border-0 group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{title}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{desc}</span>
                </div>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
        </Link>
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
