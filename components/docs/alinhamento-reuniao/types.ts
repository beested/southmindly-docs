'use client';

export type ReuniaoParticipante = {
  id: string;
  nome: string;
};

export type ReuniaoServico = {
  id: string;
  catalogoId: string;
  nome: string;
  descricao: string;
  detalhamento: string;
  valor: string;
};

export type AlinhamentoReuniaoData = {
  clienteId: string;
  participantes: ReuniaoParticipante[];
  dataReuniao: string;
  horaReuniao: string;
  localReuniao: string;
  objetivosReuniao: string;
  assuntosTratados: string;
  servicos: ReuniaoServico[];
  diaEntregaAprovacao: string;
  prazoMaximoAprovacao: string;
  diaHorarioPostagem: string;
  atividadesIncluidas: string;
  formaPagamento: string;
  prazoContrato: string;
  emissaoNotaFiscal: string;
  dataInicioContrato: string;
  consideracoesProposta: string;
  indicadoresRelatorio: string;
  observacoes: string;
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

export type ServicoCatalogoItem = {
  id: string;
  nome: string;
  descricao: string;
  tipoCobranca: string;
  valorPadrao: number | null;
  unidadeLabel: string;
  ordem: number;
};

export interface AlinhamentoReuniaoProps {
  onBack: () => void;
}
