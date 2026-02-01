import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AnimatedBackground from '../components/AnimatedBackground'
import RadialMenu from '../components/RadialMenu'
import { motion } from 'framer-motion'
import {
    Plus,
    Terminal,
    GitBranch,
    Infinity as InfinityIcon
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { useState, useEffect } from 'react'

export default function Dashboard() {
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [files, setFiles] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('Dashboard')

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch profile for name
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, username')
                .eq('id', user.id)
                .single()

            if (profile) {
                setUserName(profile.full_name || profile.username || 'User')
            } else {
                // If profile doesn't exist (e.g. trigger failed), create it now
                console.log('Profile missing, creating fallback record...')
                const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
                const { data: newProfile, error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        username: displayName,
                        full_name: displayName,
                        avatar_url: user.user_metadata?.avatar_url
                    })
                    .select()
                    .single()

                if (!profileError && newProfile) {
                    setUserName(newProfile.full_name || newProfile.username || 'User')
                } else {
                    setUserName(displayName)
                }
            }

            // Fetch files
            const { data } = await supabase
                .from('files')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })

            if (data) setFiles(data)
        }
        fetchUserData()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div className="flex h-screen w-full bg-[#030712] text-white overflow-hidden relative selection:bg-blue-500/30">
            {/* Background Layer - restrained to assure text readability */}
            <div className="absolute inset-0 z-0 opacity-40">
                <AnimatedBackground absolute />
            </div>

            {/* Main Content Area - Full Screen */}
            <main className="relative z-10 w-full h-full overflow-hidden flex flex-col">
                {/* Top Header */}
                <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-black/20 backdrop-blur-sm transition-all">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 mr-4 md:mr-8 cursor-pointer" onClick={() => navigate('/')}>
                            <InfinityIcon className="w-6 h-6 text-blue-500" />
                            <span className="font-bold text-lg tracking-tight text-white/90 hidden md:inline uppercase">CLOUD</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/ide')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-colors ml-2"
                        >
                            <Plus size={14} strokeWidth={3} />
                            <span>New Project</span>
                        </motion.button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto space-y-10 pb-32">

                        {/* Welcome Section */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back, {userName}</h1>
                                <p className="text-gray-400">You have <span className="text-blue-400 font-medium">{files.length} active projects</span>.</p>
                            </div>
                        </div>

                        {/* Recent Projects Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {files.map((file, i) => (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => navigate('/ide')}
                                    className="group relative bg-[#13121d]/80 hover:bg-[#1a1926] border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 backdrop-blur-md"
                                >
                                    {/* Icon & Time */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/5 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <Terminal size={20} />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-black/40 border border-white/5 text-[10px] font-medium text-gray-400">
                                            {new Date(file.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors truncate">
                                        {file.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-6 font-mono">
                                        Last modified in {file.language}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                        <div className="flex -space-x-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[8px] font-bold text-blue-400">ME</div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors flex items-center gap-1">
                                            Open <GitBranch size={10} />
                                        </div>
                                    </div>

                                    {/* Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-gray-600 rounded-2xl opacity-0 group-hover:opacity-10 blur duration-500 -z-10" />
                                </motion.div>
                            ))}

                            {/* Create New Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => navigate('/ide')}
                                className="group h-full min-h-[240px] border-2 border-dashed border-white/10 hover:border-blue-500/50 rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-all"
                            >
                                <div className="w-14 h-14 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus size={24} />
                                </div>
                                <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Start New Project</span>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Radial Menu */}
            <RadialMenu
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={handleLogout}
            />
        </div>
    )
}


