'use client';

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
    <div className="fixed inset-0 z-[500] bg-black/60 flex items-start justify-center sm-textarea-scrollbar p-4 sm:items-center sm:p-6 print:hidden">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#1E2130] bg-[#13161D] shadow-[0_24px_64px_rgba(0,0,0,0.45)] max-h-[calc(100vh-2rem)] sm:max-h-[85vh]">
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

        <div className="overflow-y-auto overflow-x-hidden p-4 sm:p-5">
          {filteredEscopos.map((escopo) => {
            const alreadySelected = escoposSelecionados.some(
              (item) => item.escopoId === escopo.id,
            );

            return (
              <div
                key={escopo.id}
                className="mb-3 rounded-xl border border-[#1E2130] bg-[#171B24] p-2 transition-colors duration-200 hover:border-[#252A3A] hover:bg-[#1A1F29] last:mb-0"
              >
                <div className="flex flex-col  gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onAddEscopo(escopo)}
                    disabled={alreadySelected}
                    className="h-auto min-w-0 flex-1 items-start justify-start whitespace-normal px-0 py-0 text-left hover:bg-transparent disabled:opacity-60"
                  >
                    <div className="w-full p-2 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-medium text-[#E8EAF0] break-words">
                          {escopo.nome}
                        </div>
                        <span className="rounded-full border border-[#252A3A] bg-[#191C25] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                          {escopo.tipoCobranca || 'Escopo'}
                        </span>
                      </div>

                      {(escopo.descricao || escopo.unidadeLabel) && (
                        <div className="space-y-2">
                          {escopo.descricao && (
                            <p className="text-xs leading-5 text-[#A7AFBF] break-words">
                              {escopo.descricao}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B7280]">
                            {escopo.unidadeLabel && (
                              <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                                Unidade: {escopo.unidadeLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            );
          })}

          {escoposCatalogo.length === 0 && (
            <div className="rounded-xl border border-[#1E2130] bg-[#171B24] p-6 text-sm text-[#6B7280]">
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
