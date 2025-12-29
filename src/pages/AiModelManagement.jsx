import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    Trash2,
    Cpu,
    Check,
    X,
    MessageSquare,
    ImageIcon,
    Video,
    Music,
    Layout,
    ExternalLink,
    Search,
    Filter,
    ChevronDown,
    Save,
    Clock,
    Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const MODEL_TYPES = [
    { value: 'CHAT', label: '智能对话', icon: <MessageSquare size={16} />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'IMAGE', label: 'AI 绘画', icon: <ImageIcon size={16} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { value: 'VIDEO', label: '视频模型', icon: <Video size={16} />, color: 'text-orange-500', bg: 'bg-orange-50' },
    { value: 'MUSIC', label: '音乐生成', icon: <Music size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'PPT', label: '智能幻灯片', icon: <Layout size={16} />, color: 'text-pink-500', bg: 'bg-pink-50' }
];

export default function AiModelManagement() {
    const navigate = useNavigate();
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    // Form State
    const [formData, setFormData] = useState({
        type: 'CHAT',
        vendor: '',
        name: '',
        displayName: '',
        sortOrder: 0,
        isEnabled: true
    });

    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        try {
            const res = await fetch('/api/ai-models');
            if (res.ok) {
                const data = await res.json();
                setModels(data);
            }
        } catch (err) {
            console.error('Failed to fetch models', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const url = editingId ? `/api/ai-models/${editingId}` : '/api/ai-models';
        const method = editingId ? 'PATCH' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                await fetchModels();
                resetForm();
            }
        } catch (err) {
            console.error('Save failed', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('确定要删除此模型吗？')) return;
        try {
            const res = await fetch(`/api/ai-models/${id}`, { method: 'DELETE' });
            if (res.ok) fetchModels();
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleToggleEnabled = async (model) => {
        try {
            const res = await fetch(`/api/ai-models/${model.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isEnabled: !model.isEnabled })
            });
            if (res.ok) {
                setModels(models.map(m => m.id === model.id ? { ...m, isEnabled: !m.isEnabled } : m));
            }
        } catch (err) {
            console.error('Toggle failed', err);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'CHAT',
            vendor: '',
            name: '',
            displayName: '',
            sortOrder: 0,
            isEnabled: true
        });
        setEditingId(null);
        setIsAdding(false);
    };

    const startEditing = (model) => {
        setFormData({
            type: model.type,
            vendor: model.vendor,
            name: model.name,
            displayName: model.displayName,
            sortOrder: model.sortOrder,
            isEnabled: model.isEnabled
        });
        setEditingId(model.id);
        setIsAdding(true);
    };

    const filteredModels = models.filter(m => {
        const matchesSearch = m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'ALL' || m.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans selection:bg-indigo-100">
            {/* Header */}
            <div className="pt-14 px-6 bg-white sticky top-0 z-40 flex items-center justify-between pb-6 border-b border-gray-100/50 backdrop-blur-xl bg-white/80">
                <div className="flex items-center gap-5">
                    <div
                        onClick={() => navigate('/settings')}
                        className="p-2.5 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer border border-gray-100"
                    >
                        <ArrowLeft size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight">AI 模型管理</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Centralized Intelligence Hub</p>
                    </div>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-[18px] text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={16} strokeWidth={3} /> 新增模型
                    </button>
                )}
            </div>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto hide-scrollbar pb-32">
                <AnimatePresence mode="wait">
                    {isAdding ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-[32px] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-black text-gray-900">{editingId ? '编辑模型' : '创建新模型'}</h2>
                                <button onClick={resetForm} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">模型类型</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {MODEL_TYPES.map(t => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: t.value })}
                                                    className={clsx(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all",
                                                        formData.type === t.value
                                                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                                                            : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:border-gray-200"
                                                    )}
                                                >
                                                    {t.icon}
                                                    <span className="text-[10px] font-bold">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">排序权重</label>
                                        <input
                                            type="number"
                                            value={formData.sortOrder}
                                            onChange={e => setFormData({ ...formData, sortOrder: +e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
                                            placeholder="数值越大越靠前"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">模型厂商 (Vendor)</label>
                                        <input
                                            required
                                            value={formData.vendor}
                                            onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
                                            placeholder="e.g. openai, anthropic"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">模型标识 (Model Identifier)</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-mono focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
                                            placeholder="e.g. gpt-4o, dall-e-3"
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">对外名称 (DisplayName)</label>
                                        <input
                                            required
                                            value={formData.displayName}
                                            onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all"
                                            placeholder="e.g. GPT-4o 专业版"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gray-900 text-white py-5 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                                    >
                                        <Save size={18} /> 保存配置
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {/* Search & Filter */}
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="搜索模型名称、标识或厂商..."
                                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 shadow-sm transition-all"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                                    <button
                                        onClick={() => setFilterType('ALL')}
                                        className={clsx(
                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            filterType === 'ALL' ? "bg-gray-900 text-white" : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                                        )}
                                    >
                                        全部
                                    </button>
                                    {MODEL_TYPES.map(t => (
                                        <button
                                            key={t.value}
                                            onClick={() => setFilterType(t.value)}
                                            className={clsx(
                                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2",
                                                filterType === t.value ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                                            )}
                                        >
                                            {t.icon} {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Model Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredModels.map((model) => {
                                    const typeInfo = MODEL_TYPES.find(t => t.value === model.type);
                                    return (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={model.id}
                                            className={clsx(
                                                "bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group",
                                                !model.isEnabled && "opacity-60 grayscale-[0.5]"
                                            )}
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={clsx("p-3 rounded-2xl", typeInfo?.bg)}>
                                                    <div className={typeInfo?.color}>{typeInfo?.icon}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => startEditing(model)}
                                                        className="p-2 text-gray-300 hover:text-indigo-500 transition-colors"
                                                    >
                                                        <Zap size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(model.id)}
                                                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">{model.vendor}</span>
                                                <h3 className="text-base font-black text-gray-900 leading-tight">{model.displayName}</h3>
                                                <div className="flex items-center gap-1.5 py-1">
                                                    <code className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded italic">{model.name}</code>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} className="text-gray-300" />
                                                    <span className="text-[10px] font-bold text-gray-400">排序: {model.sortOrder}</span>
                                                </div>
                                                <button
                                                    onClick={() => handleToggleEnabled(model)}
                                                    className={clsx(
                                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                                        model.isEnabled
                                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                            : "bg-gray-100 text-gray-400 border border-gray-200"
                                                    )}
                                                >
                                                    {model.isEnabled ? '已启用' : '已禁用'}
                                                </button>
                                            </div>

                                            {/* Decoration */}
                                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-gray-900 group-hover:scale-125 transition-transform">
                                                {typeInfo?.icon && <div className="scale-[4]">{typeInfo.icon}</div>}
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {filteredModels.length === 0 && (
                                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-20">
                                        <Cpu size={64} className="mb-6 text-gray-300" />
                                        <p className="text-sm font-bold uppercase tracking-[0.5em] text-gray-400">未发现匹配模型</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>

            <style sx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
