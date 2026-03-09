import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('escopos_catalogo')
    .select(
      'id, nome, descricao, tipo_cobranca, valor_padrao, unidade_label, ordem, ativo',
    )
    .eq('ativo', true)
    .order('ordem', { ascending: true })
    .order('nome', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type EscopoRow = {
    id: string;
    nome: string | null;
    descricao: string | null;
    tipo_cobranca: string | null;
    valor_padrao: number | null;
    unidade_label: string | null;
    ordem: number | null;
    ativo: boolean | null;
  };

  const items = ((data ?? []) as EscopoRow[]).map((row) => ({
    id: row.id,
    nome: row.nome ?? '',
    descricao: row.descricao ?? '',
    tipoCobranca: row.tipo_cobranca ?? '',
    valorPadrao: row.valor_padrao ?? null,
    unidadeLabel: row.unidade_label ?? '',
    ordem: row.ordem ?? 0,
  }));

  return NextResponse.json({ items });
}

