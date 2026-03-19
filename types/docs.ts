import type { LucideIcon } from 'lucide-react';

import type {
  PropostaComercial,
  PropostaEscopo,
} from '@/lib/schemas/proposta-comercial';

export type DocType =
  | 'alinhamento-reuniao'
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

export type PropostaEscopoData = PropostaEscopo;

export type PropostaComercialData = PropostaComercial;
