-- Add is_featured column to announcements table
alter table announcements 
add column is_featured boolean default false;

-- Update existing records to not be featured (though default handles this, good to be explicit if needed)
update announcements set is_featured = false where is_featured is null;
