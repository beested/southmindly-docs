'use client';

import { useMemo } from 'react';

import { PropostaComercialData } from '@/types/docs';

import { propostaBackgroundSrc, southMindlyLogoSrc } from './constants';
import { ClienteItem } from './types';
import { formatProposalVersion } from './utils';

export function PropostaPreview({
  proposta,
  cliente,
}: {
  proposta: PropostaComercialData;
  cliente?: ClienteItem;
}) {
  const footerVersionLabel = useMemo(
    () => formatProposalVersion(proposta.dataProposta),
    [proposta.dataProposta],
  );

  return (
    <div
      id="preview-doc"
      className="relative flex h-[1123px] w-full max-w-[794px] flex-col mx-auto overflow-hidden bg-[#05070B] text-[#0B0D12] rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)] p-10"
      style={{
        backgroundImage: `url(${propostaBackgroundSrc})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', // ← troca '100% 100%' por 'cover'
      }}
    >
      <div className="relative z-10 mb-14 flex flex-col items-center pt-6 text-center">
        <img
          src={southMindlyLogoSrc}
          alt="SouthMindly"
          className="mb-12 h-16 w-auto object-contain"
        />

        <div className="text-sm font-mono uppercase tracking-[0.2em] text-[#6B7280]">
          Proposta N° {proposta.numeroProposta || '—'} (Rev.{' '}
          {proposta.revisao || '—'})
        </div>

        <div className="mt-3 text-sm font-mono tracking-[0.18em] text-[#8C92A4]">
          {[proposta.cidade || cliente?.cidade, proposta.dataProposta]
            .filter(Boolean)
            .join(' · ') || '—'}
        </div>

        <div className="mt-8 text-[42px] font-semibold uppercase leading-[1.05] tracking-[0.08em] text-[#E8EAF0]">
          <div>Proposta de</div>
          <div>Prestação de Serviços</div>
        </div>

        {cliente?.logoUrl && (
          <img
            src={cliente.logoUrl}
            alt={cliente.razaoSocial}
            className="mt-16 h-32 w-auto max-w-[340px] object-contain"
          />
        )}

        <div className="mt-4 text-lg font-medium text-[#E8EAF0]">
          {cliente?.nomeContato || '—'}
        </div>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between gap-6 border-t border-[#E5E7EB]/50 pt-4 text-[11px] font-mono text-[#8C92A4]">
        <div>
          Proposta de Prestação de Serviços para Assessoria de Marketing Digital
          - {footerVersionLabel}
        </div>
        <div>Pág. 1/1</div>
      </div>
    </div>
  );
}
