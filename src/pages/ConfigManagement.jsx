import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Key, Globe, Cpu, Info } from 'lucide-react';

export default function ConfigManagement() {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/system-configs');
            if (res.ok) {
                const data = await res.json();
                setConfigs(data);
            }
        } catch (err) {
            console.error('Failed to fetch configs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key, value) => {
        try {
            const res = await fetch(`/api/system-configs/${key}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value })
            });
            if (res.ok) {
                // Success feedback can be subtle
                setConfigs(configs.map(c => c.key === key ? { ...c, value } : c));
            }
        } catch (err) {
            console.error('Update failed', err);
        }
    };

    const handleCreate = async () => {
        const key = prompt('请输入配置项 Key (例如: CUSTOM_VAR)');
        if (!key) return;
        try {
            const res = await fetch('/api/system-configs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value: '', description: '' })
            });
            if (res.ok) fetchConfigs();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (key) => {
        if (!confirm(`确定要删除配置项 ${key} 吗？`)) return;
        try {
            const res = await fetch(`/api/system-configs/${key}`, { method: 'DELETE' });
            if (res.ok) fetchConfigs();
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (key) => {
        if (key.includes('KEY')) return <Key size={18} className="text-amber-500" />;
        if (key.includes('URL')) return <Globe size={18} className="text-blue-500" />;
        if (key.includes('MODEL')) return <Cpu size={18} className="text-purple-500" />;
        return <Info size={18} className="text-gray-400" />;
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Header */}
            <div className="pt-14 px-4 bg-white sticky top-0 z-30 flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                    <div className="font-bold text-lg text-gray-800">配置管理</div>
                </div>
                <button onClick={handleCreate} className="p-2 bg-gray-50 rounded-xl text-gray-600 active:scale-95 transition-all">
                    <Plus size={20} />
                </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar pb-24">
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
                    <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                        修改 AI 相关配置后立即生效，无需重启服务器。API Key 等敏感信息将直接存储在数据库中，请妥善保管访问权限。
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-300 animate-pulse">加载配置中...</div>
                ) : (
                    configs.map((config) => (
                        <div key={config.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getIcon(config.key)}
                                    <span className="font-black text-sm text-gray-900 tracking-tight">{config.key}</span>
                                </div>
                                <button onClick={() => handleDelete(config.key)} className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Value</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-50 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:bg-white transition-all min-h-[60px]"
                                    value={config.value}
                                    onChange={(e) => {
                                        const newConfigs = configs.map(c => c.key === config.key ? { ...c, value: e.target.value } : c);
                                        setConfigs(newConfigs);
                                    }}
                                    onBlur={(e) => handleUpdate(config.key, e.target.value)}
                                    placeholder="请输入配置值..."
                                />
                            </div>

                            {config.description && (
                                <p className="text-[10px] text-gray-400 italic px-1">{config.description}</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer Note */}
            <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
                <div className="max-w-[375px] mx-auto">
                    <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-2xl shadow-xl flex items-center justify-between pointer-events-auto">
                        <div className="text-[10px] text-gray-400 font-medium">
                            配置变更自动保存
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            云端同步已就绪
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
