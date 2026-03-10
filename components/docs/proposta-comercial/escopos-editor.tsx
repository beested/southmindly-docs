'use client';

import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PropostaEscopoData } from '@/types/docs';

interface EscoposEditorProps {
  escopos: PropostaEscopoData[];
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, patch: Partial<PropostaEscopoData>) => void;
  onOpenCatalog: () => void;
}

export function EscoposEditor({
  escopos,
  onMove,
  onRemove,
  onUpdate,
  onOpenCatalog,
}: EscoposEditorProps) {
  const sortedEscopos = escopos.slice().sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="p-[28px_32px] overflow-y-auto">
      <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-[#1E2130]">
        <div className="text-[10px] font-mono text-[#34D399] tracking-[0.15em] uppercase">
          Escopos
        </div>
        <span className="text-[11px] font-mono text-[#6B7280]">
          Selecione e defina valores
        </span>
      </div>

      {sortedEscopos.length === 0 && (
        <div className="text-center p-[56px_24px] text-[#6B7280] text-sm border border-dashed border-[#1E2130] rounded-xl mb-4">
          <div className="text-4xl mb-3 opacity-35">
            <ClipboardList className="mx-auto size-10" />
          </div>
          <div className="mb-1.5 font-medium">Nenhum escopo adicionado</div>
          <div className="text-xs text-[#1E2130]">
            Clique em &quot;Adicionar escopo&quot; para começar
          </div>
        </div>
      )}

      {sortedEscopos.map((escopo, index) => (
        <div
          key={`${escopo.escopoId}-${index}`}
          className="p-4 bg-[#191C25] border border-[#252A3A] rounded-[10px] mb-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="min-w-[28px] h-7 rounded-full bg-gradient-to-br from-[#34D399] to-[#4F7EFF] flex items-center justify-center text-[11px] font-bold text-white font-mono shrink-0 mt-0.5">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-sans font-medium text-[#E8EAF0] truncate">
                  {escopo.nome}
                </div>
                <div className="text-[11px] font-mono text-[#6B7280] mt-0.5">
                  {escopo.tipoCobranca ? escopo.tipoCobranca : 'Escopo'}
                  {escopo.unidadeLabel ? ` · ${escopo.unidadeLabel}` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onMove(index, Math.max(0, index - 1))}
                disabled={index === 0}
                className="bg-transparent hover:bg-transparent text-[#6B7280] hover:text-[#E8EAF0] disabled:opacity-30"
                title="Mover para cima"
              >
                <ChevronUp className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() =>
                  onMove(index, Math.min(sortedEscopos.length - 1, index + 1))
                }
                disabled={index === sortedEscopos.length - 1}
                className="bg-transparent hover:bg-transparent text-[#6B7280] hover:text-[#E8EAF0] disabled:opacity-30"
                title="Mover para baixo"
              >
                <ChevronDown className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove(index)}
                className="bg-transparent hover:bg-transparent text-[#6B7280] hover:text-[#F87171]"
                title="Remover escopo"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div>
              <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                Periodicidade
              </div>
              <input
                value={escopo.periodicidade}
                onChange={(e) =>
                  onUpdate(index, { periodicidade: e.target.value })
                }
                placeholder="mensal"
                className="w-full h-[48px] bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-2 text-[#9CA3AF] text-xs font-mono outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] focus-visible:border-[#34D399] focus-visible:ring-[3px] focus-visible:ring-[#34D39922]"
              />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                Valor negociado
              </div>
              <input
                value={escopo.valorNegociado}
                onChange={(e) =>
                  onUpdate(index, { valorNegociado: e.target.value })
                }
                placeholder="Ex: 2500"
                className="w-full h-[48px] bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-2 text-[#9CA3AF] text-xs font-mono outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] focus-visible:border-[#34D399] focus-visible:ring-[3px] focus-visible:ring-[#34D39922]"
              />
            </div>
          </div>

          <div className="mt-2.5">
            <div className="text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
              Observação
            </div>
            <textarea
              value={escopo.observacao}
              onChange={(e) => onUpdate(index, { observacao: e.target.value })}
              rows={2}
              placeholder="Detalhes do escopo..."
              className="sm-textarea-scrollbar w-full bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-2 text-[#9CA3AF] text-xs font-sans outline-none resize-y placeholder:text-[#6B7280] placeholder:opacity-55"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        onClick={onOpenCatalog}
        className="h-auto w-full p-3.5 bg-[#34D39918] border border-dashed border-[#34D39944] rounded-xl text-[#34D399] text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 mt-1 hover:bg-[#34D39933] hover:text-[#34D399]"
      >
        <Plus className="size-4" />
        Adicionar escopo
      </Button>
    </div>
  );
}
