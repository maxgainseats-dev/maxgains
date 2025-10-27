-- profiles table to store user metadata
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  full_name text,
  updated_at timestamp with time zone,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20)
);

-- Enable RLS for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- tickets table
create table tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id), -- Link to auth.users table
  link text not null,
  validation_data jsonb,
  status text default 'open' not null,
  discord_channel_id text,
  created_at timestamp with time zone default now()
);

-- Enable RLS for tickets
alter table tickets enable row level security;

create policy "Users can view their own tickets."
  on tickets for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own tickets."
  on tickets for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own tickets."
  on tickets for update
  using ( auth.uid() = user_id );

-- chat_messages table
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references tickets(id) on delete cascade,
  sender_type text not null, -- 'user' or 'agent'
  content text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS for chat_messages
alter table chat_messages enable row level security;

create policy "Users can view messages for their own tickets."
  on chat_messages for select
  using ( exists (select 1 from tickets where id = ticket_id and user_id = auth.uid()) );

create policy "Users can insert messages for their own tickets."
  on chat_messages for insert
  with check ( exists (select 1 from tickets where id = ticket_id and user_id = auth.uid()) );
