import { motion } from 'framer-motion'
import { FileCode, Globe, Cpu } from 'lucide-react'

export default function SnippetVisual() {
    return (
        <div className="w-full max-w-sm mx-auto aspect-video rounded-[2rem] bg-white/40 dark:bg-black/60 border border-black/10 dark:border-white/10 backdrop-blur-2xl overflow-hidden shadow-2xl relative group p-6 transition-colors duration-500">
            <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                <div className="flex items-center gap-2">
                    <FileCode size={14} className="text-orange-600 dark:text-orange-400" />
                    <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">Global Snippet Share</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-500/50" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                        <Cpu size={16} />
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="h-2 w-1/3 bg-white/10 rounded" />
                        <div className="h-1.5 w-1/2 bg-white/5 rounded" />
                    </div>
                </div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-3 rounded-xl bg-gray-500/10 border border-gray-500/20 font-mono text-[9px] text-gray-300"
                >
                    <div className="text-gray-500 mb-1">// Trending Snippet</div>
                    <div><span className="text-blue-400">export const</span> <span className="text-white">deploy</span> = () ={">"} ...</div>
                </motion.div>

                <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-700" />
                        ))}
                    </div>
                    <span className="text-[8px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-tighter">
                        <Globe size={10} /> Shared 3.2k times
                    </span>
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-600/10 blur-[40px] rounded-full" />
        </div>
    )
}
