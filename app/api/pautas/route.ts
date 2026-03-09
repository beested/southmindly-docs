import { z } from 'zod';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const agendaItemSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  responsavel: z.string(),
  duracao: z.string(),
  topicos: z.array(z.string()).optional(),
});

const pautaDataSchema = z.object({
  titulo: z.string(),
  data: z.string(),
  horario: z.string(),
  local: z.string(),
  participantes: z.string(),
  objetivo: z.string(),
  observacoes: z.string(),
  itens: z.array(agendaItemSchema),
});

const payloadSchema = z.object({
  docId: z.string().min(1),
  pauta: pautaDataSchema,
});

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('pautas_reuniao')
    .select('id, doc_id, titulo, updated_at, created_at')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type PautaListRow = {
    id: string;
    doc_id: string;
    titulo: string;
    updated_at: string;
    created_at: string;
  };

  return NextResponse.json({
    items: ((data ?? []) as PautaListRow[]).map((row) => ({
      id: row.id as string,
      docId: row.doc_id as string,
      titulo: row.titulo as string,
      updatedAt: row.updated_at as string,
      createdAt: row.created_at as string,
    })),
  });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = payloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { docId, pauta } = parsed.data;

  const { data, error } = await supabase
    .from('pautas_reuniao')
    .insert({
      doc_id: docId,
      titulo: pauta.titulo || 'Sem título',
      pauta,
    })
    .select('id, doc_id, titulo, updated_at, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    id: data.id as string,
    docId: data.doc_id as string,
    titulo: data.titulo as string,
    updatedAt: data.updated_at as string,
    createdAt: data.created_at as string,
  });
}
