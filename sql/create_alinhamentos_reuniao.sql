create extension if not exists pgcrypto;

create table if not exists public.alinhamentos_reuniao (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete set null,
  titulo text,
  servico_principal text,
  participantes jsonb not null default '[]'::jsonb,
  data_reuniao date,
  hora_reuniao text,
  local_reuniao text,
  objetivos_reuniao text,
  assuntos_tratados text,
  servicos jsonb not null default '[]'::jsonb,
  dia_entrega_aprovacao text,
  prazo_maximo_aprovacao text,
  dia_horario_postagem text,
  atividades_incluidas text,
  forma_pagamento text,
  prazo_contrato text,
  emissao_nota_fiscal text,
  data_inicio_contrato date,
  consideracoes_proposta text,
  indicadores_relatorio text,
  observacoes text,
  criado_em timestamptz not null default timezone('utc', now()),
  atualizado_em timestamptz not null default timezone('utc', now())
);

create index if not exists idx_alinhamentos_reuniao_user_id
  on public.alinhamentos_reuniao (user_id);

create index if not exists idx_alinhamentos_reuniao_data_reuniao
  on public.alinhamentos_reuniao (data_reuniao desc nulls last);

create or replace function public.touch_alinhamentos_reuniao_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_alinhamentos_reuniao_updated_at
  on public.alinhamentos_reuniao;

create trigger trg_alinhamentos_reuniao_updated_at
before update on public.alinhamentos_reuniao
for each row
execute function public.touch_alinhamentos_reuniao_updated_at();

alter table public.alinhamentos_reuniao enable row level security;

drop policy if exists "alinhamentos_reuniao_select_own"
  on public.alinhamentos_reuniao;
create policy "alinhamentos_reuniao_select_own"
  on public.alinhamentos_reuniao
  for select
  using (auth.uid() = user_id);

drop policy if exists "alinhamentos_reuniao_insert_own"
  on public.alinhamentos_reuniao;
create policy "alinhamentos_reuniao_insert_own"
  on public.alinhamentos_reuniao
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "alinhamentos_reuniao_update_own"
  on public.alinhamentos_reuniao;
create policy "alinhamentos_reuniao_update_own"
  on public.alinhamentos_reuniao
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "alinhamentos_reuniao_delete_own"
  on public.alinhamentos_reuniao;
create policy "alinhamentos_reuniao_delete_own"
  on public.alinhamentos_reuniao
  for delete
  using (auth.uid() = user_id);
