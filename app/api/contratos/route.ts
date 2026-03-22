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

const templateLabels: Record<ContratoPayload['templateId'], string> = {
  website: 'Website',
  'marketing-digital': 'Marketing digital',
};

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('contratos')
      .select(
        'id, cliente_id, template_id, titulo, subtitulo, cidade_assinatura, payload, atualizado_em, criado_em',
      )
      .order('atualizado_em', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao carregar contratos') },
        { status: 500 },
      );
    }

    return NextResponse.json({
      items: (data ?? []).map((row) => ({
        id: row.id,
        clienteId: row.cliente_id ?? '',
        title: row.titulo ?? '',
        clientName:
          row.payload &&
          typeof row.payload === 'object' &&
          'contratanteNome' in row.payload &&
          typeof row.payload.contratanteNome === 'string'
            ? row.payload.contratanteNome
            : '',
        subtitle: row.subtitulo ?? '',
        templateId: row.template_id ?? 'website',
        templateLabel:
          templateLabels[
            (row.template_id ?? 'website') as ContratoPayload['templateId']
          ] ?? 'Contrato',
        signatureCity: row.cidade_assinatura ?? '',
        updatedAt: row.atualizado_em ?? row.criado_em ?? '',
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao carregar contratos') },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
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
      .insert({
        user_id: user.id,
        ...buildDbPayload(parsed.data.contrato),
      })
      .select('id, atualizado_em, criado_em')
      .single();

    if (error) {
      return NextResponse.json(
        { error: formatSupabaseError(error, 'Erro ao salvar contrato') },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      updatedAt: data.atualizado_em ?? data.criado_em ?? '',
    });
  } catch (error) {
    return NextResponse.json(
      { error: formatSupabaseError(error, 'Erro ao salvar contrato') },
      { status: 500 },
    );
  }
}
