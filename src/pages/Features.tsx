import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Features() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    Advanced Features
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed mb-12">
                    VirtuaCode is packed with features designed for the modern developer. From AI-powered pair programming to zero-config deployments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: 'Intelligent Autocomplete', desc: 'Context-aware suggestions powered by Gemini Pro.' },
                        { title: 'Live Preview', desc: 'See your changes in real-time with instant hot-reloading.' },
                        { title: 'Integrated Terminal', desc: 'Full shell access directly inside your browser.' },
                        { title: 'Git Integration', desc: 'Seamlessly manage your branches and commits.' }
                    ].map((f, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                            <p className="text-gray-400">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
