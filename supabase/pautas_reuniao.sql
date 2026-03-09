-- Pautas de Reunião (SouthMindly Docs)
-- Execute no Supabase SQL Editor (Database -> SQL).

create table if not exists public.pautas_reuniao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  doc_id text not null,
  titulo text not null,
  pauta jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pautas_reuniao_user_updated_idx
  on public.pautas_reuniao (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_pautas_reuniao_updated_at on public.pautas_reuniao;
create trigger set_pautas_reuniao_updated_at
before update on public.pautas_reuniao
for each row execute function public.set_updated_at();

alter table public.pautas_reuniao enable row level security;

drop policy if exists "pautas_reuniao_select_own" on public.pautas_reuniao;
create policy "pautas_reuniao_select_own"
on public.pautas_reuniao
for select
using (user_id = auth.uid());

drop policy if exists "pautas_reuniao_insert_own" on public.pautas_reuniao;
create policy "pautas_reuniao_insert_own"
on public.pautas_reuniao
for insert
with check (user_id = auth.uid());

drop policy if exists "pautas_reuniao_update_own" on public.pautas_reuniao;
create policy "pautas_reuniao_update_own"
on public.pautas_reuniao
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "pautas_reuniao_delete_own" on public.pautas_reuniao;
create policy "pautas_reuniao_delete_own"
on public.pautas_reuniao
for delete
using (user_id = auth.uid());

