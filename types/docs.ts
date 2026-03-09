import type { LucideIcon } from 'lucide-react';

export type DocType =
  | 'pauta-reuniao'
  | 'ata-reuniao'
  | 'proposta-comercial'
  | 'clientes'
  | 'clausula-contratual'
  | 'contrato';

export interface DocMenuItem {
  id: DocType;
  label: string;
  description: string;
  icon: LucideIcon;
  available: boolean;
  badge?: string;
  color: string;
}

export interface AgendaItem {
  id: string;
  titulo: string;
  responsavel: string;
  duracao: string;
  topicos?: string[];
}

export interface PautaData {
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes: string;
  objetivo: string;
  observacoes: string;
  itens: AgendaItem[];
}

export interface PropostaEscopoData {
  escopoId: string;
  nome: string;
  descricao?: string;
  tipoCobranca?: string;
  unidadeLabel?: string;
  periodicidade: string;
  valorNegociado: string;
  observacao: string;
  ordem: number;
}

export interface PropostaComercialData {
  numeroProposta: string;
  revisao: string;
  status: string;
  cidade: string;
  dataProposta: string;
  prazoContratoMeses: string;
  dataAceite: string;
  valorTotalMensal: string;
  observacoes: string;

  clienteId: string;
  assessorId: string;

  nomeResponsavelAssinatura: string;

  escopos: PropostaEscopoData[];
}
