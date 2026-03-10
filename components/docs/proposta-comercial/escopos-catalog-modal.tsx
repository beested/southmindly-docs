'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PropostaEscopoData } from '@/types/docs';

import { EscopoCatalogItem } from './types';

interface EscoposCatalogModalProps {
  open: boolean;
  escoposCatalogo: EscopoCatalogItem[];
  query: string;
  escoposSelecionados: PropostaEscopoData[];
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onAddEscopo: (escopo: EscopoCatalogItem) => void;
}

export function EscoposCatalogModal({
  open,
  escoposCatalogo,
  query,
  escoposSelecionados,
  onClose,
  onQueryChange,
  onAddEscopo,
}: EscoposCatalogModalProps) {
  if (!open) return null;

  const filteredEscopos = escoposCatalogo.filter((escopo) => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return (
      escopo.nome.toLowerCase().includes(normalizedQuery) ||
      escopo.descricao.toLowerCase().includes(normalizedQuery) ||
      escopo.tipoCobranca.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-center justify-center p-6 print:hidden">
      <div className="w-full max-w-2xl bg-[#13161D] border border-[#1E2130] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E2130] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#6B7280] tracking-[0.14em] uppercase">
              Catálogo de escopos
            </div>
            <div className="text-sm font-medium text-[#E8EAF0]">
              Selecione um escopo para adicionar
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

        <div className="px-6 py-4 border-b border-[#1E2130]">
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar escopo..."
            className="w-full h-[48px] bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] focus-visible:border-[#34D399] focus-visible:ring-[3px] focus-visible:ring-[#34D39922]"
          />
        </div>

        <div className="max-h-[60vh] overflow-auto divide-y divide-[#1E2130]">
          {filteredEscopos.map((escopo) => {
            const alreadySelected = escoposSelecionados.some(
              (item) => item.escopoId === escopo.id,
            );

            return (
              <div key={escopo.id} className="p-5 flex items-start gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onAddEscopo(escopo)}
                  disabled={alreadySelected}
                  className="h-auto flex-1 text-left justify-start px-0 py-0 hover:bg-transparent disabled:opacity-60"
                >
                  <div className="text-sm font-medium text-[#E8EAF0] truncate">
                    {escopo.nome}
                  </div>
                  <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                    {escopo.tipoCobranca || 'Escopo'}
                    {escopo.unidadeLabel ? ` · ${escopo.unidadeLabel}` : ''}
                    {escopo.descricao ? ` · ${escopo.descricao}` : ''}
                  </div>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onAddEscopo(escopo)}
                  disabled={alreadySelected}
                  className={`h-8 px-3 rounded-lg border ${
                    alreadySelected
                      ? 'border-[#252A3A] text-[#6B7280] bg-transparent hover:bg-transparent'
                      : 'border-[#34D39944] text-[#34D399] bg-[#34D39918] hover:bg-[#34D39933] hover:text-[#34D399]'
                  }`}
                >
                  <Plus className="size-4" />
                  {alreadySelected ? 'Adicionado' : 'Adicionar'}
                </Button>
              </div>
            );
          })}

          {escoposCatalogo.length === 0 && (
            <div className="p-6 text-sm text-[#6B7280]">
              Nenhum escopo ativo encontrado.
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#1E2130] flex items-center justify-between">
          <div className="text-[11px] text-[#6B7280] font-mono">
            {escoposCatalogo.length} item(ns)
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-[#34D399] text-[#0B0D12] text-[12px] font-medium hover:bg-[#34D399] hover:text-[#0B0D12]"
          >
            Concluir
          </Button>
        </div>
      </div>
    </div>
  );
}
