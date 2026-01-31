import { motion } from 'framer-motion'
import { MousePointer2, Users } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function CollabVisual() {
    const { theme: currentTheme } = useTheme()
    return (
        <div className="w-full max-w-md mx-auto aspect-video rounded-2xl bg-white/40 dark:bg-black/60 border border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl relative group transition-colors duration-500">
            <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-black/5 dark:bg-white/5">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold">Collab Session • Live</span>
                </div>
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
            </div>

            <div className="p-6 relative h-full flex items-center justify-center">
                <div className="w-full space-y-3 font-mono text-[10px] leading-relaxed opacity-90 transition-opacity">
                    <p className="text-slate-600 dark:text-slate-300 font-bold opacity-50 italic">{"<component name='Editor' />"}</p>
                    <p className="text-slate-800 dark:text-slate-200">{"export default function Workspace() {"}</p>
                    <div className="pl-4 space-y-1">
                        <p className="text-slate-700 dark:text-slate-300">{"const [sync, setSync] = useState(true);"}</p>
                        <p className="text-slate-700 dark:text-slate-300">{"useEffect(() => {"}</p>
                        <div className={`pl-4 w-4/5 h-2 ${currentTheme === 'dark' ? 'bg-white/10' : 'bg-black/10'} rounded-full animate-pulse`} />
                        <p className="text-slate-700 dark:text-slate-300">{"}, [sync]);"}</p>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{"}"}</p>
                </div>

                {/* Simulated Cursors */}
                <motion.div
                    animate={{
                        x: [20, 150, 80, 20],
                        y: [-20, 40, -40, -20]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-10"
                >
                    <div className="flex flex-col items-start gap-1">
                        <MousePointer2 className="w-4 h-4 text-blue-500 fill-blue-500" />
                        <div className="bg-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold shadow-lg">Alex</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{
                        x: [180, 40, 120, 180],
                        y: [60, -20, 80, 60]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute z-10"
                >
                    <div className="flex flex-col items-start gap-1">
                        <MousePointer2 className="w-4 h-4 text-purple-500 fill-purple-500" />
                        <div className="bg-purple-500 text-white text-[8px] px-1.5 py-0.5 rounded-sm font-bold shadow-lg">Sarah</div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-600/10 blur-[40px] rounded-full"
                />
            </div>

            {/* Ambient Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-600/20 blur-[80px] rounded-full group-hover:bg-purple-600/30 transition-colors" />
        </div>
    )
}
