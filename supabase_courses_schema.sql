-- Create the paycourses table
create table public.paycourses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  price numeric,
  semester text,
  features jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone
);

-- Set up Row Level Security (RLS) for paycourses
alter table public.paycourses enable row level security;

create policy "Anyone can view paycourses."
  on public.paycourses for select
  using ( true );

create policy "Admins can manage paycourses."
  on public.paycourses for all
  using ( auth.role() = 'authenticated' );

-- Create the freecourses table
create table public.freecourses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  semester text,
  features jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone
);

-- Set up Row Level Security (RLS) for freecourses
alter table public.freecourses enable row level security;

create policy "Anyone can view freecourses."
  on public.freecourses for select
  using ( true );

create policy "Admins can manage freecourses."
  on public.freecourses for all
  using ( auth.role() = 'authenticated' );

