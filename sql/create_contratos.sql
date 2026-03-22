create extension if not exists pgcrypto;

create table if not exists public.contratos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete set null,
  template_id text not null,
  titulo text not null,
  subtitulo text,
  referencia_comercial text,
  cidade_assinatura text,
  payload jsonb not null,
  criado_em timestamptz not null default timezone('utc', now()),
  atualizado_em timestamptz not null default timezone('utc', now())
);

create index if not exists idx_contratos_user_id
  on public.contratos (user_id);

create index if not exists idx_contratos_cliente_id
  on public.contratos (cliente_id);

create index if not exists idx_contratos_template_id
  on public.contratos (template_id);

create index if not exists idx_contratos_atualizado_em
  on public.contratos (atualizado_em desc);

create or replace function public.touch_contratos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_contratos_updated_at
  on public.contratos;

create trigger trg_contratos_updated_at
before update on public.contratos
for each row
execute function public.touch_contratos_updated_at();

alter table public.contratos enable row level security;

drop policy if exists "contratos_select_own"
  on public.contratos;
create policy "contratos_select_own"
  on public.contratos
  for select
  using (auth.uid() = user_id);

drop policy if exists "contratos_insert_own"
  on public.contratos;
create policy "contratos_insert_own"
  on public.contratos
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "contratos_update_own"
  on public.contratos;
create policy "contratos_update_own"
  on public.contratos
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "contratos_delete_own"
  on public.contratos;
create policy "contratos_delete_own"
  on public.contratos
  for delete
  using (auth.uid() = user_id);
