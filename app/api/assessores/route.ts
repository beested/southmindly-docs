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
    .from('assessores')
    .select('id, nome, email, telefone, ativo')
    .eq('ativo', true)
    .order('nome', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type AssessorRow = {
    id: string;
    nome: string | null;
    email: string | null;
    telefone: string | null;
    ativo: boolean | null;
  };

  const items = ((data ?? []) as AssessorRow[]).map((row) => ({
    id: row.id,
    nome: row.nome ?? '',
    email: row.email ?? '',
    telefone: row.telefone ?? '',
  }));

  return NextResponse.json({ items });
}

