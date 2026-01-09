-- Disable RLS on the announcements table to allow edits
-- (Since we haven't implemented authentication yet, this allows the public API key to modify data, which is needed for the admin panel right now)

alter table announcements disable row level security;
