import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Docs() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
                    Documentation
                </h1>
                <div className="space-y-6">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                        <p className="text-gray-400">Learn how to set up your first workspace and deploy your first application in under 60 seconds.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                        <h2 className="text-2xl font-bold mb-4">AI Assistant</h2>
                        <p className="text-gray-400">Master the Antigravity AI to write better code, faster. Learn about prompt engineering for developers.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
