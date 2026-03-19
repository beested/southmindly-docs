import { NextResponse } from 'next/server';

import {
  alinhamentoPayloadSchema,
  type AlinhamentoReuniao,
} from '@/lib/schemas/alinhamento-reuniao';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function parseDateBRToISO(value: string) {
  const normalized = (value ?? '').trim();
  if (!normalized) return null;
  const [dd, mm, yyyy] = normalized.split('/');
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return null;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function formatISOToBR(value: string | null) {
  const normalized = (value ?? '').trim();
  if (!normalized) return '';
  const [yyyy, mm, dd] = normalized.split('-');
  if (!yyyy || !mm || !dd) return '';
  return `${dd.padStart(2, '0')}/${mm.padStart(2, '0')}/${yyyy}`;
}

function buildDbPayload(alinhamento: AlinhamentoReuniao) {
  const servicoPrincipal =
    alinhamento.servicos.find((service) => service.nome.trim())?.nome.trim() ||
    null;

  return {
    titulo: servicoPrincipal
      ? `Alinhamento - ${servicoPrincipal}`
      : 'Alinhamento de Reunião',
    cliente_id: alinhamento.clienteId || null,
    servico_principal: servicoPrincipal,
    participantes: alinhamento.participantes,
    data_reuniao: parseDateBRToISO(alinhamento.dataReuniao),
    hora_reuniao: alinhamento.horaReuniao || null,
    local_reuniao: alinhamento.localReuniao || null,
    objetivos_reuniao: alinhamento.objetivosReuniao || null,
    assuntos_tratados: alinhamento.assuntosTratados || null,
    servicos: alinhamento.servicos,
    dia_entrega_aprovacao: alinhamento.diaEntregaAprovacao || null,
    prazo_maximo_aprovacao: alinhamento.prazoMaximoAprovacao || null,
    dia_horario_postagem: alinhamento.diaHorarioPostagem || null,
    atividades_incluidas: alinhamento.atividadesIncluidas || null,
    forma_pagamento: alinhamento.formaPagamento || null,
    prazo_contrato: alinhamento.prazoContrato || null,
    emissao_nota_fiscal: alinhamento.emissaoNotaFiscal || null,
    data_inicio_contrato: parseDateBRToISO(alinhamento.dataInicioContrato),
    consideracoes_proposta: alinhamento.consideracoesProposta || null,
    indicadores_relatorio: alinhamento.indicadoresRelatorio || null,
    observacoes: alinhamento.observacoes || null,
  };
}

type AlinhamentoRow = {
  id: string;
  titulo: string | null;
  servico_principal: string | null;
  cliente_id: string | null;
  participantes: unknown[] | null;
  data_reuniao: string | null;
  hora_reuniao: string | null;
  local_reuniao: string | null;
  objetivos_reuniao: string | null;
  assuntos_tratados: string | null;
  servicos: unknown[] | null;
  dia_entrega_aprovacao: string | null;
  prazo_maximo_aprovacao: string | null;
  dia_horario_postagem: string | null;
  atividades_incluidas: string | null;
  forma_pagamento: string | null;
  prazo_contrato: string | null;
  emissao_nota_fiscal: string | null;
  data_inicio_contrato: string | null;
  consideracoes_proposta: string | null;
  indicadores_relatorio: string | null;
  observacoes: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
};

function mapRowToResponse(row: AlinhamentoRow) {
  return {
    id: row.id,
    alinhamento: {
      participantes: Array.isArray(row.participantes) ? row.participantes : [],
      clienteId: row.cliente_id ?? '',
      dataReuniao: formatISOToBR(row.data_reuniao),
      horaReuniao: row.hora_reuniao ?? '',
      localReuniao: row.local_reuniao ?? '',
      objetivosReuniao: row.objetivos_reuniao ?? '',
      assuntosTratados: row.assuntos_tratados ?? '',
      servicos: Array.isArray(row.servicos) ? row.servicos : [],
      diaEntregaAprovacao: row.dia_entrega_aprovacao ?? '',
      prazoMaximoAprovacao: row.prazo_maximo_aprovacao ?? '',
      diaHorarioPostagem: row.dia_horario_postagem ?? '',
      atividadesIncluidas: row.atividades_incluidas ?? '',
      formaPagamento: row.forma_pagamento ?? '',
      prazoContrato: row.prazo_contrato ?? '',
      emissaoNotaFiscal: row.emissao_nota_fiscal ?? '',
      dataInicioContrato: formatISOToBR(row.data_inicio_contrato),
      consideracoesProposta: row.consideracoes_proposta ?? '',
      indicadoresRelatorio: row.indicadores_relatorio ?? '',
      observacoes: row.observacoes ?? '',
    },
    titulo: row.titulo ?? '',
    servicoPrincipal: row.servico_principal ?? '',
    createdAt: row.criado_em ?? '',
    updatedAt: row.atualizado_em ?? '',
  };
}

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('alinhamentos_reuniao')
    .select('id, titulo, servico_principal, cliente_id, data_reuniao, criado_em, atualizado_em')
    .order('atualizado_em', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: (data ?? []).map((row) => ({
      id: row.id,
      titulo: row.titulo ?? '',
      servicoPrincipal: row.servico_principal ?? '',
      clienteId: row.cliente_id ?? '',
      dataReuniao: formatISOToBR(row.data_reuniao),
      createdAt: row.criado_em ?? '',
      updatedAt: row.atualizado_em ?? '',
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
  const parsed = alinhamentoPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('alinhamentos_reuniao')
    .insert({
      user_id: user.id,
      ...buildDbPayload(parsed.data.alinhamento),
    })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapRowToResponse(data as AlinhamentoRow));
}
