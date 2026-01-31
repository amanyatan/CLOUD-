
import { ArrowLeft, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Pricing() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </button>
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Simple, Transparent Pricing
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { name: 'Starter', price: '$0', features: ['3 Projects', 'Standard AI', 'Public Repos'] },
                        { name: 'Pro', price: '$19', features: ['Unlimited Projects', 'Advanced AI', 'Private Repos', 'Custom Domains'], popular: true },
                        { name: 'Enterprise', price: 'Custom', features: ['SSO/SAML', 'Dedicated Support', 'On-premise option'] }
                    ].map((plan, i) => (
                        <div key={i} className={`p-8 rounded-3xl backdrop-blur-lg border ${plan.popular ? 'bg-blue-600/10 border-blue-500/50 relative shadow-2xl shadow-blue-500/20' : 'bg-white/5 border-white/10'}`}>
                            {plan.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</span>}
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-8">{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                            <ul className="text-left space-y-4 mb-8">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-2 text-gray-300">
                                        <Check size={16} className="text-blue-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
