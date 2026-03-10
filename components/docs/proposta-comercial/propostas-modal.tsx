'use client';

import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PropostaListItem } from './types';

interface PropostasModalProps {
  open: boolean;
  propostas: PropostaListItem[];
  onClose: () => void;
  onNew: () => void;
  onOpenSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function PropostasModal({
  open,
  propostas,
  onClose,
  onNew,
  onOpenSaved,
  onDeleteSaved,
}: PropostasModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center p-6 print:hidden">
      <div className="w-full max-w-2xl bg-[#13161D] border border-[#1E2130] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E2130] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#6B7280] tracking-[0.14em] uppercase">
              Minhas propostas
            </div>
            <div className="text-sm font-medium text-[#E8EAF0]">
              Selecione para abrir ou excluir
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-auto w-auto text-[#6B7280] hover:text-[#E8EAF0] px-2 py-1 rounded hover:bg-transparent"
          >
            ✕
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-auto divide-y divide-[#1E2130]">
          {propostas.length === 0 && (
            <div className="p-6 text-sm text-[#6B7280]">
              Nenhuma proposta salva ainda.
            </div>
          )}

          {propostas.map((proposta) => (
            <div key={proposta.id} className="p-5 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenSaved(proposta.id)}
                className="h-auto flex-1 text-left justify-start px-0 py-0 hover:bg-transparent"
              >
                <div className="text-sm font-medium text-[#E8EAF0] truncate">
                  Proposta #{proposta.numeroProposta ?? '—'} · Rev.{' '}
                  {proposta.revisao ?? '—'}
                </div>
                <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                  {proposta.status || '—'}{' '}
                  {proposta.dataProposta ? `· ${proposta.dataProposta}` : ''}
                  {proposta.updatedAt
                    ? ` · atualizado ${new Date(proposta.updatedAt).toLocaleString('pt-BR')}`
                    : ''}
                </div>
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="xs"
                onClick={() => onDeleteSaved(proposta.id)}
                title="Excluir"
                className="mt-0 w-auto"
              >
                <Trash2 className="size-3.5" />
                Excluir
              </Button>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-[#1E2130] flex items-center justify-between">
          <div className="text-[11px] text-[#6B7280] font-mono">
            {propostas.length} {propostas.length === 1 ? 'item' : 'itens'}
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onNew}
            className="h-9 px-4 rounded-lg bg-[#34D399] text-[#0B0D12] text-[12px] font-medium hover:bg-[#34D399] hover:text-[#0B0D12]"
          >
            Novo
          </Button>
        </div>
      </div>
    </div>
  );
}
