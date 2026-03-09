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

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const baseSelect =
    'id, numero_proposta, revisao, status, cidade, data_proposta, cliente_id, assessor_id';

  type PropostaRow = {
    id: string;
    numero_proposta: number | null;
    revisao: number | null;
    status: string | null;
    cidade: string | null;
    data_proposta: string | null;
    cliente_id?: string | null;
    assessor_id?: string | null;
    atualizado_em?: string | null;
    criado_em?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  };

  const tryFetch = async (select: string, orderColumn?: string) => {
    let q = supabase.from('propostas').select(select);
    if (orderColumn) {
      q = q.order(orderColumn, { ascending: false });
    }
    return q;
  };

  let data: PropostaRow[] | null = null;
  let error: { message: string } | null = null;

  const attempt1 = await tryFetch(
    `${baseSelect}, atualizado_em, criado_em`,
    'atualizado_em',
  );
  data = (attempt1.data ?? null) as PropostaRow[] | null;
  error = (attempt1.error ?? null) as { message: string } | null;

  if (error && error.message.includes('atualizado_em')) {
    const attempt2 = await tryFetch(
      `${baseSelect}, updated_at, created_at`,
      'updated_at',
    );
    data = (attempt2.data ?? null) as PropostaRow[] | null;
    error = (attempt2.error ?? null) as { message: string } | null;
  }

  if (
    error &&
    (error.message.includes('created_at') || error.message.includes('criado_em'))
  ) {
    const attempt3 = await tryFetch(baseSelect);
    data = (attempt3.data ?? null) as PropostaRow[] | null;
    error = (attempt3.error ?? null) as { message: string } | null;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: ((data ?? []) as PropostaRow[]).map((row) => ({
      id: row.id,
      numeroProposta: row.numero_proposta ?? null,
      revisao: row.revisao ?? null,
      status: row.status ?? '',
      cidade: row.cidade ?? '',
      dataProposta: row.data_proposta ?? '',
      updatedAt: (row.atualizado_em ??
        row.updated_at ??
        row.criado_em ??
        row.created_at ??
        '') as string,
      clienteId: row.cliente_id ?? '',
      assessorId: row.assessor_id ?? '',
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

  const { proposta } = parsed.data;
  const propostaPayload = buildPropostaDbPayload(proposta);

  let inserted = await supabase
    .from('propostas')
    .insert(propostaPayload)
    .select('id, numero_proposta, revisao, status, atualizado_em, criado_em')
    .single();

  if (
    inserted.error &&
    (stripUnknownColumnsFromPayload(propostaPayload, inserted.error.message) ||
      stripInvalidByConstraint(propostaPayload, inserted.error.message))
  ) {
    inserted = await supabase
      .from('propostas')
      .insert(propostaPayload)
      .select('id, numero_proposta, revisao, status, atualizado_em, criado_em')
      .single();
  }

  if (inserted.error) {
    return NextResponse.json({ error: inserted.error.message }, { status: 500 });
  }

  type InsertedRow = {
    id: string;
    numero_proposta?: number | null;
    revisao?: number | null;
    status?: string | null;
    atualizado_em?: string | null;
    criado_em?: string | null;
  };

  const row = inserted.data as InsertedRow;

  if (proposta.escopos.length > 0) {
    const escoposRows = buildEscoposDbRows(row.id, proposta.escopos);
    const insertedEscopos = await supabase
      .from('proposta_escopos')
      .insert(escoposRows);

    if (insertedEscopos.error) {
      await supabase.from('propostas').delete().eq('id', row.id);
      return NextResponse.json(
        { error: insertedEscopos.error.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    id: row.id,
    numeroProposta: (row.numero_proposta ?? null) as number | null,
    revisao: (row.revisao ?? null) as number | null,
    status: (row.status ?? '') as string,
    updatedAt: ((row.atualizado_em ?? row.criado_em ?? '') as string) ?? '',
  });
}
