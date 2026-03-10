'use client';

import { defaultPropostaComercialData } from '@/lib/schemas/proposta-comercial';
import { PropostaComercialData } from '@/types/docs';

import { SelectOption } from './types';

export const defaultData = {
  ...defaultPropostaComercialData,
  revisao: defaultPropostaComercialData.revisao || '0',
};

export const statusOptions: SelectOption<PropostaComercialData['status']>[] = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'aceita', label: 'Aceita' },
  { value: 'recusada', label: 'Recusada' },
  { value: 'cancelada', label: 'Cancelada' },
];

export const propostaBackgroundSrc = '/proposta-background.svg';
export const southMindlyLogoSrc = '/logo-full.png';

export const printStyles = `
  @media print {
    @page { margin: 0; size: A4 portrait; }
    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    body { background: #05070B; }
    body * { visibility: hidden; }
    #preview-doc, #preview-doc * { visibility: visible; }
    #preview-doc {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 297mm !important;
      min-height: 297mm !important;
      margin: 0;
      padding: 40px !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: none !important;
      background-color: #05070B !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
  }
`;
