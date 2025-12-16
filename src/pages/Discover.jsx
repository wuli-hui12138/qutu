import { useState } from 'react';

const CATEGORIES = ['推荐', '风格', '色彩', '情感', '明星', '动漫', '游戏'];

export default function Discover() {
    const [activeCategory, setActiveCategory] = useState('推荐');

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* 顶部 */}
            <div className="pt-14 pb-2 px-4 bg-white sticky top-0 z-30 border-b border-gray-50">
                <div className="font-bold text-xl tracking-wider text-gray-800">发现灵感</div>
                <div className="absolute top-14 right-4 flex items-center justify-around w-20 h-8 bg-gray-100 rounded-full">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                </div>
            </div>

            {/* 热门搜索标签 */}
            <div className="px-4 py-4 shrink-0">
                <h4 className="text-sm font-bold text-gray-400 mb-3">大家都在搜</h4>
                <div className="flex flex-wrap gap-2">
                    <Tag text="赛博朋克" />
                    <Tag text="情侣头像" color="bg-purple-50 text-purple-600" />
                    <Tag text="极简" />
                    <Tag text="萌宠" />
                    <Tag text="新年壁纸" color="bg-red-50 text-red-500" />
                </div>
            </div>

            {/* 分类主体 (Split Layout) */}
            <div className="flex flex-1 overflow-hidden border-t border-gray-100">
                {/* 左侧边栏 */}
                <div className="w-24 bg-gray-50 h-full overflow-y-auto hide-scrollbar pb-20">
                    <div className="py-4 flex flex-col gap-1">
                        {CATEGORIES.map(cat => (
                            <div
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`w-full py-3 px-4 text-sm cursor-pointer transition-colors relative
                        ${activeCategory === cat ? 'bg-white font-bold text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {activeCategory === cat && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600"></div>}
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 右侧内容 */}
                <div className="flex-1 p-4 overflow-y-auto hide-scrollbar pb-24 h-full">
                    <h3 className="font-bold text-gray-800 mb-3">风格精选</h3>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <StyleCard title="暗黑" img="https://images.unsplash.com/photo-1531297461136-82lw9z554974?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                        <StyleCard title="暖色" img="https://images.unsplash.com/photo-1490750967868-bcdf92dd236d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                        <StyleCard title="蒸汽波" img="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                        <StyleCard title="森系" img="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" />
                    </div>

                    <h3 className="font-bold text-gray-800 mb-3">色彩索引</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        <ColorDot color="bg-red-500" />
                        <ColorDot color="bg-blue-500" />
                        <ColorDot color="bg-green-500" />
                        <ColorDot color="bg-yellow-400" />
                        <ColorDot color="bg-black" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Tag({ text, color = "bg-gray-100 text-gray-600" }) {
    return <span className={`px-3 py-1 rounded-full text-sm ${color}`}>{text}</span>
}

import { Link } from 'react-router-dom';

function StyleCard({ title, img }) {
    return (
        <Link to="/collection/1" className="block relative h-24 rounded-lg overflow-hidden group cursor-pointer active:opacity-90">
            <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{title}</span>
            </div>
        </Link>
    )
}

function ColorDot({ color }) {
    return <div className={`w-10 h-10 rounded-full ${color} shrink-0 shadow-sm border border-white`}></div>
}
