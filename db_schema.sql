-- Create the announcements table
create table announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  is_active boolean default true,
  priority int default 0,
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS)
alter table announcements enable row level security;

-- Create policy to allow public read access
create policy "Public announcements are viewable by everyone"
  on announcements for select
  to anon
  using (true);

-- Insert some sample data to verify it works
insert into announcements (title, content, priority)
values 
  ('Fall/Winter League Signups Open!', 'Get your teams ready! Signups close on Sept 1st.', 1),
  ('Friday Night Draws at Silver Star', 'Join us every Friday for blind draws.', 2);
