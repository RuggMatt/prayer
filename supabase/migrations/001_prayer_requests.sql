create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  prayer text not null check (char_length(trim(prayer)) > 0),
  created_at timestamptz not null default timezone('utc', now()),
  answered_at timestamptz
);

create index prayer_requests_user_id_created_at_idx
  on public.prayer_requests (user_id, created_at desc);

alter table public.prayer_requests enable row level security;

create policy "Users can view their own prayer requests"
  on public.prayer_requests for select
  using (auth.uid() = user_id);

create policy "Users can create their own prayer requests"
  on public.prayer_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own prayer requests"
  on public.prayer_requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own prayer requests"
  on public.prayer_requests for delete
  using (auth.uid() = user_id);

create or replace function public.set_prayer_request_user_id()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.user_id = auth.uid();
  return new;
end;
$$;

create trigger set_prayer_request_user_id
  before insert on public.prayer_requests
  for each row execute function public.set_prayer_request_user_id();
