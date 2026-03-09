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

export const DOC_DEFINITIONS: DocDefinition[] = [
  {
    id: 'pauta-reuniao',
    label: 'Pauta de Reunião',
    description: 'Estruture pontos, responsáveis e horários',
    icon: ClipboardList,
    available: true,
    color: '#4F7EFF',
    hasSavedList: true,
  },
  {
    id: 'ata-reuniao',
    label: 'Ata de Reunião',
    description: 'Registre decisões e encaminhamentos',
    icon: FileText,
    available: false,
    badge: 'Em breve',
    color: '#A78BFA',
    hasSavedList: false,
  },
  {
    id: 'proposta-comercial',
    label: 'Proposta Comercial',
    description: 'Crie propostas profissionais para clientes',
    icon: BriefcaseBusiness,
    available: true,
    color: '#34D399',
    hasSavedList: true,
  },
  {
    id: 'clausula-contratual',
    label: 'Cláusula Contratual',
    description: 'Gere cláusulas padronizadas',
    icon: Scale,
    available: false,
    badge: 'Em breve',
    color: '#F59E0B',
    hasSavedList: false,
  },
  {
    id: 'contrato',
    label: 'Contrato',
    description: 'Monte contratos completos com variáveis',
    icon: ScrollText,
    available: false,
    badge: 'Em breve',
    color: '#F87171',
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
    color: '#06B6D4',
    hasSavedList: false,
  },
];

export function getDocDefinition(id: DocType) {
  return (
    DOC_DEFINITIONS.find((d) => d.id === id) ??
    PEOPLE_DEFINITIONS.find((d) => d.id === id)
  );
}
