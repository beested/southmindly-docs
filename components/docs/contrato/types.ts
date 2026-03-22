'use client';

export type ContractTemplateId = 'website' | 'marketing-digital';

export type ContratoData = {
  templateId: ContractTemplateId;
  clienteId: string;
  contractTitle: string;
  projectTitle: string;
  proposalReference: string;
  contratanteNome: string;
  contratanteCnpj: string;
  contratanteEndereco: string;
  contratadaNome: string;
  contratadaCnpj: string;
  contratadaEndereco: string;
  objectText: string;
  objectAnnexClause: string;
  objectStartClause: string;
  dataInicioExecucao: string;
  paymentSummary: string;
  paymentInstallmentClause: string;
  paymentRenewalClause: string;
  paymentDefaultClause: string;
  paymentLateFeeClause: string;
  rescisaoText: string;
  revisionDeliveryClause: string;
  generalRightsClause: string;
  generalDelegationClause: string;
  generalClosingClause: string;
  cidadeAssinatura: string;
  scopeHome: string;
  scopeSobreNos: string;
  scopeCorpoClinico: string;
  scopeExames: string;
  scopeFaq: string;
  scopeNovidades: string;
  scopeContato: string;
  scopeProvaSocial: string;
  scopeMobile: string;
  prazoTotal: string;
  cronogramaPlanejamento: string;
  cronogramaDesign: string;
  cronogramaDesenvolvimento: string;
  cronogramaTestes: string;
  prazoCondicoes: string;
  investimentoValor: string;
  investimentoValorExtenso: string;
  formasPagamento: string;
  manutencaoValorHora: string;
  responsabilidadesContratante: string;
  responsabilidadesContratada: string;
  alteracoesServicosAdicionais: string;
  cancelamento: string;
  entregaProjeto: string;
  direitosUsoPortfolio: string;
  disposicoesGerais: string;
  assinaturaContratanteLabel: string;
  assinaturaContratadaLabel: string;
  dataAssinatura: string;
};

export interface ContratoProps {
  onBack: () => void;
}

export type ContractListItem = {
  id: string;
  title: string;
  clientName: string;
  subtitle: string;
  templateId: ContractTemplateId;
  templateLabel: string;
  signatureCity: string;
  updatedAt: string;
  clienteId: string;
};

export type ContractResponse = {
  id: string;
  contrato: ContratoData;
  updatedAt: string;
} | null;

export type ScopeSectionDef = {
  key:
    | 'scopeHome'
    | 'scopeSobreNos'
    | 'scopeCorpoClinico'
    | 'scopeExames'
    | 'scopeFaq'
    | 'scopeNovidades'
    | 'scopeContato'
    | 'scopeProvaSocial'
    | 'scopeMobile';
  number: string;
  title: string;
};

export type ClienteItem = {
  id: string;
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  endereco: string;
  nomeContato: string;
  cargoContato: string;
  emailContato: string;
  telefoneContato: string;
  logoUrl: string;
};
