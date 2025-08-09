create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  name text not null,
  role text not null,
  points integer not null default 0,
  referralCode text unique,
  referrerId uuid references users(id),
  createdAt timestamptz default now()
);
