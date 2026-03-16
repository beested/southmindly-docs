'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/inputs';
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';
import { PropostaEscopoData } from '@/types/docs';
import { X } from 'lucide-react';

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
    <Modal
      open={open}
      onClose={onClose}
      overlayClassName="sm-textarea-scrollbar"
      panelClassName="max-w-3xl max-h-[calc(100vh-2rem)] sm:max-h-[85vh]"
    >
      <ModalHeader>
        <div>
          <ModalTitle>Catálogo de escopos</ModalTitle>
          <ModalDescription>Selecione um escopo para adicionar</ModalDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-auto w-auto rounded px-2 py-1 text-[#6B7280] hover:bg-transparent hover:text-[#E8EAF0]"
        >
          <X className="size-4" />
        </Button>
      </ModalHeader>

      <div className="border-b border-[#1E2130] px-6 py-4">
        <Field
          label="Buscar"
          value={query}
          onChange={onQueryChange}
          placeholder="Buscar escopo..."
        />
      </div>

      <ModalBody>
        {filteredEscopos.map((escopo) => {
          const alreadySelected = escoposSelecionados.some(
            (item) => item.escopoId === escopo.id,
          );

          return (
            <div
              key={escopo.id}
              className="mb-3 rounded-xl border border-[#1E2130] bg-[#171B24] p-2 transition-colors duration-200 hover:border-[#252A3A] hover:bg-[#1A1F29] last:mb-0"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onAddEscopo(escopo)}
                  disabled={alreadySelected}
                  className="h-auto min-w-0 flex-1 items-start justify-start whitespace-normal px-0 py-0 text-left hover:bg-transparent disabled:opacity-60"
                >
                  <div className="min-w-0 w-full space-y-2 p-2">
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
      </ModalBody>

      <ModalFooter>
        <div className="text-[11px] font-mono text-[#6B7280]">
          {escoposCatalogo.length} item(ns)
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-9 rounded-lg bg-[#A78BFA] px-4 text-[12px] font-medium text-[#0B0D12] hover:bg-[#A78BFA] hover:text-[#0B0D12]"
        >
          Concluir
        </Button>
      </ModalFooter>
    </Modal>
  );
}
