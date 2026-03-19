import { DocMenuItem, DocType } from '@/types/docs';
import {
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  Scale,
  ScrollText,
  Users,
} from 'lucide-react';

export type DocDefinition = DocMenuItem & {
  hasSavedList: boolean;
};

const SOUTHMINDLY_PURPLE = '#7C3AED';

export const DOC_DEFINITIONS: DocDefinition[] = [
  {
    id: 'alinhamento-reuniao',
    label: 'Alinhamento de Reunião',
    description: 'Organize serviços, cronograma e condições comerciais',
    icon: ClipboardList,
    available: true,
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
  {
    id: 'pauta-reuniao',
    label: 'Pauta de Reunião',
    description: 'Estruture pontos, responsáveis e horários',
    icon: ClipboardList,
    available: false,
    badge: 'Em breve',
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
  {
    id: 'ata-reuniao',
    label: 'Ata de Reunião',
    description: 'Registre decisões e encaminhamentos',
    icon: FileText,
    available: false,
    badge: 'Em breve',
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
  {
    id: 'proposta-comercial',
    label: 'Proposta Comercial',
    description: 'Crie propostas profissionais para clientes',
    icon: BriefcaseBusiness,
    available: true,
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: true,
  },
  {
    id: 'clausula-contratual',
    label: 'Cláusula Contratual',
    description: 'Gere cláusulas padronizadas',
    icon: Scale,
    available: false,
    badge: 'Em breve',
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
  {
    id: 'contrato',
    label: 'Contrato',
    description: 'Monte contratos completos com variáveis',
    icon: ScrollText,
    available: true,
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
];

export const PEOPLE_DEFINITIONS: DocDefinition[] = [
  {
    id: 'clientes',
    label: 'Clientes',
    description: 'Cadastre e gerencie seus clientes',
    icon: Users,
    available: true,
    color: SOUTHMINDLY_PURPLE,
    hasSavedList: false,
  },
];

export function getDocDefinition(id: DocType) {
  return (
    DOC_DEFINITIONS.find((d) => d.id === id) ??
    PEOPLE_DEFINITIONS.find((d) => d.id === id)
  );
}
