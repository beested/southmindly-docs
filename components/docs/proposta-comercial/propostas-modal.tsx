'use client';

import { LoaderCircle, Pencil, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Modal,
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@/components/ui/modal';

import { PropostaListItem } from './types';

interface PropostasModalProps {
  open: boolean;
  propostas: PropostaListItem[];
  creatingNew: boolean;
  openingId: string | null;
  deletingId: string | null;
  onClose: () => void;
  onNew: () => void;
  onOpenSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function PropostasModal({
  open,
  propostas,
  creatingNew,
  openingId,
  deletingId,
  onClose,
  onNew,
  onOpenSaved,
  onDeleteSaved,
}: PropostasModalProps) {
  if (!open) return null;
  const isBusy = Boolean(creatingNew || openingId || deletingId);

  return (
    <Modal
      open={open}
      onClose={onClose}
      overlayClassName="sm-textarea-scrollbar"
      panelClassName="max-w-3xl max-h-[calc(100vh-2rem)] sm:max-h-[85vh]"
    >
      <ModalHeader>
        <div>
          <ModalTitle>Minhas propostas</ModalTitle>
          <ModalDescription>Selecione para abrir ou excluir</ModalDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isBusy}
          className="h-auto w-auto rounded px-2 py-1 text-[#6B7280] hover:bg-transparent hover:text-[#E8EAF0]"
        >
          <X className="size-4" />
        </Button>
      </ModalHeader>

      <ModalBody>
        {propostas.length === 0 && (
          <div className="rounded-xl border border-[#1E2130] bg-[#171B24] p-6 text-sm text-[#6B7280]">
            Nenhuma proposta salva ainda.
          </div>
        )}

        {propostas.map((proposta) => (
          <div
            key={proposta.id}
            className="mb-3 rounded-xl border border-[#1E2130] bg-[#171B24] p-2 transition-colors duration-200 hover:border-[#252A3A] hover:bg-[#1A1F29] last:mb-0"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 p-2">
                <div className="w-full min-w-0 space-y-2 p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium text-[#E8EAF0] break-words">
                      Proposta #{proposta.numeroProposta ?? '—'} · Rev.{' '}
                      {proposta.revisao ?? '—'}
                    </div>
                    <span className="rounded-full border border-[#252A3A] bg-[#191C25] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                      {proposta.status || 'Sem status'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B7280]">
                    {proposta.dataProposta && (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Data: {proposta.dataProposta}
                      </span>
                    )}
                    {proposta.cidade && (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Cidade: {proposta.cidade}
                      </span>
                    )}
                  </div>

                  {proposta.updatedAt && (
                    <p className="text-xs leading-5 text-[#A7AFBF] break-words">
                      Atualizado em{' '}
                      {new Date(proposta.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 p-2 pt-0 sm:w-auto sm:flex-col sm:items-end sm:pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onOpenSaved(proposta.id)}
                  disabled={isBusy}
                  className="h-9 flex-1 sm:w-[110px] sm:flex-none"
                >
                  {openingId === proposta.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Pencil className="size-3.5" />
                  )}
                  {openingId === proposta.id ? 'Abrindo...' : 'Editar'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  onClick={() => onDeleteSaved(proposta.id)}
                  disabled={isBusy}
                  title="Excluir"
                  className="h-9 flex-1 sm:w-[110px] sm:flex-none"
                >
                  {deletingId === proposta.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  {deletingId === proposta.id ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ModalBody>

      <ModalFooter>
        <div className="text-[11px] font-mono text-[#6B7280]">
          {propostas.length} {propostas.length === 1 ? 'item' : 'itens'}
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={onNew}
          disabled={isBusy}
          className="h-9 rounded-lg bg-[#A78BFA] px-4 text-[12px] font-medium text-[#0B0D12] hover:bg-[#A78BFA] hover:text-[#0B0D12]"
        >
          {creatingNew ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {creatingNew ? 'Preparando...' : 'Novo'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
