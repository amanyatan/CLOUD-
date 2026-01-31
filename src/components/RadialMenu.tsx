import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    FolderOpen,
    Users,
    User,
    LogOut,
} from 'lucide-react'

interface FloatingDockProps {
    activeTab: string
    setActiveTab: (tab: string) => void
    onLogout: () => void
}

export default function FloatingDock({ activeTab, setActiveTab, onLogout }: FloatingDockProps) {
    const navigate = useNavigate()

    const menuItems = [
        { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard', action: () => navigate('/dashboard') },
        { id: 'Projects', icon: FolderOpen, label: 'Projects', action: () => navigate('/ide') },
        { id: 'Community', icon: Users, label: 'Community', action: () => navigate('/community') },
        { id: 'Profile', icon: User, label: 'Profile', action: () => navigate('/profile') },
        { id: 'Logout', icon: LogOut, label: 'Sign Out', action: onLogout }
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center p-4 w-full pointer-events-none">
            <div className="flex items-center gap-3 px-6 py-3 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl shadow-black/50 ring-1 ring-white/5 pointer-events-auto">
                {menuItems.map((item) => (
                    <DockItem
                        key={item.id}
                        item={item}
                        isActive={activeTab === item.id}
                        onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                    />
                ))}
            </div>
        </div>
    )
}

function DockItem({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) {
    return (
        <div
            className="relative group cursor-pointer"
            onClick={onClick}
        >
            {/* Active Indicator & Hover Background */}
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                        : 'bg-white/5 text-gray-400 hover:bg-white/15 hover:text-white hover:scale-105'}
                ${item.id === 'Logout' ? 'hover:bg-red-500/20 hover:text-red-400' : ''}
                `}
            >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {/* Active Dot */}
            {isActive && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}

            {/* Tooltip */}
            <AnimatePresence>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black border border-white/10 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl translate-y-2 group-hover:translate-y-0 duration-200">
                    {item.label}
                </div>
            </AnimatePresence>
        </div>
    )
}
