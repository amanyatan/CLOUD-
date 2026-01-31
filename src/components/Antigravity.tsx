import { useState } from 'react'
import { generateCode } from '../lib/ai'
import { Loader2, Send, Code, Terminal } from 'lucide-react'

export default function Antigravity() {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState<{ code: string, explanation: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setLoading(true)
        setError(null)
        setResponse(null)

        try {
            const result = await generateCode(prompt)
            setResponse(result)
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-accent"><Code className="w-5 h-5" /></div>
                    <h3 className="font-bold text-white">Antigravity AI</h3>
                </div>
                <span className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">Powered by Gemini</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {!response && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                        <Terminal className="w-12 h-12 mb-2 opacity-20" />
                        <p>Describe what you want to build...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            <span className="text-gray-400 text-sm">Generating magic...</span>
                        </div>
                    </div>
                )}

                {response && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gray-800 rounded-lg p-3">
                            <p className="text-gray-300 text-sm">{response.explanation}</p>
                        </div>
                        <div className="relative">
                            <div className="absolute top-2 right-2 flex gap-1">
                                <button className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors">Copy</button>
                            </div>
                            <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto text-sm font-mono border border-gray-700">
                                <code className="text-gray-300">{response.code}</code>
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-800/50">
                <form onSubmit={handleGenerate} className="flex gap-2">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g. Create a React button component with hover effects..."
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !prompt.trim()}
                        className="bg-accent hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
