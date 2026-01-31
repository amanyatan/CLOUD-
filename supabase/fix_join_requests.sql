-- Fix for join requests not showing on admin profile
-- This ensures proper foreign key relationships for the profiles table

-- First, ensure the community_members table can properly join with profiles
-- The user_id should reference profiles.id instead of just auth.users

-- Drop the existing foreign key if it exists and recreate it properly
-- Note: This assumes profiles.id is the same as auth.users.id (which is standard in Supabase)

-- Add a foreign key constraint to link user_id to profiles table
-- This allows us to join community_members with profiles table
DO $$ 
BEGIN
    -- Check if the constraint doesn't exist before adding
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'community_members_user_id_profiles_fkey'
    ) THEN
        ALTER TABLE public.community_members 
        ADD CONSTRAINT community_members_user_id_profiles_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verify the data exists
-- Run this to check if there are any pending requests
SELECT 
    cm.id,
    cm.community_id,
    cm.user_id,
    cm.status,
    c.name as community_name,
    c.creator_id,
    p.full_name as requester_name
FROM community_members cm
LEFT JOIN communities c ON cm.community_id = c.id
LEFT JOIN profiles p ON cm.user_id = p.id
WHERE cm.status = 'pending';
