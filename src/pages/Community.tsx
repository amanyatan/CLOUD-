import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Plus, Users, ArrowLeft, Check, X, Trash2, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground'
import ThemeToggle from '../components/ThemeToggle'
import NotificationToast from '../components/NotificationToast'


interface Community {
    id: string
    name: string
    description: string
    project_details: string
    max_members: number
    creator_id: string
    created_at: string
    member_count?: number
    user_status?: string | null
    profiles?: { full_name: string; avatar_url: string }
}

interface Notification {
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
}

export default function Community() {
    const navigate = useNavigate()
    const [communities, setCommunities] = useState<Community[]>([])
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [notification, setNotification] = useState<Notification | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        project_details: '',
        max_members: 8
    })

    useEffect(() => {
        fetchCurrentUser()
        fetchCommunities()
    }, [])

    const fetchCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setCurrentUserId(user.id)
        }
    }

    const fetchCommunities = async () => {
        console.log('Fetching communities...')
        const { data: { user } } = await supabase.auth.getUser()

        // Fetch communities
        const { data: communitiesData, error } = await supabase
            .from('communities')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching communities:', error)
            return
        }

        // For each community, get the count of approved members AND the current user's status
        const communitiesWithCounts = await Promise.all(
            (communitiesData || []).map(async (community) => {
                const { count } = await supabase
                    .from('community_members')
                    .select('*', { count: 'exact', head: true })
                    .eq('community_id', community.id)
                    .eq('status', 'approved')

                let userStatus = null
                if (user) {
                    const { data: membership } = await supabase
                        .from('community_members')
                        .select('status')
                        .eq('community_id', community.id)
                        .eq('user_id', user.id)
                        .single()

                    if (membership) {
                        userStatus = membership.status
                    }
                }

                return {
                    ...community,
                    member_count: count || 0,
                    user_status: userStatus
                }
            })
        )

        console.log('Fetched communities with details:', communitiesWithCounts)
        setCommunities(communitiesWithCounts)
    }

    const handleCreateCommunity = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Creating community with data:', formData)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setNotification({ message: 'You must be logged in to create a community', type: 'error' })
            return
        }

        const { data, error } = await supabase
            .from('communities')
            .insert([{
                ...formData,
                creator_id: user.id
            }])
            .select()

        if (error) {
            console.error('Error creating community:', error)
            setNotification({ message: `Error: ${error.message}`, type: 'error' })
        } else {
            console.log('Community created successfully:', data)
            setShowCreateForm(false)
            setFormData({ name: '', description: '', project_details: '', max_members: 8 })
            setNotification({ message: 'Community created successfully!', type: 'success' })
            fetchCommunities()
        }
    }

    const handleJoinRequest = async (communityId: string, creatorId: string, maxMembers: number, currentMembers: number) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setNotification({ message: 'You must be logged in to join a community', type: 'error' })
            return
        }

        // Check if user is the creator
        if (user.id === creatorId) {
            setNotification({ message: 'You cannot join your own community!', type: 'warning' })
            return
        }

        // Check if community is full
        if (currentMembers >= maxMembers) {
            setNotification({ message: 'This community has reached maximum members!', type: 'warning' })
            return
        }

        // Check if user already has a pending or approved request
        const { data: existingRequest } = await supabase
            .from('community_members')
            .select('*')
            .eq('community_id', communityId)
            .eq('user_id', user.id)
            .single()

        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                setNotification({ message: 'You already have a pending request for this community', type: 'info' })
            } else if (existingRequest.status === 'approved') {
                setNotification({ message: 'You are already a member of this community', type: 'info' })
            }
            return
        }

        // Send join request
        const { error } = await supabase
            .from('community_members')
            .insert([{
                community_id: communityId,
                user_id: user.id,
                status: 'pending'
            }])

        if (error) {
            setNotification({ message: 'Failed to send join request', type: 'error' })
        } else {
            setNotification({ message: 'Join request sent successfully!', type: 'success' })
        }
    }

    const handleDeleteCommunity = async (communityId: string) => {
        const { error } = await supabase
            .from('communities')
            .delete()
            .eq('id', communityId)

        if (error) {
            setNotification({ message: 'Failed to delete community', type: 'error' })
        } else {
            setNotification({ message: 'Community deleted successfully', type: 'success' })
            setDeleteConfirm(null)
            fetchCommunities()
        }
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
                        <h1 className="text-xl font-bold">Community</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateForm(true)}
                            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Create Community
                        </motion.button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {communities.map((community) => {
                            const isFull = (community.member_count || 0) >= community.max_members
                            const isCreator = currentUserId === community.creator_id

                            return (
                                <motion.div
                                    key={community.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/50 transition-all flex flex-col"
                                >
                                    {/* Header with icon and badges */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                            <Users size={28} />
                                        </div>

                                        {/* Horizontal badges */}
                                        <div className="flex flex-wrap gap-2 items-start flex-1">
                                            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                                                {community.max_members} max
                                            </span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isFull ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                                                }`}>
                                                {community.member_count || 0} members
                                            </span>
                                            {isFull && (
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                                                    FULL
                                                </span>
                                            )}
                                            {isCreator && (
                                                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 font-bold">
                                                    OWNER
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-lg font-bold mb-2">{community.name}</h3>
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{community.description}</p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        <span className="text-gray-600">Project:</span> {community.project_details}
                                    </p>

                                    {/* Footer with creator and actions */}
                                    <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-400">
                                                by {community.profiles?.full_name || 'Anonymous'}
                                            </div>
                                            {!isCreator && (
                                                <button
                                                    onClick={() => {
                                                        if (!community.user_status) {
                                                            handleJoinRequest(
                                                                community.id,
                                                                community.creator_id,
                                                                community.max_members,
                                                                community.member_count || 0
                                                            )
                                                        }
                                                    }}
                                                    disabled={isFull || !!community.user_status}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${community.user_status === 'approved'
                                                            ? 'bg-green-600 text-white'
                                                            : community.user_status === 'pending'
                                                                ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                                                                : isFull
                                                                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                                                    : 'bg-blue-600 hover:bg-blue-500'
                                                        }`}
                                                >
                                                    {community.user_status === 'approved'
                                                        ? 'Joined'
                                                        : community.user_status === 'pending'
                                                            ? 'Pending'
                                                            : isFull ? 'Full' : 'Join'}
                                                </button>
                                            )}
                                        </div>

                                        {/* Delete button at bottom for creators */}
                                        {isCreator && (
                                            <button
                                                onClick={() => setDeleteConfirm(community.id)}
                                                className="w-full px-4 py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-lg text-xs font-bold text-red-400 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={14} />
                                                Delete Community
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </main>

                {/* Create Form Modal */}
                {showCreateForm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Create Community</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateCommunity} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Community Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter community name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 h-24 resize-none"
                                        placeholder="Describe your community"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Project Details</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.project_details}
                                        onChange={(e) => setFormData({ ...formData, project_details: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                        placeholder="What are you building?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Max Members (up to 8)</label>
                                    <input
                                        type="number"
                                        min="2"
                                        max="8"
                                        required
                                        value={formData.max_members}
                                        onChange={(e) => setFormData({ ...formData, max_members: parseInt(e.target.value) })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} />
                                        Create
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0a0a0a] border border-red-500/30 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-500/20 rounded-full">
                                    <AlertTriangle size={24} className="text-red-500" />
                                </div>
                                <h2 className="text-xl font-bold">Delete Community?</h2>
                            </div>

                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete this community? This action cannot be undone and all members will be removed.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteCommunity(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Notification Toast */}
                {notification && (
                    <NotificationToast
                        message={notification.message}
                        type={notification.type}
                        isVisible={!!notification}
                        onClose={() => setNotification(null)}
                    />
                )}
            </div>
        </div>
    )
}
