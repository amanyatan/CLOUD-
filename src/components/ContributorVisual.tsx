import { motion } from 'framer-motion'
import { Heart, MessageSquare, Award } from 'lucide-react'

export default function ContributorVisual() {
    return (
        <div className="w-full max-w-md mx-auto aspect-square rounded-[3rem] bg-white/40 dark:bg-black/40 border border-black/10 dark:border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl relative group flex flex-col items-center justify-center p-8 transition-colors duration-500">
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Community</span>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
                {/* Central Circle */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center relative z-10 shadow-2xl shadow-blue-500/20">
                    <Award className="w-12 h-12 text-white" />
                </div>

                {/* Orbiting Elements */}
                {[0, 72, 144, 216, 288].map((angle, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 2
                        }}
                        className="absolute w-full h-full"
                    >
                        <motion.div
                            style={{
                                left: '50%',
                                top: '50%',
                                x: Math.cos(angle * Math.PI / 180) * 100,
                                y: Math.sin(angle * Math.PI / 180) * 100
                            }}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center backdrop-blur-md">
                                {i % 2 === 0 ? <Heart size={18} className="text-red-600 dark:text-red-400" /> : <MessageSquare size={18} className="text-blue-600 dark:text-blue-400" />}
                            </div>
                        </motion.div>
                    </motion.div>
                ))}

                {/* Arcs */}
                <svg className="absolute w-full h-full opacity-20" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" r="100" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 20" />
                    <circle cx="200" cy="200" r="140" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5 15" />
                </svg>
            </div>

            <div className="absolute bottom-8 left-0 right-0 px-8">
                <div className="flex items-center justify-between text-[10px] font-black text-gray-600 dark:text-gray-500 uppercase tracking-[0.2em]">
                    <span>Global Impact</span>
                    <span>99.9% Collaboration</span>
                </div>
                <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                    <motion.div
                        animate={{ width: ['0%', '85%', '85%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-blue-600/5 blur-[60px] rounded-full" />
        </div>
    )
}
