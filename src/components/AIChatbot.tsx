import { motion } from 'framer-motion'
import { Terminal, Bot, Code2, Sparkles } from 'lucide-react'

export default function AIChatbot() {
    return (
        <div className="w-full max-w-md mx-auto aspect-video rounded-2xl bg-white/40 dark:bg-black/60 border border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl relative group">
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="ml-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Neural assistant v4.2</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Bot size={18} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Assistant</div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            I've optimized your React hook. Here's a cleaner implementation using <span className="text-blue-600 dark:text-blue-400">useMemo</span>:
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-xl bg-gray-900/80 border border-white/10 p-4 font-mono text-xs overflow-hidden relative"
                >
                    <div className="absolute top-2 right-2 opacity-50"><Code2 size={12} /></div>
                    <div className="space-y-1">
                        <div className="flex gap-2"><span className="text-blue-400">const</span> <span className="text-white">result</span> = <span className="text-blue-400">useMemo</span>(() ={">"} {'{'}</div>
                        <div className="pl-4 text-gray-400 border-l border-white/5">
                            <span className="text-blue-400">return</span> data.filter(item ={">"} item.active);
                        </div>
                        <div className="flex gap-2">{'}'}, [data]);</div>
                    </div>
                    <motion.div
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    />
                </motion.div>

                <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 h-8 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center px-3 text-[10px] text-gray-600 dark:text-gray-500 italic">
                        Asking follow-up...
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 cursor-pointer hover:bg-blue-500 transition-colors">
                        <Terminal size={14} />
                    </div>
                </div>
            </div>

            {/* Ambient Glow */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-colors" />
        </div>
    )
}
