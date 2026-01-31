-- 1. Update Profile table
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists full_name text;

-- 2. Create Communities Table
create table if not exists public.communities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  project_details text,
  max_members int default 8 check (max_members <= 8),
  creator_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Community Members Table for Membership and Requests
create table if not exists public.community_members (
  id uuid default gen_random_uuid() primary key,
  community_id uuid references public.communities(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(community_id, user_id)
);

-- 4. Enable RLS
alter table public.communities enable row level security;
alter table public.community_members enable row level security;

-- Policies for Communities
create policy "Communities are viewable by everyone" on public.communities for select using (true);
create policy "Users can create communities" on public.communities for insert with check (auth.uid() = creator_id);
create policy "Creators can update their communities" on public.communities for update using (auth.uid() = creator_id);
create policy "Creators can delete their communities" on public.communities for delete using (auth.uid() = creator_id);

-- Policies for Community Members
create policy "Members are viewable by everyone" on public.community_members for select using (true);
create policy "Users can request to join" on public.community_members for insert with check (auth.uid() = user_id);
create policy "Owners can approve/reject members" on public.community_members for update using (
  exists (
    select 1 from public.communities 
    where id = community_members.community_id and creator_id = auth.uid()
  )
);

-- 5. Notification Function Helper (Optional but good to have)
-- This can be used later if we add a dedicated notifications table.
-- For now status='pending' in community_members acts as a request.

-- 6. Storage for Profile Images
-- (Note: Run these commands in the Supabase Dashboard SQL Editor to ensure buckets are created)
-- insert into storage.buckets (id, name, public) values ('profiles', 'profiles', true);
-- create policy "Profile images are public" on storage.objects for select using (bucket_id = 'profiles');
-- create policy "Users can upload their own profile image" on storage.objects for insert with check (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
