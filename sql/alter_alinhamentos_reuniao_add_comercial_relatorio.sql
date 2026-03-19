alter table public.alinhamentos_reuniao
add column if not exists consideracoes_proposta text,
add column if not exists indicadores_relatorio text;
