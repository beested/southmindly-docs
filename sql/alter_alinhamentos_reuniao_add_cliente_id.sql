alter table public.alinhamentos_reuniao
add column if not exists cliente_id uuid references public.clientes(id) on delete set null;

create index if not exists idx_alinhamentos_reuniao_cliente_id
  on public.alinhamentos_reuniao (cliente_id);
