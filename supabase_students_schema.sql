-- Create the students table
create table public.students (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  phone text unique,
  parent_phone text,
  gender text,
  governorate text,
  college_name text,
  academic_year text,
  address_detailed text,
  how_did_you_know text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.students enable row level security;

-- Create policies
create policy "Users can view their own profile."
  on public.students for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.students for update
  using ( auth.uid() = id );

-- Create a policy allowing authenticated users to insert their profile upon registration
create policy "Users can insert their own profile."
  on public.students for insert
  with check ( auth.uid() = id );
