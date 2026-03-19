create extension if not exists pgcrypto;

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razao_social text not null,
  cnpj text,
  cidade text,
  endereco text,
  nome_contato text,
  cargo_contato text,
  email_contato text,
  telefone_contato text,
  logo_url text,
  ativo boolean not null default true,
  criado_em timestamptz not null default timezone('utc', now()),
  atualizado_em timestamptz not null default timezone('utc', now())
);

create index if not exists idx_clientes_user_id
  on public.clientes (user_id);

create index if not exists idx_clientes_razao_social
  on public.clientes (razao_social);

create index if not exists idx_clientes_ativo
  on public.clientes (ativo);

create or replace function public.touch_clientes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_clientes_updated_at
  on public.clientes;

create trigger trg_clientes_updated_at
before update on public.clientes
for each row
execute function public.touch_clientes_updated_at();

alter table public.clientes enable row level security;

drop policy if exists "clientes_select_own"
  on public.clientes;
create policy "clientes_select_own"
  on public.clientes
  for select
  using (auth.uid() = user_id);

drop policy if exists "clientes_insert_own"
  on public.clientes;
create policy "clientes_insert_own"
  on public.clientes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "clientes_update_own"
  on public.clientes;
create policy "clientes_update_own"
  on public.clientes
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "clientes_delete_own"
  on public.clientes;
create policy "clientes_delete_own"
  on public.clientes
  for delete
  using (auth.uid() = user_id);
