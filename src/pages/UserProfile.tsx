import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Upload, Bell, LogOut, Check, X, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import ThemeToggle from '../components/ThemeToggle'
import NotificationToast from '../components/NotificationToast'
import { createAvatar } from '@dicebear/core'
import { toonHead } from '@dicebear/collection'
import { useMemo } from 'react'

interface Profile {
    id: string
    email: string
    full_name: string
    username?: string
    bio: string
    avatar_url: string
}

interface JoinRequest {
    id: string
    community_id: string
    user_id: string
    status: string
    created_at: string
    communities: { name: string }
    profiles: { full_name: string }
}

export default function Profile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        avatar_url: ''
    })

    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

    const avatarSvg = useMemo(() => {
        // Use custom seed if available, otherwise fallback to profile ID or default
        const seed = formData.avatar_url || profile?.id || 'default'
        return createAvatar(toonHead, {
            seed: seed,
        }).toDataUri()
    }, [profile?.id, formData.avatar_url])

    const shuffleAvatar = () => {
        const newSeed = Math.random().toString(36).substring(7)
        setFormData(prev => ({ ...prev, avatar_url: newSeed }))
    }

    useEffect(() => {
        fetchProfile()
        fetchJoinRequests()
    }, [])

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) {
            console.error('Error fetching profile:', error)
            return
        }

        if (data) {
            setProfile(data)
            setFormData({
                full_name: data.full_name || data.username || '',
                bio: data.bio || '',
                avatar_url: data.avatar_url || ''
            })
        }
    }

    const fetchJoinRequests = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        console.log('Fetching join requests for user:', user.id)

        // First get communities owned by this user
        const { data: ownedCommunities, error: commError } = await supabase
            .from('communities')
            .select('id, name')
            .eq('creator_id', user.id)

        console.log('Owned communities:', ownedCommunities, 'Error:', commError)

        if (!ownedCommunities || ownedCommunities.length === 0) {
            console.log('No owned communities found')
            setJoinRequests([])
            return
        }

        const communityIds = ownedCommunities.map(c => c.id)
        console.log('Community IDs:', communityIds)

        // Then get pending requests for those communities
        // We use left joins (by removing !inner) to ensure we see the request 
        // even if the profile or community details are missing for some reason
        const { data, error } = await supabase
            .from('community_members')
            .select(`
                id,
                community_id,
                user_id,
                status,
                created_at,
                communities (
                    name
                ),
                profiles:user_id (
                    full_name
                )
            `)
            .eq('status', 'pending')
            .in('community_id', communityIds)

        console.log('Join requests response:', data)
        if (error) {
            console.error('Error fetching join requests:', error)
        }

        if (data) {
            // Map the data to ensure we have valid objects even if join failed
            const formattedRequests = (data as any[]).map(req => ({
                ...req,
                communities: req.communities || { name: 'Unknown Community' },
                profiles: req.profiles || { full_name: 'Unknown User' }
            }))
            setJoinRequests(formattedRequests)
        }
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        console.log('Updating profile for user:', user.id, 'Data:', formData)

        // Update BOTH full_name and username for consistency
        const updateData = {
            full_name: formData.full_name,
            username: formData.full_name,
            bio: formData.bio,
            avatar_url: formData.avatar_url
        }

        const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)

        if (error) {
            console.error('Update profile error:', error)
            setNotification({ message: `Error: ${error.message}`, type: 'error' })
        } else {
            // Force local update for immediate name change in UI
            setProfile(prev => prev ? { ...prev, ...updateData } : null)
            setNotification({ message: 'Profile updated successfully!', type: 'success' })
            setIsEditing(false)
            fetchProfile()
        }
    }

    const handleApproveRequest = async (requestId: string, approve: boolean) => {
        const { error } = await supabase
            .from('community_members')
            .update({ status: approve ? 'approved' : 'rejected' })
            .eq('id', requestId)

        if (error) {
            setNotification({ message: 'Failed to update request', type: 'error' })
        } else {
            setNotification({ message: `Request ${approve ? 'approved' : 'rejected'}`, type: 'success' })
            fetchJoinRequests()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30">
                <AnimatedBackground absolute />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold">Profile</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-4xl mx-auto p-6 space-y-6">
                    {/* Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative group/avatar">
                                    <div className="w-20 h-20 rounded-full border-2 border-blue-500/50 overflow-hidden bg-black/40">
                                        <img src={avatarSvg} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={shuffleAvatar}
                                            className="absolute -bottom-1 -right-1 p-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg transition-all hover:scale-110"
                                            title="Shuffle Avatar"
                                        >
                                            <RefreshCw size={12} className="text-white" />
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{profile?.full_name || (profile as any)?.username || 'User'}</h2>
                                    <p className="text-gray-400">{profile?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-colors"
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                                        placeholder="Tell us about yourself"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Avatar URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.avatar_url}
                                            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                            placeholder="https://..."
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <Upload size={16} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <div>
                                <p className="text-gray-300">{profile?.bio || 'No bio yet'}</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Notifications */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Bell size={20} className="text-blue-500" />
                            <h3 className="text-lg font-bold">Join Requests</h3>
                            {joinRequests.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500 text-xs font-bold">
                                    {joinRequests.length}
                                </span>
                            )}
                        </div>

                        {joinRequests.length === 0 ? (
                            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                                <p className="text-gray-400 text-sm mb-2">No pending requests</p>
                                <p className="text-xs text-gray-500 italic">Requests for communities you own will appear here</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {joinRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <p className="font-bold text-blue-400">
                                                {request.profiles?.full_name || 'Anonymous User'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                requested to join <span className="text-gray-200 font-medium">{(request as any).communities?.name || 'Unknown Community'}</span>
                                            </p>
                                            <p className="text-[10px] text-gray-600">
                                                {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproveRequest(request.id, true)}
                                                className="p-2.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white rounded-lg transition-all"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleApproveRequest(request.id, false)}
                                                className="p-2.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>

            {notification && (
                <NotificationToast
                    message={notification.message}
                    type={notification.type}
                    isVisible={!!notification}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    )
}
