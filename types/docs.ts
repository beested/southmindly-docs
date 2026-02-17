export type DocType =
  | 'pauta-reuniao'
  | 'ata-reuniao'
  | 'proposta-comercial'
  | 'clausula-contratual'
  | 'contrato';

export interface DocMenuItem {
  id: DocType;
  label: string;
  description: string;
  icon: string;
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
