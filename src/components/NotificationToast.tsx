import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

interface NotificationToastProps {
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export default function NotificationToast({
    message,
    type,
    isVisible,
    onClose,
    duration = 3000
}: NotificationToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    const icons = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-yellow-500" />,
        info: <Info size={20} className="text-blue-500" />
    }

    const colors = {
        success: 'border-green-500/50 bg-green-500/10',
        error: 'border-red-500/50 bg-red-500/10',
        warning: 'border-yellow-500/50 bg-yellow-500/10',
        info: 'border-blue-500/50 bg-blue-500/10'
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -50, x: '-50%' }}
                    className={`fixed top-6 left-1/2 z-[100] min-w-[320px] max-w-md border ${colors[type]} backdrop-blur-xl rounded-xl p-4 shadow-2xl`}
                >
                    <div className="flex items-center gap-3">
                        {icons[type]}
                        <p className="flex-1 text-sm font-medium text-white">{message}</p>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
