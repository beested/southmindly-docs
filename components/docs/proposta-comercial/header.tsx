'use client';

import {
  Download,
  Eye,
  FilePlus2,
  FolderOpen,
  Pencil,
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
    <header className="border-b border-[#1E2130] px-8 flex items-center justify-between h-[60px] bg-[#0D0F14EE] backdrop-blur-md shrink-0 print:hidden">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-auto bg-transparent hover:bg-transparent border-none text-[#6B7280] cursor-pointer text-lg p-1 px-2 flex items-center transition-colors duration-200 hover:text-[#E8EAF0]"
        >
          ←
        </Button>
        <div className="w-px h-5 bg-[#1E2130]" />
        <div>
          <div className="text-[10px] font-mono text-[#6B7280] tracking-[0.1em] uppercase">
            Proposta Comercial
          </div>
          <div className="text-[13px] font-sans text-[#E8EAF0] font-medium">
            {selectedCliente?.razaoSocial ||
              (numeroProposta
                ? `Proposta #${numeroProposta}`
                : 'Novo documento')}
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={onNew}
          className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39955] hover:text-[#34D399] hover:bg-transparent"
          title="Novo documento"
        >
          <FilePlus2 className="size-4" />
          Novo
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenList}
          className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39944] hover:text-[#34D399] hover:bg-transparent"
          title="Consultar propostas salvas"
        >
          <FolderOpen className="size-4" />
          Propostas
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSetEditor}
          className={`h-auto px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 hover:bg-transparent ${activeTab === 'editor' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
        >
          <Pencil className="size-4" />
          Editor
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSetPreview}
          className={`h-auto px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 hover:bg-transparent ${activeTab === 'preview' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
        >
          <Eye className="size-4" />
          Preview
        </Button>
        <div className="w-px h-5 bg-[#1E2130] mx-1" />
        <Button
          type="button"
          variant="ghost"
          onClick={onSave}
          disabled={saving}
          className="h-auto px-4.5 py-1.5 rounded-lg border border-[#34D39944] cursor-pointer text-[13px] font-sans font-medium bg-[#34D39918] text-[#34D399] transition-all duration-200 hover:bg-[#34D39933] hover:text-[#34D399] disabled:opacity-60"
          title="Salvar no Supabase"
        >
          <Save className="size-4" />
          {propostaDbId ? 'Atualizar' : 'Salvar'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onPrint}
          className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D399] hover:text-[#34D399] hover:bg-transparent"
        >
          <Download className="size-4" />
          PDF
        </Button>
      </div>
    </header>
  );
}
