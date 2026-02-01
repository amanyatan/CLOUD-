import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Zap,
    Users,
    Rocket,
    ChevronRight,
    Monitor,
    Shield,
    Globe,
    Infinity as InfinityIcon,
    ArrowUpRight
} from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import AIChatbot from '../components/AIChatbot'
import CollabVisual from '../components/CollabVisual'
import ThemeToggle from '../components/ThemeToggle'
import TechStackFlow from '../components/TechStackFlow'
import { MatterButton } from '../components/MatterButton'
import { CraftButton, CraftButtonLabel, CraftButtonIcon } from '../components/ui/CraftButton'

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                navigate('/dashboard')
            }
        }
        checkUser()
    }, [navigate])

    return (
        <div className="min-h-screen text-black dark:text-white font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden bg-transparent transition-colors duration-500">
            <AnimatedBackground />

            {/* Navbar */}
            <header className="flex items-center justify-between px-4 md:px-8 py-4 backdrop-blur-xl bg-white/10 dark:bg-black/20 fixed top-0 w-full z-50 border-b border-black/5 dark:border-white/5">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] opacity-50 animate-pulse" />
                        <InfinityIcon className="text-white w-8 h-8 relative z-10 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                    </div>
                    <span className="font-bold text-lg md:text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500">
                        CLOUD
                    </span>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <ThemeToggle />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <CraftButton
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-black text-white border-none shadow-lg shadow-blue-500/25 py-1.5 px-4 transition-colors duration-300"
                        >
                            <CraftButtonLabel className="text-[10px] md:text-sm font-bold">Get Started</CraftButtonLabel>
                            <CraftButtonIcon>
                                <ArrowUpRight className="size-3 md:size-4 stroke-[3px] transition-transform duration-500 group-hover:rotate-45" />
                            </CraftButtonIcon>
                        </CraftButton>
                    </motion.div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 pt-20">
                <section className="container mx-auto px-6 py-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 py-2 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black mb-8 tracking-[0.2em] uppercase">
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
                            The Future of Development
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-8xl font-bold mb-8 leading-[1] tracking-tighter text-slate-900 dark:text-white"
                    >
                        New Era of <br />
                        <span className="text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600 dark:from-white dark:via-gray-400 dark:to-gray-600 animate-gradient-x px-2">
                            CODING
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-slate-700 dark:text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Empower your team with a cloud workspace that combines AI intelligence, global collaboration, and cloud-native infrastructure.
                    </motion.p>



                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <MatterButton
                                onClick={() => navigate('/login')}
                                size="lg"
                            >
                                Start Coding Now
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </MatterButton>
                        </motion.div>
                    </motion.div>
                </section>

                <div className="w-full mb-16">
                    <TechStackFlow />
                </div>


                {/* Block 1: AI Intelligence */}
                <section className="py-32">
                    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group w-full"
                        >
                            <AIChatbot />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 border border-blue-500/20">
                                <Zap className="text-blue-400 w-7 h-7" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">Neural Coding Engine.</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg mb-8 leading-relaxed font-medium">
                                Our bespoke AI engine doesn't just guess your next word; it understands your architectural intent. Built on top of Gemini Pro, it refactors codebases, generates unit tests, and optimizes algorithms instantly.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
                                    <div className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-1">99%</div>
                                    <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">Logic Accuracy</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
                                    <div className="text-white dark:text-white font-bold text-xl mb-1">&lt; 100ms</div>
                                    <div className="text-[10px] text-slate-500 dark:text-gray-500 uppercase tracking-widest font-bold">Response Latency</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Block 2: Collaboration */}
                <section className="py-32">
                    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                <Users className="text-white w-7 h-7" />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">Sync-Speed <br />Teamwork.</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg mb-10 leading-relaxed font-medium">
                                Experience the world's first IDE with native huddles and split-second cursor synchronization. It's like being in the same room, even if you're worlds apart.
                            </p>
                            <div className="flex flex-col gap-4">
                                {[
                                    'Shared terminals with permission control',
                                    'Live 4K screen sharing built-in',
                                    'Instant feedback loops with inline comments'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-900 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2 relative group w-full"
                        >
                            <CollabVisual />
                        </motion.div>
                    </div>
                </section>

                {/* Block 3: Technical Capabilities (NEW) */}
                <section className="py-32">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto mb-20 relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white tracking-tight">Built for Scale.</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed">Our underlying architecture is designed to handle the most demanding enterprise workloads with ease.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: 'Docker Core', desc: 'Every workspace runs in its own isolated container with dedicated resources.', icon: <Monitor className="w-6 h-6" /> },
                                { title: 'Edge Network', desc: 'Deployments are automatically pushed to 150+ edge locations globally.', icon: <Globe className="w-6 h-6" /> },
                                { title: 'E2E Security', desc: 'Enterprise-grade encryption for all your source code and data at rest.', icon: <Shield className="w-6 h-6" /> }
                            ].map((cap, i) => (
                                <div key={i} className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:translate-y-[-4px] transition-all backdrop-blur-xl shadow-sm hover:shadow-xl group">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/5 flex items-center justify-center mb-8 text-blue-600 dark:text-blue-400 border border-blue-500/10 group-hover:scale-110 transition-transform">
                                        {cap.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{cap.title}</h3>
                                    <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed font-medium">{cap.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Final CTA */}
                <section className="py-40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full translate-y-1/2" />
                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                            className="max-w-4xl mx-auto p-12 md:p-24 rounded-[3.5rem] bg-slate-900 dark:bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] relative overflow-hidden group"
                        >
                            {/* Animated Background Swipe */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <Rocket className="text-blue-400 w-16 h-16 mx-auto mb-10 group-hover:rotate-12 transition-transform duration-500" />

                            <h2 className="text-5xl md:text-7xl font-bold mb-10 text-white leading-[1.1] tracking-tight">
                                {["Start", "building", "the", "future", "today."].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 + 0.5 }}
                                        className="inline-block mr-3"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </h2>

                            <MatterButton
                                onClick={() => navigate('/login')}
                                size="lg"
                            >
                                Launch Workspace
                            </MatterButton>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-black/5 dark:border-white/5 py-20 bg-white/50 dark:bg-black/50 backdrop-blur-md relative z-20">
                <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-8">
                            <InfinityIcon className="text-blue-600 dark:text-blue-500 w-8 h-8" />
                            <span className="font-bold text-2xl tracking-tighter text-gray-900 dark:text-white">CLOUD</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-500 max-w-xs leading-relaxed">
                            The world's most advanced cloud coding platform. Built by developers, for developers.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-widest text-xs">Platform</h4>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-500">
                            {['Features', 'Security', 'Integrations'].map(t => <li key={t} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">{t}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-gray-900 dark:text-white uppercase tracking-widest text-xs">Connect</h4>
                        <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-500">
                            {['GitHub', 'Twitter', 'Discord'].map(t => <li key={t} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">{t}</li>)}
                        </ul>
                    </div>
                </div>
            </footer>
        </div >
    )
}
