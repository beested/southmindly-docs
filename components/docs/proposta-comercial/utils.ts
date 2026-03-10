'use client';

import { PropostaEscopoData } from '@/types/docs';

export function formatMoney(value: string) {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  if (!Number.isFinite(num)) return value;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function normalizeEscoposOrder(items: PropostaEscopoData[]) {
  return items
    .slice()
    .sort((a, b) => a.ordem - b.ordem)
    .map((s, idx) => ({ ...s, ordem: idx }));
}

export function formatProposalVersion(dateBR: string) {
  const normalized = dateBR.trim();

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) {
    const [, monthStr, yearStr] = normalized.split('/');
    const month = Number(monthStr);
    const year = Number(yearStr);

    if (month >= 1 && month <= 12 && Number.isInteger(year)) {
      const monthLabel = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
      }).format(new Date(year, month - 1, 1));

      return `Versão ${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)} de ${year}`;
    }
  }

  const now = new Date();
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
  }).format(now);

  return `Versão ${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)} de ${now.getFullYear()}`;
}
