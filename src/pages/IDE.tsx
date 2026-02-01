import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import {
    FileText,
    ChevronDown,
    Save,
    Play,
    Plus,
    X,
    Check,
    Loader2,
    Infinity as InfinityIcon,
    Bot,
    Send,
    FolderOpen,
    ArrowLeft,
    Menu
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AnimatedBackground from '../components/AnimatedBackground'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'
import { generateContent } from '../lib/gemini'

interface IDEFile {
    id: string
    name: string
    content: string
    language: string
    project_id?: string
}

interface ChatMessage {
    role: 'user' | 'assistant'
    text: string
}

export default function IDE() {
    const navigate = useNavigate()
    const { theme: currentTheme } = useTheme()

    // Data State
    const [files, setFiles] = useState<IDEFile[]>([])
    const [activeFileId, setActiveFileId] = useState<string | null>(null)
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
    // UI State
    const [activeSidebar, setActiveSidebar] = useState<'files' | 'ai'>('files')
    const [terminalOpen, setTerminalOpen] = useState(true)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

    // Creation State
    const [isCreatingFile, setIsCreatingFile] = useState(false)
    const [newFileName, setNewFileName] = useState('')

    // AI Chat State
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'assistant', text: 'Hi! I am Gemini. Ready to help you code Python, HTML, or JS!' }
    ])
    const [chatInput, setChatInput] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    // Terminal History
    const [terminalHistory, setTerminalHistory] = useState<string[]>(['CLOUD Terminal Started...', 'Type "help" for commands.', ''])
    const [terminalInput, setTerminalInput] = useState('')

    const getLanguage = (name: string) => {
        const ext = name.split('.').pop()?.toLowerCase()
        if (ext === 'py') return 'python'
        if (ext === 'html') return 'html'
        if (ext === 'css') return 'css'
        if (ext === 'js') return 'javascript'
        return 'plaintext'
    }

    // 1. Load Projects and Files
    useEffect(() => {
        const init = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) { navigate('/login'); return }

                // Get or Create Project
                let { data: projs } = await supabase.from('projects').select('*').limit(1)
                let projId = projs?.[0]?.id

                if (!projId) {
                    const { data: newProj } = await supabase.from('projects').insert([{ name: 'Default Project', user_id: user.id }]).select().single()
                    projId = newProj?.id
                }
                setActiveProjectId(projId)

                // Get Files
                if (projId) {
                    const { data: fData } = await supabase.from('files').select('*').eq('project_id', projId)
                    if (fData) {
                        setFiles(fData)
                        if (fData.length > 0) setActiveFileId(fData[0].id)
                    }
                }
            } catch (err) {
                console.error("Initialization Failed:", err)
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [navigate])

    const activeFile = files.find(f => f.id === activeFileId)

    const handleCreateFile = async () => {
        if (!newFileName.trim()) return
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || !activeProjectId) return

        const { data, error } = await supabase.from('files').insert([{
            name: newFileName,
            content: '',
            language: getLanguage(newFileName),
            project_id: activeProjectId,
            user_id: user.id
        }]).select().single()

        if (error) {
            setTerminalHistory(prev => [...prev, `➜ Error creating file: ${error.message}`])
        } else if (data) {
            setFiles(prev => [...prev, data as IDEFile])
            setActiveFileId(data.id)
            setIsCreatingFile(false)
            setNewFileName('')
            setTerminalHistory(prev => [...prev, `➜ File created: ${data.name}`])
        }
    }

    const openLocalFolder = async () => {
        try {
            const dir = await (window as any).showDirectoryPicker()
            setTerminalHistory(prev => [...prev, `➜ Selected local folder: ${dir.name}`])
        } catch (e) {
            console.log("Folder select cancelled")
        }
    }

    const handleSave = async () => {
        if (!activeFile) return
        setSaveStatus('saving')
        const { error } = await supabase.from('files').update({ content: activeFile.content }).eq('id', activeFile.id)
        if (!error) {
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2000)
        } else {
            setSaveStatus('idle')
        }
    }

    const handleTerminalCommand = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            const cmd = terminalInput.trim().toLowerCase()
            let res = ''
            if (cmd === 'ls') res = files.map(f => f.name).join('  ')
            else if (cmd === 'clear') { setTerminalHistory([]); setTerminalInput(''); return }
            else if (cmd === 'help') res = 'Commands: ls, clear, help, date'
            else if (cmd === 'date') res = new Date().toLocaleString()
            else if (cmd) res = `Unknown command: ${cmd}`

            setTerminalHistory(prev => [...prev, `➜ ${terminalInput}`, res, ''])
            setTerminalInput('')
        }
    }

    const sendAIChat = async () => {
        if (!chatInput.trim() || isGenerating) return
        const input = chatInput
        setChatInput('')
        setChatMessages(prev => [...prev, { role: 'user', text: input }])
        setIsGenerating(true)
        try {
            const res = await generateContent(input)
            setChatMessages(prev => [...prev, { role: 'assistant', text: res }])
        } catch {
            setChatMessages(prev => [...prev, { role: 'assistant', text: 'Error talking to Gemini. Check your API Key.' }])
        } finally {
            setIsGenerating(false)
        }
    }

    if (isLoading) return <div className="h-screen w-full bg-black flex items-center justify-center font-mono text-blue-500 animate-pulse">Initializing Environment...</div>

    return (
        <div className={`flex flex-col h-screen overflow-hidden ${currentTheme === 'dark' ? 'bg-[#0a0a0a] text-gray-300' : 'bg-gray-50 text-gray-900'}`}>
            <AnimatedBackground />

            {/* Top Bar - RESPONSIVE */}
            <header className={`h-14 border-b ${currentTheme === 'dark' ? 'border-white/10 bg-black/50' : 'border-black/10 bg-white/50'} backdrop-blur-xl z-[110] flex items-center justify-between px-2 md:px-4`}>
                <div className="flex items-center gap-2 md:gap-6">
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <Menu size={20} />
                    </button>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <InfinityIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                        <span className="font-bold text-white tracking-widest uppercase text-[10px] md:text-sm hidden xs:block">CLOUD</span>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        <ArrowLeft size={14} /> <span className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Back to Home</span>
                    </button>
                    <button onClick={openLocalFolder} className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                        <FolderOpen size={14} /> Import Folder
                    </button>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <ThemeToggle />
                    <button onClick={handleSave} className={`flex items-center gap-2 px-2 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all ${saveStatus === 'saved' ? 'bg-green-600' : 'bg-blue-600'} text-white shadow-lg shadow-blue-500/20`}>
                        {saveStatus === 'saving' ? <Loader2 size={14} className="animate-spin" /> : saveStatus === 'saved' ? <Check size={14} /> : <Save size={14} />}
                        <span className="hidden sm:inline">{saveStatus === 'saving' ? 'SAVING...' : saveStatus === 'saved' ? 'SAVED' : 'SAVE CODE'}</span>
                    </button>
                    <button className="flex items-center gap-2 px-2 md:px-4 py-2 bg-green-600/30 text-green-400 hover:bg-green-600/40 rounded-lg text-[10px] md:text-xs font-black transition-colors border border-green-500/20">
                        <Play size={14} fill="currentColor" /> <span className="hidden sm:inline">RUN</span>
                    </button>
                </div>
            </header>

            {/* Editor Workspace */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Sidebar (Slim) - Desktop */}
                <aside className={`hidden md:flex w-14 border-r ${currentTheme === 'dark' ? 'border-white/10 bg-black/30' : 'border-black/10 bg-gray-100'} flex flex-col items-center py-6 gap-8 z-50`}>
                    <FileText className={`w-6 h-6 cursor-pointer ${activeSidebar === 'files' ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => setActiveSidebar('files')} />
                    <Bot className={`w-6 h-6 cursor-pointer ${activeSidebar === 'ai' ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => setActiveSidebar('ai')} />
                </aside>

                {/* Mobile Responsive Sidebar */}
                {mobileSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[120] md:hidden backdrop-blur-sm"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                <aside className={`
                    fixed md:relative inset-y-0 left-0 z-[130] md:z-40
                    w-72 md:w-64 border-r transition-transform duration-300 transform
                    ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    ${currentTheme === 'dark' ? 'border-white/10 bg-neutral-900 md:bg-black/20' : 'border-black/10 bg-white md:bg-white/20'}
                    backdrop-blur-md flex flex-col shrink-0
                `}>
                    {/* Mobile Sidebar Tabs */}
                    <div className="md:hidden flex border-b border-white/5">
                        <button
                            onClick={() => setActiveSidebar('files')}
                            className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeSidebar === 'files' ? 'bg-blue-600/10 text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                        >
                            <FileText size={18} />
                            <span className="text-xs font-bold uppercase">Files</span>
                        </button>
                        <button
                            onClick={() => setActiveSidebar('ai')}
                            className={`flex-1 p-4 flex items-center justify-center gap-2 transition-colors ${activeSidebar === 'ai' ? 'bg-blue-600/10 text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                        >
                            <Bot size={18} />
                            <span className="text-xs font-bold uppercase">AI</span>
                        </button>
                        <button
                            onClick={() => setMobileSidebarOpen(false)}
                            className="p-4 text-gray-500"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {activeSidebar === 'files' ? (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex justify-between items-center border-b border-white/5">
                                <span>Workspace</span>
                                <Plus size={16} className="cursor-pointer hover:text-blue-500" onClick={() => setIsCreatingFile(true)} />
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                {isCreatingFile && (
                                    <div className="mb-2">
                                        <input
                                            autoFocus
                                            className={`w-full ${currentTheme === 'dark' ? 'bg-white/5 text-white' : 'bg-black/5 text-black'} border border-blue-500/50 outline-none text-xs p-2 rounded`}
                                            value={newFileName}
                                            onChange={e => setNewFileName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleCreateFile()}
                                            onBlur={() => !newFileName && setIsCreatingFile(false)}
                                            placeholder="filename.py..."
                                        />
                                    </div>
                                )}
                                {files.map(f => (
                                    <div
                                        key={f.id}
                                        onClick={() => {
                                            setActiveFileId(f.id);
                                            if (window.innerWidth < 768) setMobileSidebarOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-3 py-2 text-xs cursor-pointer rounded-lg mb-1 transition-all ${activeFileId === f.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/5 text-gray-500'}`}
                                    >
                                        <FileText size={14} className={f.language === 'python' ? 'text-yellow-500' : 'text-blue-400'} />
                                        <span className="truncate flex-1">{f.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">Gemini AI</div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans leading-relaxed">
                                {chatMessages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-3 rounded-2xl text-[11px] ${m.role === 'user' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'bg-white/5 text-gray-300 border border-white/5'}`}>
                                            {m.text}
                                        </div>
                                    </div>
                                ))}
                                {isGenerating && <Loader2 size={16} className="animate-spin text-blue-500 ml-2" />}
                            </div>
                            <div className="p-4 bg-black/20">
                                <div className="relative">
                                    <input
                                        className={`w-full ${currentTheme === 'dark' ? 'bg-white/5 text-white' : 'bg-black/5 text-black'} border ${currentTheme === 'dark' ? 'border-white/10' : 'border-black/10'} rounded-xl py-3 px-4 text-xs outline-none focus:border-blue-500 transition-all placeholder:text-gray-600`}
                                        placeholder="Ask anything..."
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendAIChat()}
                                    />
                                    <Send size={16} className="absolute right-4 top-3.5 text-blue-500 cursor-pointer hover:scale-110 transition-transform" onClick={sendAIChat} />
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Editor Container */}
                <main className={`flex-1 flex flex-col min-w-0 ${currentTheme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                    {/* File Tabs */}
                    <div className={`h-10 flex ${currentTheme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-gray-100 border-black/5'} border-b overflow-x-auto scrollbar-hide`}>
                        {files.map(f => (
                            <div
                                key={f.id}
                                onClick={() => setActiveFileId(f.id)}
                                className={`flex items-center gap-3 px-3 md:px-5 h-full text-[10px] font-bold cursor-pointer border-r ${currentTheme === 'dark' ? 'border-white/5' : 'border-black/5'} min-w-[100px] md:min-w-[140px] transition-all ${activeFileId === f.id ? (currentTheme === 'dark' ? 'bg-[#0a0a0a] text-white border-t-2 border-blue-500' : 'bg-white text-black border-t-2 border-blue-500') : 'text-gray-500 hover:bg-white/5 opacity-60'}`}
                            >
                                <span className="truncate">{f.name}</span>
                                <X size={12} className="ml-auto hover:text-red-500" onClick={(e) => { e.stopPropagation(); /* TODO: Close File logic */ }} />
                            </div>
                        ))}
                    </div>

                    {/* Code Editor */}
                    <div className="flex-1 relative">
                        {activeFile ? (
                            <Editor
                                height="100%"
                                theme={currentTheme === 'dark' ? 'vs-dark' : 'light'}
                                language={activeFile.language}
                                value={activeFile.content}
                                onChange={(val) => {
                                    if (activeFileId) setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: val || '' } : f))
                                }}
                                options={{
                                    fontSize: 14,
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    padding: { top: 20 },
                                    fontFamily: "'Fira Code', monospace",
                                    lineNumbers: 'on',
                                    renderLineHighlight: 'all',
                                    smoothScrolling: true
                                }}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-6">
                                <InfinityIcon size={80} className="text-white/5 animate-pulse" />
                                <div className="text-center space-y-2">
                                    <h3 className="text-white font-bold text-lg">Empty Workspace</h3>
                                    <p className="text-xs max-w-xs px-10">Select a file from the explorer or create a new one to start coding your masterpiece.</p>
                                    <button onClick={() => {
                                        if (window.innerWidth < 768) {
                                            setMobileSidebarOpen(true);
                                            setActiveSidebar('files');
                                            setIsCreatingFile(true);
                                        } else {
                                            setIsCreatingFile(true);
                                        }
                                    }} className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-bold mt-4 hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">Create My First File</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Integrated Terminal */}
                    <div className={`${currentTheme === 'dark' ? 'bg-[#050505] border-white/10' : 'bg-gray-50 border-black/10'} border-t flex flex-col transition-all duration-300 ${terminalOpen ? 'h-56' : 'h-10'}`}>
                        <div
                            className={`h-10 flex items-center justify-between px-6 ${currentTheme === 'dark' ? 'bg-[#111] border-white/5' : 'bg-gray-200 border-black/5'} cursor-pointer border-b hover:opacity-80 transition-all`}
                            onClick={() => setTerminalOpen(!terminalOpen)}
                        >
                            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className={`${terminalOpen ? 'text-blue-400 border-b-2 border-blue-500 pb-3' : 'text-gray-500'}`}>Cloud Terminal</span>
                                <span className="text-gray-600 hover:text-gray-400 transition-colors">Output</span>
                                <span className="text-gray-600 hover:text-gray-400 transition-colors">Gemini Debug</span>
                            </div>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${terminalOpen ? '' : 'rotate-180'}`} />
                        </div>
                        {terminalOpen && (
                            <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-black/40">
                                {terminalHistory.map((line, i) => (
                                    <div key={i} className={`mb-1.5 break-all ${line.startsWith('➜') ? 'text-green-500 font-bold' : line.toLowerCase().includes('error') ? 'text-red-400 bg-red-400/5 px-2 py-1 rounded' : 'text-gray-400 ml-4'}`}>
                                        {line}
                                    </div>
                                ))}
                                <div className="flex items-center gap-3 mt-3 group">
                                    <span className="text-green-500 font-bold opacity-80 group-focus-within:opacity-100 transition-opacity">➜ cloud-box</span>
                                    <input
                                        autoFocus
                                        className={`bg-transparent border-none outline-none ${currentTheme === 'dark' ? 'text-white' : 'text-black'} flex-1 p-0 m-0 font-mono text-[11px] caret-blue-500 placeholder:text-gray-800`}
                                        placeholder="type a command..."
                                        value={terminalInput}
                                        onChange={e => setTerminalInput(e.target.value)}
                                        onKeyDown={handleTerminalCommand}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}