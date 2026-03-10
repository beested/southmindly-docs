'use client';

import {
  Eye,
  FilePlus2,
  FolderOpen,
  Pencil,
  Printer,
  Save,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { ClienteItem } from './types';

interface PropostaHeaderProps {
  onBack: () => void;
  activeTab: 'editor' | 'preview';
  selectedCliente?: ClienteItem;
  numeroProposta: string;
  propostaDbId: string | null;
  saving: boolean;
  onNew: () => void;
  onOpenList: () => void;
  onSetEditor: () => void;
  onSetPreview: () => void;
  onSave: () => void;
  onPrint: () => void;
}

export function PropostaHeader({
  onBack,
  activeTab,
  selectedCliente,
  numeroProposta,
  propostaDbId,
  saving,
  onNew,
  onOpenList,
  onSetEditor,
  onSetPreview,
  onSave,
  onPrint,
}: PropostaHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1E2130] bg-[#0D0F14EE] px-4 py-3 backdrop-blur-md print:hidden sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-auto border-none bg-transparent p-1 px-2 text-lg text-[#6B7280] transition-colors duration-200 hover:bg-transparent hover:text-[#E8EAF0]"
          >
            ←
          </Button>
          <div className="h-5 w-px bg-[#1E2130]" />
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#6B7280]">
              Proposta Comercial
            </div>
            <div className="truncate text-[13px] font-medium text-[#E8EAF0]">
              {selectedCliente?.razaoSocial ||
                (numeroProposta
                  ? `Proposta #${numeroProposta}`
                  : 'Novo documento')}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onNew}
            className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39955] hover:bg-transparent hover:text-[#34D399] sm:px-4.5 sm:text-[13px]"
            title="Novo documento"
          >
            <FilePlus2 className="size-4" />
            Novo
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onOpenList}
            className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39944] hover:bg-transparent hover:text-[#34D399] sm:px-4.5 sm:text-[13px]"
            title="Consultar propostas salvas"
          >
            <FolderOpen className="size-4" />
            Propostas
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSetEditor}
            className={`h-auto rounded-lg border-none px-3 py-1.5 text-[12px] font-medium transition-all duration-200 hover:bg-transparent sm:px-4 sm:text-[13px] ${activeTab === 'editor' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
          >
            <Pencil className="size-4" />
            Editor
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onSetPreview}
            className={`h-auto rounded-lg border-none px-3 py-1.5 text-[12px] font-medium transition-all duration-200 hover:bg-transparent sm:px-4 sm:text-[13px] ${activeTab === 'preview' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
          >
            <Eye className="size-4" />
            Preview
          </Button>
          <div className="mx-1 hidden h-5 w-px bg-[#1E2130] sm:block" />
          <Button
            type="button"
            variant="ghost"
            onClick={onSave}
            disabled={saving}
            className="h-auto rounded-lg border border-[#34D39944] bg-[#34D39918] px-3 py-1.5 text-[12px] font-medium text-[#34D399] transition-all duration-200 hover:bg-[#34D39933] hover:text-[#34D399] disabled:opacity-60 sm:px-4.5 sm:text-[13px]"
            title="Salvar no Supabase"
          >
            <Save className="size-4" />
            {propostaDbId ? 'Atualizar' : 'Salvar'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onPrint}
            className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#34D399] hover:bg-transparent hover:text-[#34D399] sm:px-4.5 sm:text-[13px]"
            title="Abrir impressão do navegador"
          >
            <Printer className="size-4" />
            Imprimir
          </Button>
        </div>
      </div>
    </header>
  );
}
