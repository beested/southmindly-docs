'use client';

import { useMemo, useState } from 'react';

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
import { Check, X } from 'lucide-react';

import { ServicoCatalogoItem } from './types';

interface ServicesModalProps {
  open: boolean;
  query: string;
  services: ServicoCatalogoItem[];
  selectedCatalogIds: string[];
  onClose: () => void;
  onQueryChange: (value: string) => void;
  onConfirm: (services: ServicoCatalogoItem[]) => void;
}

export function ServicesModal({
  open,
  query,
  services,
  selectedCatalogIds,
  onClose,
  onQueryChange,
  onConfirm,
}: ServicesModalProps) {
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return services;

    return services.filter((service) =>
      [service.nome, service.descricao, service.tipoCobranca, service.unidadeLabel]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, services]);

  if (!open) return null;

  const handleClose = () => {
    setPendingIds([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      overlayClassName="sm-textarea-scrollbar"
      panelClassName="max-w-4xl max-h-[calc(100vh-2rem)] sm:max-h-[85vh]"
    >
      <ModalHeader>
        <div>
          <ModalTitle>Selecionar serviços</ModalTitle>
          <ModalDescription>
            Escolha um ou mais serviços para adicionar ao alinhamento
          </ModalDescription>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleClose}
          className="h-auto w-auto rounded px-2 py-1 text-[#6B7280] hover:bg-transparent hover:text-[#E8EAF0]"
        >
          <X className="size-4" />
        </Button>
      </ModalHeader>

      <div className="border-b border-[#1E2130] px-6 py-4">
        <Field
          label="Buscar serviço"
          value={query}
          onChange={onQueryChange}
          placeholder="Ex: gestão digital, tráfego pago..."
        />
      </div>

      <ModalBody className="space-y-3">
        {filteredServices.map((service) => {
          const alreadyAdded = selectedCatalogIds.includes(service.id);
          const isSelected = pendingIds.includes(service.id);
          const priceLabel =
            service.valorPadrao === null || service.valorPadrao === undefined
              ? null
              : new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.valorPadrao);

          return (
            <button
              key={service.id}
              type="button"
              disabled={alreadyAdded}
              onClick={() => {
                setPendingIds((current) =>
                  current.includes(service.id)
                    ? current.filter((id) => id !== service.id)
                    : [...current, service.id],
                );
              }}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                alreadyAdded
                  ? 'cursor-not-allowed border-[#1E2130] bg-[#151923] opacity-55'
                  : isSelected
                    ? 'border-[#7C3AED55] bg-[#7C3AED14]'
                    : 'border-[#1E2130] bg-[#171B24] hover:border-[#252A3A] hover:bg-[#1A1F29]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border ${
                    isSelected
                      ? 'border-[#7C3AED] bg-[#7C3AED] text-[#0B0D12]'
                      : 'border-[#2A3145] bg-[#0D0F14] text-transparent'
                  }`}
                >
                  <Check className="size-3.5" />
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-medium text-[#E8EAF0]">
                      {service.nome}
                    </div>
                    {service.tipoCobranca ? (
                      <span className="rounded-full border border-[#252A3A] bg-[#191C25] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                        {service.tipoCobranca}
                      </span>
                    ) : null}
                    {alreadyAdded ? (
                      <span className="rounded-full border border-[#34D39933] bg-[#34D39914] px-2 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-[#34D399]">
                        Já adicionado
                      </span>
                    ) : null}
                  </div>

                  {service.descricao ? (
                    <p className="text-sm leading-6 text-[#A7AFBF]">
                      {service.descricao}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#6B7280]">
                    {service.unidadeLabel ? (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Detalhamento sugerido: {service.unidadeLabel}
                      </span>
                    ) : null}
                    {priceLabel ? (
                      <span className="rounded-md bg-[#0D0F1488] px-2 py-1">
                        Valor base: {priceLabel}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filteredServices.length === 0 ? (
          <div className="rounded-xl border border-[#1E2130] bg-[#171B24] p-6 text-sm text-[#6B7280]">
            Nenhum serviço encontrado para o filtro informado.
          </div>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <div className="text-[11px] font-mono text-[#6B7280]">
          {pendingIds.length} selecionado(s)
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="h-9 rounded-lg border border-[#252A3A] bg-transparent px-4 text-[12px] font-medium text-[#9CA3AF] hover:bg-transparent hover:text-[#E8EAF0]"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onConfirm(
                services.filter((service) => pendingIds.includes(service.id)),
              );
              setPendingIds([]);
            }}
            disabled={pendingIds.length === 0}
            className="h-9 rounded-lg bg-[#A78BFA] px-4 text-[12px] font-medium text-[#0B0D12] hover:bg-[#A78BFA] hover:text-[#0B0D12] disabled:opacity-60"
          >
            Adicionar selecionados
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
