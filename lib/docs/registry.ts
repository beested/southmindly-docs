import { DocType, DocMenuItem } from '@/types/docs';

export type DocDefinition = DocMenuItem & {
  hasSavedList: boolean;
};

export const DOC_DEFINITIONS: DocDefinition[] = [
  {
    id: 'pauta-reuniao',
    label: 'Pauta de Reunião',
    description: 'Estruture pontos, responsáveis e horários',
    icon: '📋',
    available: true,
    color: '#4F7EFF',
    hasSavedList: true,
  },
  {
    id: 'ata-reuniao',
    label: 'Ata de Reunião',
    description: 'Registre decisões e encaminhamentos',
    icon: '📝',
    available: false,
    badge: 'Em breve',
    color: '#A78BFA',
    hasSavedList: false,
  },
  {
    id: 'proposta-comercial',
    label: 'Proposta Comercial',
    description: 'Crie propostas profissionais para clientes',
    icon: '💼',
    available: false,
    badge: 'Em breve',
    color: '#34D399',
    hasSavedList: false,
  },
  {
    id: 'clausula-contratual',
    label: 'Cláusula Contratual',
    description: 'Gere cláusulas padronizadas',
    icon: '⚖️',
    available: false,
    badge: 'Em breve',
    color: '#F59E0B',
    hasSavedList: false,
  },
  {
    id: 'contrato',
    label: 'Contrato',
    description: 'Monte contratos completos com variáveis',
    icon: '📜',
    available: false,
    badge: 'Em breve',
    color: '#F87171',
    hasSavedList: false,
  },
];

export function getDocDefinition(id: DocType) {
  return DOC_DEFINITIONS.find((d) => d.id === id);
}

