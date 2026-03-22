import { z } from 'zod';

const contractTemplateValues = ['website', 'marketing-digital'] as const;

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

const textFieldSchema = z
  .string()
  .optional()
  .default('')
  .transform((value) => value.trim());

const dateFieldSchema = z
  .string()
  .optional()
  .default('')
  .transform((value) => value.trim())
  .refine(isValidDateBR, 'Use o formato dd/mm/aaaa');

export const contratoTemplateSchema = z.enum(contractTemplateValues);

export const contratoSchema = z.object({
  templateId: contratoTemplateSchema,
  clienteId: textFieldSchema,
  contractTitle: textFieldSchema,
  projectTitle: textFieldSchema,
  proposalReference: textFieldSchema,
  contratanteNome: textFieldSchema,
  contratanteCnpj: textFieldSchema,
  contratanteEndereco: textFieldSchema,
  contratadaNome: textFieldSchema,
  contratadaCnpj: textFieldSchema,
  contratadaEndereco: textFieldSchema,
  objectText: textFieldSchema,
  objectAnnexClause: textFieldSchema,
  objectStartClause: textFieldSchema,
  dataInicioExecucao: dateFieldSchema,
  paymentSummary: textFieldSchema,
  paymentInstallmentClause: textFieldSchema,
  paymentRenewalClause: textFieldSchema,
  paymentDefaultClause: textFieldSchema,
  paymentLateFeeClause: textFieldSchema,
  rescisaoText: textFieldSchema,
  revisionDeliveryClause: textFieldSchema,
  generalRightsClause: textFieldSchema,
  generalDelegationClause: textFieldSchema,
  generalClosingClause: textFieldSchema,
  cidadeAssinatura: textFieldSchema,
  scopeHome: textFieldSchema,
  scopeSobreNos: textFieldSchema,
  scopeCorpoClinico: textFieldSchema,
  scopeExames: textFieldSchema,
  scopeFaq: textFieldSchema,
  scopeNovidades: textFieldSchema,
  scopeContato: textFieldSchema,
  scopeProvaSocial: textFieldSchema,
  scopeMobile: textFieldSchema,
  prazoTotal: textFieldSchema,
  cronogramaPlanejamento: textFieldSchema,
  cronogramaDesign: textFieldSchema,
  cronogramaDesenvolvimento: textFieldSchema,
  cronogramaTestes: textFieldSchema,
  prazoCondicoes: textFieldSchema,
  investimentoValor: textFieldSchema,
  investimentoValorExtenso: textFieldSchema,
  formasPagamento: textFieldSchema,
  manutencaoValorHora: textFieldSchema,
  responsabilidadesContratante: textFieldSchema,
  responsabilidadesContratada: textFieldSchema,
  alteracoesServicosAdicionais: textFieldSchema,
  cancelamento: textFieldSchema,
  entregaProjeto: textFieldSchema,
  direitosUsoPortfolio: textFieldSchema,
  disposicoesGerais: textFieldSchema,
  assinaturaContratanteLabel: textFieldSchema,
  assinaturaContratadaLabel: textFieldSchema,
  dataAssinatura: dateFieldSchema,
});

export const contratoPayloadSchema = z.object({
  contrato: contratoSchema,
});

export type ContratoPayload = z.infer<typeof contratoSchema>;
