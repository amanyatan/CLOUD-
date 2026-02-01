-- Create the 'files' table
create table if not exists public.files (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  content text default '',
  language text default 'plaintext',
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.files enable row level security;

-- Create policies
create policy "Users can view their own files"
on public.files for select
using ( auth.uid() = user_id );

create policy "Users can insert their own files"
on public.files for insert
with check ( auth.uid() = user_id );

create policy "Users can update their own files"
on public.files for update
using ( auth.uid() = user_id );

create policy "Users can delete their own files"
on public.files for delete
using ( auth.uid() = user_id );

-- Optional: Create a 'profiles' table if you want to store user details later
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  username text,
  full_name text,
  bio text,
  avatar_url text,
  updated_at timestamp with time zone
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
on public.profiles for select
using ( true );

create policy "Users can insert their own profile"
on public.profiles for insert
with check ( auth.uid() = id );

create policy "Users can update own profile"
on public.profiles for update
using ( auth.uid() = id );

-- Function to handle new user signup (auto-create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, username, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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

