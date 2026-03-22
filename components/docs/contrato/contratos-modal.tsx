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

import { ContractListItem } from './types';

interface ContratosModalProps {
  open: boolean;
  contratos: ContractListItem[];
  creatingNew: boolean;
  openingId: string | null;
  deletingId: string | null;
  onClose: () => void;
  onNew: () => void;
  onOpenSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}

export function ContratosModal({
  open,
  contratos,
  creatingNew,
  openingId,
  deletingId,
  onClose,
  onNew,
  onOpenSaved,
  onDeleteSaved,
}: ContratosModalProps) {
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
          <ModalTitle>Meus contratos</ModalTitle>
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
        {contratos.length === 0 && (
          <div className="rounded-xl border border-[#1E2130] bg-[#171B24] p-6 text-sm text-[#6B7280]">
            Nenhum contrato salvo ainda.
          </div>
        )}

        {contratos.map((contrato) => (
          <div
            key={contrato.id}
            className="mb-3 rounded-xl border border-[#1E2130] bg-[#171B24] p-2 transition-colors duration-200 hover:border-[#252A3A] hover:bg-[#1A1F29] last:mb-0"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 p-2">
                <div className="w-full min-w-0 space-y-2 p-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium break-words text-[#E8EAF0]">
                      {contrato.title || 'Contrato sem título'}
                    </div>
                    <span className="rounded-full border border-[#252A3A] bg-[#191C25] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                      {contrato.templateLabel}
                    </span>
                  </div>

                  {contrato.clientName && (
                    <p className="text-[13px] leading-5 text-[#C8D0DF]">
                      Cliente: {contrato.clientName}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B7280]">
                    {contrato.subtitle && (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Projeto: {contrato.subtitle}
                      </span>
                    )}
                    {contrato.signatureCity && (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Cidade: {contrato.signatureCity}
                      </span>
                    )}
                  </div>

                  {contrato.updatedAt && (
                    <p className="text-xs break-words leading-5 text-[#A7AFBF]">
                      Atualizado em{' '}
                      {new Date(contrato.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 p-2 pt-0 sm:w-auto sm:flex-col sm:items-end sm:pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onOpenSaved(contrato.id)}
                  disabled={isBusy}
                  className="h-9 flex-1 sm:w-[110px] sm:flex-none"
                >
                  {openingId === contrato.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Pencil className="size-3.5" />
                  )}
                  {openingId === contrato.id ? 'Abrindo...' : 'Editar'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="xs"
                  onClick={() => onDeleteSaved(contrato.id)}
                  disabled={isBusy}
                  title="Excluir"
                  className="h-9 flex-1 sm:w-[110px] sm:flex-none"
                >
                  {deletingId === contrato.id ? (
                    <LoaderCircle className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                  {deletingId === contrato.id ? 'Excluindo...' : 'Excluir'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </ModalBody>

      <ModalFooter>
        <div className="text-[11px] font-mono text-[#6B7280]">
          {contratos.length} {contratos.length === 1 ? 'item' : 'itens'}
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
