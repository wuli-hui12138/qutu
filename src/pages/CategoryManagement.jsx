import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, LayoutGrid } from 'lucide-react';

export default function CategoryManagement() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error('Failed to fetch categories', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategory.trim() })
            });
            if (res.ok) {
                setNewCategory('');
                fetchCategories();
            }
        } catch (err) {
            console.error('Failed to add category', err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('确定要删除这个分类吗？')) return;
        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchCategories();
            }
        } catch (err) {
            console.error('Failed to delete category', err);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            {/* Header */}
            <div className="pt-14 px-4 bg-white sticky top-0 z-30 flex items-center gap-4 pb-4 border-b border-gray-100">
                <ArrowLeft className="cursor-pointer text-gray-800" onClick={() => navigate(-1)} />
                <div className="font-bold text-lg text-gray-800">分类管理</div>
            </div>

            <div className="p-4 flex-1">
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <div className="relative flex-1">
                        <LayoutGrid className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="输入新分类名称..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <button type="submit" className="bg-purple-600 text-white p-3 rounded-xl active:scale-95 transition">
                        <Plus size={24} />
                    </button>
                </form>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid size={16} className="text-purple-400" />
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                </div>
                                <button onClick={() => handleDelete(cat.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <p>暂无分类，请先添加</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
