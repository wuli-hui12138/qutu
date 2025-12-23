import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

export default function EmptyState({
    message = "暂无匹配内容",
    subMessage = "No matching pixels found",
    icon: Icon = ImageIcon
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 flex flex-col items-center text-center space-y-4"
        >
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                <Icon size={32} />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-black text-gray-900">{message}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subMessage}</p>
            </div>
        </motion.div>
    );
}
