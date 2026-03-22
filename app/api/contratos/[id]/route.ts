import { NextResponse } from 'next/server';

import {
  contratoPayloadSchema,
  type ContratoPayload,
} from '@/lib/schemas/contrato';
import { formatSupabaseError } from '@/lib/supabase/error';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function buildDbPayload(contrato: ContratoPayload) {
  return {
    cliente_id: contrato.clienteId || null,
    template_id: contrato.templateId,
    titulo: contrato.contractTitle || 'Contrato',
    subtitulo: contrato.projectTitle || null,
    referencia_comercial: contrato.proposalReference || null,
    cidade_assinatura: contrato.cidadeAssinatura || null,
    payload: contrato,
  };
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = contratoPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('contratos')
      .update(buildDbPayload(parsed.data.contrato))
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, atualizado_em')
      .single();

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao atualizar contrato') },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      updatedAt: data.atualizado_em ?? '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao atualizar contrato') },
      { status: 500 },
    );
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('contratos')
      .select('id, payload, atualizado_em, criado_em')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      const status = error.code === 'PGRST116' ? 404 : 500;
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao carregar contrato') },
        { status },
      );
    }

    return NextResponse.json({
      id: data.id,
      contrato: data.payload,
      updatedAt: data.atualizado_em ?? data.criado_em ?? '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao carregar contrato') },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('contratos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao excluir contrato') },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao excluir contrato') },
      { status: 500 },
    );
  }
}
