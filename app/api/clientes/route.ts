import { z } from 'zod';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const clienteSchema = z.object({
  razaoSocial: z.string().min(1),
  nomeContato: z.string().optional().default(''),
  cargoContato: z.string().optional().default(''),
  emailContato: z.string().optional().default(''),
  telefoneContato: z.string().optional().default(''),
  logoUrl: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  ativo: z.boolean().optional().default(true),
});

const payloadSchema = z.object({
  cliente: clienteSchema,
});

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const includeInactive = url.searchParams.get('all') === '1';

  let q = supabase
    .from('clientes')
    .select(
      'id, razao_social, cidade, nome_contato, cargo_contato, email_contato, telefone_contato, logo_url, ativo, criado_em',
    )
    .order('razao_social', { ascending: true });

  if (!includeInactive) {
    q = q.eq('ativo', true);
  }

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type ClienteRow = {
    id: string;
    razao_social: string | null;
    cidade: string | null;
    nome_contato: string | null;
    cargo_contato: string | null;
    email_contato: string | null;
    telefone_contato: string | null;
    logo_url: string | null;
    ativo: boolean | null;
    criado_em?: string | null;
  };

  const items = ((data ?? []) as ClienteRow[]).map((row) => ({
    id: row.id,
    razaoSocial: row.razao_social ?? '',
    cidade: row.cidade ?? '',
    nomeContato: row.nome_contato ?? '',
    cargoContato: row.cargo_contato ?? '',
    emailContato: row.email_contato ?? '',
    telefoneContato: row.telefone_contato ?? '',
    logoUrl: row.logo_url ?? '',
    ativo: Boolean(row.ativo),
    createdAt: (row.criado_em ?? '') as string,
  }));

  return NextResponse.json({ items });
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

  const c = parsed.data.cliente;

  const { data, error } = await supabase
    .from('clientes')
    .insert({
      razao_social: c.razaoSocial,
      nome_contato: c.nomeContato || null,
      cargo_contato: c.cargoContato || null,
      email_contato: c.emailContato || null,
      telefone_contato: c.telefoneContato || null,
      logo_url: c.logoUrl || null,
      cidade: c.cidade || null,
      ativo: c.ativo,
    })
    .select(
      'id, razao_social, cidade, nome_contato, cargo_contato, email_contato, telefone_contato, logo_url, ativo, criado_em',
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type ClienteRow = {
    id: string;
    razao_social: string | null;
    cidade: string | null;
    nome_contato: string | null;
    cargo_contato: string | null;
    email_contato: string | null;
    telefone_contato: string | null;
    logo_url: string | null;
    ativo: boolean | null;
    criado_em?: string | null;
  };

  const row = data as ClienteRow;

  return NextResponse.json({
    id: row.id,
    razaoSocial: row.razao_social ?? '',
    cidade: row.cidade ?? '',
    nomeContato: row.nome_contato ?? '',
    cargoContato: row.cargo_contato ?? '',
    emailContato: row.email_contato ?? '',
    telefoneContato: row.telefone_contato ?? '',
    logoUrl: row.logo_url ?? '',
    ativo: Boolean(row.ativo),
    createdAt: (row.criado_em ?? '') as string,
  });
}

