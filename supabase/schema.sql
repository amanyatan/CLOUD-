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
