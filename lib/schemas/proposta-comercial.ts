import { z } from 'zod';

const propostaStatusValues = [
  'rascunho',
  'enviada',
  'em_negociacao',
  'aceita',
  'recusada',
  'cancelada',
] as const;

type PropostaStatus = (typeof propostaStatusValues)[number];

function isValidLocalizedNumber(value: string) {
  const normalized = value.trim().replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
  if (!normalized) return true;

  const num = Number(normalized);
  return Number.isFinite(num);
}

function isValidNonNegativeInteger(value: string) {
  const normalized = value.trim();
  if (!normalized) return true;

  const num = Number(normalized);
  return Number.isInteger(num) && num >= 0;
}

function isValidDateBR(value: string) {
  const normalized = value.trim();
  if (!normalized) return true;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) return false;

  const [dayStr, monthStr, yearStr] = normalized.split('/');
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

const textFieldSchema = z.string().optional().default('').transform((value) => value.trim());

const dateFieldSchema = z
  .string()
  .optional()
  .default('')
  .transform((value) => value.trim())
  .refine(isValidDateBR, 'Use o formato dd/mm/aaaa');

const numberFieldSchema = z
  .string()
  .optional()
  .default('')
  .transform((value) => value.trim())
  .refine(isValidLocalizedNumber, 'Informe um numero valido');

const integerFieldSchema = z
  .string()
  .optional()
  .default('')
  .transform((value) => value.trim())
  .refine(isValidNonNegativeInteger, 'Informe um numero inteiro valido');

export const propostaStatusSchema = z.enum(propostaStatusValues);

export const propostaEscopoSchema = z.object({
  escopoId: z.string().min(1, 'Selecione um escopo valido'),
  nome: z.string().optional().default('').transform((value) => value.trim()).refine(Boolean, 'Nome do escopo obrigatorio'),
  descricao: textFieldSchema,
  tipoCobranca: textFieldSchema,
  unidadeLabel: textFieldSchema,
  periodicidade: textFieldSchema,
  valorNegociado: numberFieldSchema,
  observacao: textFieldSchema,
  ordem: z.number().int().min(0).optional().default(0),
});

export const propostaComercialBaseSchema = z.object({
  numeroProposta: integerFieldSchema,
  revisao: integerFieldSchema,
  status: propostaStatusSchema.optional().default('rascunho'),
  cidade: textFieldSchema,
  dataProposta: dateFieldSchema,
  prazoContratoMeses: integerFieldSchema,
  dataAceite: dateFieldSchema,
  valorTotalMensal: numberFieldSchema,
  observacoes: textFieldSchema,
  clienteId: textFieldSchema,
  assessorId: textFieldSchema,
  nomeResponsavelAssinatura: textFieldSchema,
  escopos: z.array(propostaEscopoSchema).optional().default([]),
});

export const propostaComercialSchema = propostaComercialBaseSchema
  .superRefine((data, ctx) => {
    if (data.dataAceite && !data.nomeResponsavelAssinatura) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['nomeResponsavelAssinatura'],
        message: 'Informe o responsavel quando houver data de aceite',
      });
    }
  });

export const propostaPayloadSchema = z.object({
  proposta: propostaComercialSchema,
});

export type PropostaEscopo = z.infer<typeof propostaEscopoSchema>;
export type PropostaComercial = z.infer<typeof propostaComercialBaseSchema>;

export const defaultPropostaComercialData: PropostaComercial =
  propostaComercialBaseSchema.parse({});

export function normalizePropostaStatus(value: unknown): PropostaStatus {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');

  switch (normalized) {
    case 'rascunho':
    case 'enviada':
    case 'em_negociacao':
    case 'aceita':
    case 'recusada':
    case 'cancelada':
      return normalized;
    default:
      return 'rascunho';
  }
}

export function normalizeLoadedProposta(raw: unknown): PropostaComercial {
  const proposta =
    raw && typeof raw === 'object'
      ? (raw as Partial<PropostaComercial> & { escopos?: unknown[] })
      : {};

  return propostaComercialBaseSchema.parse({
    ...defaultPropostaComercialData,
    ...proposta,
    status: normalizePropostaStatus(proposta.status),
    escopos: Array.isArray(proposta.escopos)
      ? proposta.escopos.map((escopo, index) => {
          const item =
            escopo && typeof escopo === 'object'
              ? (escopo as Partial<PropostaEscopo>)
              : {};

          return {
            escopoId: String(item.escopoId ?? '').trim(),
            nome: String(item.nome ?? 'Escopo').trim() || 'Escopo',
            descricao: String(item.descricao ?? '').trim(),
            tipoCobranca: String(item.tipoCobranca ?? '').trim(),
            unidadeLabel: String(item.unidadeLabel ?? '').trim(),
            periodicidade: String(item.periodicidade ?? '').trim(),
            valorNegociado: String(item.valorNegociado ?? '').trim(),
            observacao: String(item.observacao ?? '').trim(),
            ordem:
              typeof item.ordem === 'number' && Number.isFinite(item.ordem)
                ? item.ordem
                : index,
          };
        })
      : [],
  });
}

export function getFirstZodErrorMessage(error: z.ZodError) {
  const issue = error.issues[0];
  return issue?.message ?? 'Dados invalidos';
}
