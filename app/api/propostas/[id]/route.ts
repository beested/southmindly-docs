import { z } from 'zod';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

const propostaEscopoSchema = z.object({
  escopoId: z.string().min(1),
  periodicidade: z.string().optional().default(''),
  valorNegociado: z.string().optional().default(''),
  observacao: z.string().optional().default(''),
  ordem: z.number().int().optional().default(0),
});

const propostaSchema = z.object({
  numeroProposta: z.string().optional().default(''),
  revisao: z.string().optional().default(''),
  status: z.string().optional().default(''),
  cidade: z.string().optional().default(''),
  dataProposta: z.string().optional().default(''),
  prazoContratoMeses: z.string().optional().default(''),
  dataAceite: z.string().optional().default(''),
  valorTotalMensal: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),

  clienteId: z.string().optional().default(''),
  assessorId: z.string().optional().default(''),

  nomeResponsavelAssinatura: z.string().optional().default(''),

  escopos: z.array(propostaEscopoSchema).optional().default([]),
});

const payloadSchema = z.object({
  proposta: propostaSchema,
});

function formatISOToBR(value: string | null) {
  const v = (value ?? '').trim();
  if (!v) return '';
  const [yyyy, mm, dd] = v.split('-');
  if (!yyyy || !mm || !dd) return '';
  return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
}

