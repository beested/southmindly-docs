import { z } from 'zod';

export const alinhamentoParticipanteSchema = z.object({
  id: z.string().optional().default(''),
  nome: z.string().optional().default(''),
});

export const alinhamentoServicoSchema = z.object({
  id: z.string().optional().default(''),
  catalogoId: z.string().optional().default(''),
  nome: z.string().optional().default(''),
  descricao: z.string().optional().default(''),
  detalhamento: z.string().optional().default(''),
  valor: z.string().optional().default(''),
});

export const alinhamentoReuniaoSchema = z.object({
  clienteId: z.string().optional().default(''),
  participantes: z.array(alinhamentoParticipanteSchema).default([]),
  dataReuniao: z.string().optional().default(''),
  horaReuniao: z.string().optional().default(''),
  localReuniao: z.string().optional().default(''),
  objetivosReuniao: z.string().optional().default(''),
  assuntosTratados: z.string().optional().default(''),
  servicos: z.array(alinhamentoServicoSchema).default([]),
  diaEntregaAprovacao: z.string().optional().default(''),
  prazoMaximoAprovacao: z.string().optional().default(''),
  diaHorarioPostagem: z.string().optional().default(''),
  atividadesIncluidas: z.string().optional().default(''),
  formaPagamento: z.string().optional().default(''),
  prazoContrato: z.string().optional().default(''),
  emissaoNotaFiscal: z.string().optional().default(''),
  dataInicioContrato: z.string().optional().default(''),
  consideracoesProposta: z.string().optional().default(''),
  indicadoresRelatorio: z.string().optional().default(''),
  observacoes: z.string().optional().default(''),
});

export const alinhamentoPayloadSchema = z.object({
  alinhamento: alinhamentoReuniaoSchema,
});

export type AlinhamentoReuniao = z.infer<typeof alinhamentoReuniaoSchema>;
