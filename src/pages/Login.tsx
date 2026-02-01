import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { Loader2, Code2, Github, Eye, EyeOff } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import VantaClouds from '../components/VantaClouds'
import { motion } from 'framer-motion'
import NotificationToast from '../components/NotificationToast'
import { getRedirectUrl } from '../lib/auth-utils'

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        // Redirect if already logged in
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                navigate('/dashboard')
            }
        }
        checkSession()
    }, [navigate])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setNotification(null)
        console.log('Starting auth process...', { isSignUp, email })

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                })

                if (error) {
                    console.error('Signup error:', error)
                    throw error
                }

                console.log('Signup response:', data)

                // Manual Profile Creation Fallback
                if (data.user) {
                    console.log('Creating manual profile for new user...')
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: data.user.id,
                            email: email,
                            full_name: fullName,
                            username: fullName || email.split('@')[0]
                        })

                    if (profileError) {
                        console.warn('Manual profile creation warning (non-blocking):', profileError)
                    } else {
                        console.log('Manual profile created successfully')
                    }
                }

                if (data.session) {
                    console.log('User logged in automatically after signup')
                    navigate('/dashboard')
                } else {
                    setNotification({ type: 'success', message: 'Check your email for the confirmation link!' })
                }
            } else { // Sign In
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) {
                    console.error('Signin error:', error)
                    throw error
                }

                console.log('Signin successful:', data)
                navigate('/dashboard')
            }
        } catch (error: any) {
            console.error('Auth caught error:', error)
            setNotification({ type: 'error', message: error.message || 'An unexpected error occurred' })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setNotification(null)
        try {
            console.log('Initiating Google login with redirect:', getRedirectUrl())
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: getRedirectUrl(),
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
            })
            if (error) throw error
        } catch (error: any) {
            console.error('Google login error details:', error)
            setNotification({
                type: 'error',
                message: `Google Login failed: ${error.message || 'Check if Google is enabled in Supabase'}`
            })
            setLoading(false)
        }
    }

    const handleGithubLogin = async () => {
        setLoading(true)
        setNotification(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: window.location.origin + '/dashboard'
                }
            })
            if (error) throw error
        } catch (error: any) {
            console.error('Github login error:', error)
            setNotification({ type: 'error', message: error.message })
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0"
        >
            {/* Left Panel - Visual & Branding */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r border-zinc-200 dark:border-zinc-800 overflow-hidden bg-[#050505]">
                <div className="absolute inset-0">
                    <VantaClouds />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                </div>

                <div className="relative z-20 flex items-center text-lg font-black tracking-tighter">
                    <div className="p-2 bg-blue-600 rounded-lg mr-3 shadow-lg shadow-blue-500/20">
                        <Code2 className="h-5 w-5" />
                    </div>
                    CLOUD Inc
                </div>

                <div className="relative z-20 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="h-[1px] w-8 bg-blue-500/50" />
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-white">
                            developed by AY
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="p-6 lg:p-8 relative h-full flex flex-col justify-center bg-white dark:bg-black transition-colors duration-500">
                <div className="absolute right-4 top-4 md:right-8 md:top-8 flex items-center gap-4">
                    <ThemeToggle />
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="px-4 py-2 rounded-lg text-sm font-bold transition-all bg-zinc-900 text-white dark:bg-white dark:text-black shadow-lg hover:shadow-xl active:scale-95"
                    >
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </motion.button>
                </div>

                <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {isSignUp ? 'Create an account' : 'Sign in to your account'}
                        </h1>
                        <p className="text-sm text-muted-foreground text-zinc-500 dark:text-zinc-400">
                            {isSignUp ? 'Enter your email below to create your account' : 'Enter your email below to login to your account'}
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleGoogleLogin}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-900 dark:text-zinc-100 text-sm font-medium shadow-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="text-zinc-900 dark:text-white">Google</span>
                            </button>
                            <button
                                onClick={handleGithubLogin}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-zinc-900 dark:text-zinc-100 text-sm font-medium shadow-sm"
                            >
                                <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
                                <span className="text-zinc-900 dark:text-white">GitHub</span>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-black px-2 text-zinc-500 dark:text-zinc-400">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleAuth}>
                            <div className="grid gap-4">
                                {isSignUp && (
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Aman Yatan"
                                            disabled={loading}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-white"
                                        />
                                    </div>
                                )}
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-white"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100">
                                            Password
                                        </label>
                                        {!isSignUp && (
                                            <a href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                                                Forgot password?
                                            </a>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            disabled={loading}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-900 dark:text-white pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-transparent border-none p-0 outline-none"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-10 px-4 py-2 w-full"
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSignUp ? 'Create Account' : 'Sign In with Email'}
                                </button>
                            </div>
                        </form>

                        <p className="px-8 text-center text-xs text-muted-foreground text-zinc-500 dark:text-zinc-400">
                            By clicking continue, you agree to our{' '}
                            <a href="#" className="underline underline-offset-4 hover:text-primary hover:text-zinc-900 dark:hover:text-zinc-100">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="underline underline-offset-4 hover:text-primary hover:text-zinc-900 dark:hover:text-zinc-100">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <NotificationToast
                    isVisible={!!notification}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </motion.div>
    )
}