function parseNumber(value: string) {
  const normalized = (value ?? '')
    .trim()
    .replace(/\./g, '')
    .replace(',', '.');
  if (!normalized) return null;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function parseDateBRToISO(value: string) {
  const v = (value ?? '').trim();
  if (!v) return null;
  const [dd, mm, yyyy] = v.split('/');
  if (!dd || !mm || !yyyy) return null;
  if (yyyy.length !== 4) return null;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function buildPropostaDbPayload(p: z.infer<typeof propostaSchema>) {
  const allowedStatuses = new Set([
    'rascunho',
    'enviada',
    'em_negociacao',
    'aceita',
    'recusada',
    'cancelada',
  ]);

  const status = allowedStatuses.has(p.status) ? p.status : null;

  const payload: Record<string, unknown> = {
    numero_proposta: parseNumber(p.numeroProposta),
    revisao: parseNumber(p.revisao),
    cidade: p.cidade || null,
    status,

    cliente_id: p.clienteId || null,
    assessor_id: p.assessorId || null,

    data_proposta: parseDateBRToISO(p.dataProposta),
    prazo_contrato_meses: parseNumber(p.prazoContratoMeses),
    data_aceite: parseDateBRToISO(p.dataAceite),
    valor_total_mensal: parseNumber(p.valorTotalMensal),
    observacoes: p.observacoes || null,

    nome_responsavel_assinatura: p.nomeResponsavelAssinatura || null,
  };

  Object.keys(payload).forEach((k) => {
    if (payload[k] === null) delete payload[k];
  });

  return payload;
}

function stripUnknownColumnsFromPayload(
  payload: Record<string, unknown>,
  errorMessage: string,
) {
  const candidates = ['nome_responsavel_assinatura'];

  let changed = false;
  for (const key of candidates) {
    if (key in payload && errorMessage.includes(key)) {
      delete payload[key];
      changed = true;
    }
  }

  return changed;
}

function stripInvalidByConstraint(
  payload: Record<string, unknown>,
  errorMessage: string,
) {
  let changed = false;

  if (
    'status' in payload &&
    (errorMessage.includes('propostas_status_check') ||
      errorMessage.toLowerCase().includes('status_check'))
  ) {
    delete payload.status;
    changed = true;
  }

  return changed;
}

function buildEscoposDbRows(
  propostaId: string,
  escopos: z.infer<typeof propostaEscopoSchema>[],
) {
  return escopos.map((e, index) => {
    const row: Record<string, unknown> = {
      proposta_id: propostaId,
      escopo_id: e.escopoId,
      periodicidade: e.periodicidade || null,
      valor_negociado: parseNumber(e.valorNegociado),
      observacao: e.observacao || null,
      ordem: Number.isFinite(e.ordem) ? e.ordem : index,
    };
    Object.keys(row).forEach((k) => {
      if (row[k] === null) delete row[k];
    });
    return row;
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const baseSelect =
    'id, numero_proposta, revisao, cidade, status, cliente_id, assessor_id, data_proposta, observacoes, prazo_contrato_meses, data_aceite, valor_total_mensal';
  const optionalCols = [
    'nome_responsavel_assinatura',
    'atualizado_em',
    'criado_em',
    'updated_at',
    'created_at',
  ];

  const runSelect = async (select: string) =>
    supabase.from('propostas').select(select).eq('id', id).single();

  let select = `${baseSelect}, ${optionalCols.join(', ')}`;
  let { data: row, error } = await runSelect(select);

  if (error) {
    for (const col of optionalCols) {
      if (error.message.includes(col)) {
        select = select
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== col)
          .join(', ');
        ({ data: row, error } = await runSelect(select));
      }
      if (!error) break;
    }
  }

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }

  type PropostaDbRow = {
    id: string;
    numero_proposta: number | null;
    revisao: number | null;
    status: string | null;
    cidade: string | null;
    data_proposta: string | null;
    prazo_contrato_meses: number | null;
    data_aceite: string | null;
    valor_total_mensal: number | null;
    observacoes: string | null;
    cliente_id: string | null;
    assessor_id: string | null;
    nome_responsavel_assinatura?: string | null;
    atualizado_em?: string | null;
    criado_em?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  };

  const propostaRow = row as unknown as PropostaDbRow;

  const escoposRes = await supabase
    .from('proposta_escopos')
    .select('escopo_id, periodicidade, valor_negociado, observacao, ordem')
    .eq('proposta_id', id)
    .order('ordem', { ascending: true });

  if (escoposRes.error) {
    return NextResponse.json({ error: escoposRes.error.message }, { status: 500 });
  }

  type PropostaEscopoRow = {
    escopo_id: string;
    periodicidade: string | null;
    valor_negociado: number | null;
    observacao: string | null;
    ordem: number | null;
  };

  const escopoRows = (escoposRes.data ?? []) as PropostaEscopoRow[];
  const escopoIds = Array.from(new Set(escopoRows.map((r) => r.escopo_id)));

  type CatalogRow = {
    id: string;
    nome: string | null;
    descricao: string | null;
    tipo_cobranca: string | null;
    unidade_label: string | null;
  };

  const catalogById = new Map<string, CatalogRow>();
  if (escopoIds.length > 0) {
    const catRes = await supabase
      .from('escopos_catalogo')
      .select('id, nome, descricao, tipo_cobranca, unidade_label')
      .in('id', escopoIds);

    if (catRes.error) {
      return NextResponse.json({ error: catRes.error.message }, { status: 500 });
    }

    (catRes.data ?? []).forEach((r) => catalogById.set((r as CatalogRow).id, r as CatalogRow));
  }

  return NextResponse.json({
    id: propostaRow.id,
    proposta: {
      numeroProposta:
        propostaRow.numero_proposta === null ? '' : String(propostaRow.numero_proposta),
      revisao: propostaRow.revisao === null ? '' : String(propostaRow.revisao),
      status: propostaRow.status ?? '',
      cidade: propostaRow.cidade ?? '',
      dataProposta: formatISOToBR(propostaRow.data_proposta),
      prazoContratoMeses:
        propostaRow.prazo_contrato_meses === null
          ? ''
          : String(propostaRow.prazo_contrato_meses),
      dataAceite: formatISOToBR(propostaRow.data_aceite),
      valorTotalMensal:
        propostaRow.valor_total_mensal === null
          ? ''
          : String(propostaRow.valor_total_mensal),
      observacoes: propostaRow.observacoes ?? '',
      clienteId: propostaRow.cliente_id ?? '',
      assessorId: propostaRow.assessor_id ?? '',
      nomeResponsavelAssinatura: propostaRow.nome_responsavel_assinatura ?? '',
      escopos: escopoRows.map((r, idx) => {
        const cat = catalogById.get(r.escopo_id);
        return {
          escopoId: r.escopo_id,
          nome: cat?.nome ?? 'Escopo',
          descricao: cat?.descricao ?? '',
          tipoCobranca: cat?.tipo_cobranca ?? '',
          unidadeLabel: cat?.unidade_label ?? '',
          periodicidade: r.periodicidade ?? '',
          valorNegociado:
            r.valor_negociado === null || r.valor_negociado === undefined
              ? ''
              : String(r.valor_negociado),
          observacao: r.observacao ?? '',
          ordem: r.ordem ?? idx,
        };
      }),
    },
    updatedAt:
      ((propostaRow.atualizado_em ??
        propostaRow.updated_at ??
        propostaRow.criado_em ??
        propostaRow.created_at ??
        '') as string) ?? '',
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { proposta } = parsed.data;
  const propostaPayload = buildPropostaDbPayload(proposta);

  let updated = await supabase
    .from('propostas')
    .update(propostaPayload)
    .eq('id', id)
    .select('id, numero_proposta, revisao, status, atualizado_em, criado_em')
    .single();

  if (
    updated.error &&
    (stripUnknownColumnsFromPayload(propostaPayload, updated.error.message) ||
      stripInvalidByConstraint(propostaPayload, updated.error.message))
  ) {
    updated = await supabase
      .from('propostas')
      .update(propostaPayload)
      .eq('id', id)
      .select('id, numero_proposta, revisao, status, atualizado_em, criado_em')
      .single();
  }

  if (updated.error) {
    return NextResponse.json({ error: updated.error.message }, { status: 500 });
  }

  const deleteOld = await supabase
    .from('proposta_escopos')
    .delete()
    .eq('proposta_id', id);

  if (deleteOld.error) {
    return NextResponse.json({ error: deleteOld.error.message }, { status: 500 });
  }

  if (proposta.escopos.length > 0) {
    const escoposRows = buildEscoposDbRows(id, proposta.escopos);
    const insertedEscopos = await supabase
      .from('proposta_escopos')
      .insert(escoposRows);

    if (insertedEscopos.error) {
      return NextResponse.json(
        { error: insertedEscopos.error.message },
        { status: 500 },
      );
    }
  }

  type UpdatedRow = {
    id: string;
    numero_proposta?: number | null;
    revisao?: number | null;
    status?: string | null;
    atualizado_em?: string | null;
    criado_em?: string | null;
  };

  const out = updated.data as UpdatedRow;

  return NextResponse.json({
    id: out.id,
    numeroProposta: (out.numero_proposta ?? null) as number | null,
    revisao: (out.revisao ?? null) as number | null,
    status: (out.status ?? '') as string,
    updatedAt: ((out.atualizado_em ?? out.criado_em ?? '') as string) ?? '',
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const deletedScopes = await supabase
    .from('proposta_escopos')
    .delete()
    .eq('proposta_id', id);

  if (deletedScopes.error) {
    return NextResponse.json({ error: deletedScopes.error.message }, { status: 500 });
  }

  const deleted = await supabase.from('propostas').delete().eq('id', id);

  if (deleted.error) {
    return NextResponse.json({ error: deleted.error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
