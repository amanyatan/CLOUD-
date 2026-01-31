import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <div
            onClick={toggleTheme}
            className={`
                relative w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-500 flex items-center flex-shrink-0
                ${theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-[#E2E2E2]'}
                border-2 border-black/5 dark:border-white/10
            `}
        >
            {/* Static Background Icons for Orientation */}
            <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
                <Sun size={12} className={`${theme === 'light' ? 'opacity-0' : 'opacity-40'} text-gray-500 dark:text-gray-400`} />
                <Moon size={11} className={`${theme === 'dark' ? 'opacity-0' : 'opacity-40'} text-gray-500 dark:text-gray-400`} />
            </div>

            {/* Animated Knob */}
            <motion.div
                animate={{
                    x: theme === 'dark' ? 32 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="w-6 h-6 rounded-full bg-white dark:bg-white flex items-center justify-center shadow-md z-10 relative"
            >
                {theme === 'dark' ? (
                    <Moon size={12} className="text-black fill-black" strokeWidth={2.5} />
                ) : (
                    <Sun size={12} className="text-black" strokeWidth={2.5} />
                )}
            </motion.div>
        </div>
    )
}
