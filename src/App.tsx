import { Suspense, lazy, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { supabase } from './lib/supabase'

// Lazy load pages to improve initial load performance
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const IDE = lazy(() => import('./pages/IDE'))
const Features = lazy(() => import('./pages/Features'))
const Community = lazy(() => import('./pages/Community'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const Docs = lazy(() => import('./pages/Docs'))
const Pricing = lazy(() => import('./pages/Pricing'))

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen w-full bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
)

function AnimatedRoutes({ session }: { session: any }) {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <Suspense fallback={<LoadingFallback />}>
                        {session ? <Navigate to="/dashboard" replace /> : <Home />}
                    </Suspense>
                } />
                <Route path="/login" element={
                    <Suspense fallback={<LoadingFallback />}>
                        {session ? <Navigate to="/dashboard" replace /> : <Login />}
                    </Suspense>
                } />
                <Route path="/dashboard" element={
                    <Suspense fallback={<LoadingFallback />}>
                        {session ? <Dashboard /> : <Navigate to="/login" replace />}
                    </Suspense>
                } />
                <Route path="/ide" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <IDE />
                    </Suspense>
                } />
                <Route path="/features" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <Features />
                    </Suspense>
                } />
                <Route path="/community" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <Community />
                    </Suspense>
                } />
                <Route path="/profile" element={
                    <Suspense fallback={<LoadingFallback />}>
                        {session ? <UserProfile /> : <Navigate to="/login" replace />}
                    </Suspense>
                } />
                <Route path="/docs" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <Docs />
                    </Suspense>
                } />
                <Route path="/pricing" element={
                    <Suspense fallback={<LoadingFallback />}>
                        <Pricing />
                    </Suspense>
                } />
            </Routes>
        </AnimatePresence>
    )
}

function App() {
    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) return <LoadingFallback />

    return (
        <BrowserRouter>
            <AnimatedRoutes session={session} />
        </BrowserRouter>
    )
}

export default App
