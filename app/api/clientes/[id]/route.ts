import { z } from 'zod';
import { NextResponse } from 'next/server';

import { formatSupabaseError } from '@/lib/supabase/error';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const clienteSchema = z.object({
  razaoSocial: z.string().min(1),
  cnpj: z.string().optional().default(''),
  nomeContato: z.string().optional().default(''),
  cargoContato: z.string().optional().default(''),
  emailContato: z.string().optional().default(''),
  telefoneContato: z.string().optional().default(''),
  logoUrl: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  ativo: z.boolean().optional(),
});

const payloadSchema = z.object({
  cliente: clienteSchema,
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json().catch(() => null);
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const c = parsed.data.cliente;

    const payload: Record<string, unknown> = {
      razao_social: c.razaoSocial,
      cnpj: c.cnpj || null,
      nome_contato: c.nomeContato || null,
      cargo_contato: c.cargoContato || null,
      email_contato: c.emailContato || null,
      telefone_contato: c.telefoneContato || null,
      logo_url: c.logoUrl || null,
      cidade: c.cidade || null,
    };

    if (typeof c.ativo === 'boolean') payload.ativo = c.ativo;

    const { data, error } = await supabase
      .from('clientes')
      .update(payload)
      .eq('id', id)
      .select(
        'id, razao_social, cnpj, cidade, nome_contato, cargo_contato, email_contato, telefone_contato, logo_url, ativo, criado_em',
      )
      .single();

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao atualizar cliente') },
        { status: 500 },
      );
    }

    type ClienteRow = {
      id: string;
      razao_social: string | null;
      cnpj: string | null;
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
      cnpj: row.cnpj ?? '',
      cidade: row.cidade ?? '',
      nomeContato: row.nome_contato ?? '',
      cargoContato: row.cargo_contato ?? '',
      emailContato: row.email_contato ?? '',
      telefoneContato: row.telefone_contato ?? '',
      logoUrl: row.logo_url ?? '',
      ativo: Boolean(row.ativo),
      createdAt: (row.criado_em ?? '') as string,
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao atualizar cliente') },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('clientes')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao desativar cliente') },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao desativar cliente') },
      { status: 500 },
    );
  }
}
