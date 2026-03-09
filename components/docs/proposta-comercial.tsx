'use client';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropostaComercialData, PropostaEscopoData } from '@/types/docs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FilePlus2,
  FolderOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';

type ClienteItem = {
  id: string;
  razaoSocial: string;
  cidade: string;
  nomeContato: string;
  cargoContato: string;
  emailContato: string;
  telefoneContato: string;
  logoUrl: string;
};

type AssessorItem = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
};

type PropostaListItem = {
  id: string;
  numeroProposta: number | null;
  revisao: number | null;
  status: string;
  cidade: string;
  dataProposta: string;
  updatedAt: string;
  clienteId: string;
  assessorId: string;
};

type EscopoCatalogItem = {
  id: string;
  nome: string;
  descricao: string;
  tipoCobranca: string;
  valorPadrao: number | null;
  unidadeLabel: string;
  ordem: number;
};

interface PropostaComercialProps {
  onBack: () => void;
}

const defaultData: PropostaComercialData = {
  numeroProposta: '',
  revisao: '0',
  status: 'rascunho',
  cidade: '',
  dataProposta: '',
  prazoContratoMeses: '',
  dataAceite: '',
  valorTotalMensal: '',
  observacoes: '',

  clienteId: '',
  assessorId: '',

  nomeResponsavelAssinatura: '',

  escopos: [],
};

function formatMoney(value: string) {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  const num = Number(normalized);
  if (!Number.isFinite(num)) return value;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full h-[48px] bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] ${focused ? 'border-[#34D399] ring-[3px] ring-[#34D39922]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`sm-textarea-scrollbar w-full bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none resize-y transition-colors duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 ${focused ? 'border-[#34D399]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const active = open || focused;
  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${active ? 'text-[#34D399]' : 'text-[#6B7280]'}`}
      >
        {label}
      </label>
      <Select
        value={value || undefined}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectTrigger
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full h-[48px] justify-between bg-[#191C25] border-[#1E2130] text-[#E8EAF0] rounded-lg px-3.5 hover:bg-[#191C25] hover:text-[#E8EAF0] hover:border-[#252A3A] data-[placeholder]:text-[#6B7280] ${
            active ? 'border-[#34D399] ring-[3px] ring-[#34D39922]' : ''
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          align="start"
          className="bg-[#13161D] border-[#1E2130] text-[#E8EAF0] rounded-xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] overflow-hidden"
        >
          {options.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="text-[13px] font-sans text-[#E8EAF0] focus:bg-[#1E2130] focus:text-[#E8EAF0] data-[state=checked]:bg-[#34D39922] data-[state=checked]:text-[#E8EAF0]"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Preview({
  proposta,
  cliente,
  assessor,
}: {
  proposta: PropostaComercialData;
  cliente?: ClienteItem;
  assessor?: AssessorItem;
}) {
  const scopes = useMemo(() => {
    const items = (proposta.escopos ?? []).slice().sort((a, b) => a.ordem - b.ordem);
    return items.map((s) => {
      const unit =
        s.unidadeLabel && s.unidadeLabel.trim()
          ? `/${s.unidadeLabel.trim()}`
          : '';
      const period =
        s.periodicidade && s.periodicidade.trim()
          ? ` (${s.periodicidade.trim()})`
          : '';

      const value = s.valorNegociado ? `${formatMoney(s.valorNegociado)}${unit}${period}` : '';

      return { label: s.nome || 'Escopo', value };
    });
  }, [proposta.escopos]);

  return (
    <div
      id="preview-doc"
      className="max-w-[920px] mx-auto bg-white text-[#0B0D12] rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.45)] p-10"
    >
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono tracking-[0.2em] uppercase text-[#6B7280] mb-2">
            Proposta Comercial
          </div>
          <div className="text-3xl font-semibold leading-tight">
            {cliente?.razaoSocial || 'Cliente'}
          </div>
          <div className="text-sm text-[#374151] mt-1">
            {proposta.cidade || cliente?.cidade || ''}{' '}
            {proposta.dataProposta ? `· ${proposta.dataProposta}` : ''}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-[#6B7280]">
            Nº {proposta.numeroProposta || '—'} · Rev. {proposta.revisao || '—'}
          </div>
          <div className="text-sm font-medium mt-2">
            Status: {proposta.status || '—'}
          </div>
        </div>
      </div>

      {cliente?.logoUrl && (
        <div className="mb-8">
          <img
            src={cliente.logoUrl}
            alt={cliente.razaoSocial}
            className="h-10 object-contain"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-[#E5E7EB] rounded-xl p-5">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-3">
            Contato do Cliente
          </div>
          <div className="text-sm font-medium">
            {cliente?.nomeContato || '—'}
          </div>
          <div className="text-sm text-[#374151]">
            {cliente?.cargoContato || ''}
          </div>
          <div className="text-sm text-[#374151] mt-2">
            {cliente?.emailContato || ''}
          </div>
          <div className="text-sm text-[#374151]">
            {cliente?.telefoneContato || ''}
          </div>
        </div>
        <div className="border border-[#E5E7EB] rounded-xl p-5">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-3">
            Assessor
          </div>
          <div className="text-sm font-medium">{assessor?.nome || '—'}</div>
          <div className="text-sm text-[#374151] mt-2">
            {assessor?.email || ''}
          </div>
          <div className="text-sm text-[#374151]">{assessor?.telefone || ''}</div>
        </div>
      </div>

      <div className="border border-[#E5E7EB] rounded-xl p-6 mb-8">
        <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-4">
          Escopo e Valores
        </div>
        <div className="space-y-3">
          {scopes.length === 0 && (
            <div className="text-sm text-[#6B7280] flex items-center gap-2">
              <ClipboardList className="size-4" />
              Nenhum escopo selecionado.
            </div>
          )}
          {scopes.map((s) => (
            <div
              key={`${s.label}-${s.value}`}
              className="flex items-center justify-between text-sm"
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-[#111827]">{s.value || '—'}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <div className="text-sm text-[#6B7280]">Total mensal</div>
          <div className="text-lg font-semibold">
            {proposta.valorTotalMensal ? formatMoney(proposta.valorTotalMensal) : '—'}
          </div>
        </div>
      </div>

      {proposta.observacoes && (
        <div className="border border-[#E5E7EB] rounded-xl p-6">
          <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-3">
            Observações
          </div>
          <div className="text-sm text-[#111827] whitespace-pre-wrap">
            {proposta.observacoes}
          </div>
        </div>
      )}

      {(proposta.nomeResponsavelAssinatura || proposta.dataAceite) && (
        <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex items-end justify-between">
          <div>
            <div className="text-xs font-mono tracking-[0.18em] uppercase text-[#6B7280] mb-2">
              Aceite
            </div>
            <div className="text-sm font-medium">
              {proposta.nomeResponsavelAssinatura || '—'}
            </div>
          </div>
          <div className="text-sm text-[#374151]">
            {proposta.dataAceite ? `Data: ${proposta.dataAceite}` : ''}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropostaComercial({ onBack }: PropostaComercialProps) {
  const [data, setData] = useState<PropostaComercialData>(defaultData);
  const [propostaDbId, setPropostaDbId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

  const [clientes, setClientes] = useState<ClienteItem[]>([]);
  const [assessores, setAssessores] = useState<AssessorItem[]>([]);
  const [escoposCatalogo, setEscoposCatalogo] = useState<EscopoCatalogItem[]>(
    [],
  );
  const [escoposCatalogoOpen, setEscoposCatalogoOpen] = useState(false);
  const [escoposCatalogoQuery, setEscoposCatalogoQuery] = useState('');

  const [listOpen, setListOpen] = useState(false);
  const [propostas, setPropostas] = useState<PropostaListItem[]>([]);
  const statusOptions = useMemo(
    () => [
      { value: 'rascunho', label: 'Rascunho' },
      { value: 'enviada', label: 'Enviada' },
      { value: 'em_negociacao', label: 'Em negociação' },
      { value: 'aceita', label: 'Aceita' },
      { value: 'recusada', label: 'Recusada' },
      { value: 'cancelada', label: 'Cancelada' },
    ],
    [],
  );

  const selectedCliente = useMemo(
    () => clientes.find((c) => c.id === data.clienteId),
    [clientes, data.clienteId],
  );

  const selectedAssessor = useMemo(
    () => assessores.find((a) => a.id === data.assessorId),
    [assessores, data.assessorId],
  );

  const refreshClientes = useCallback(async () => {
    const res = await fetch('/api/clientes', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: ClienteItem[];
    };
    setClientes(Array.isArray(json.items) ? json.items : []);
  }, []);

  const refreshAssessores = useCallback(async () => {
    const res = await fetch('/api/assessores', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: AssessorItem[];
    };
    setAssessores(Array.isArray(json.items) ? json.items : []);
  }, []);

  const refreshList = useCallback(async () => {
    const res = await fetch('/api/propostas', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: PropostaListItem[];
    };
    setPropostas(Array.isArray(json.items) ? json.items : []);
  }, []);

  const refreshEscoposCatalogo = useCallback(async () => {
    const res = await fetch('/api/escopos', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: EscopoCatalogItem[];
    };
    setEscoposCatalogo(Array.isArray(json.items) ? json.items : []);
  }, []);

  useEffect(() => {
    refreshClientes();
    refreshAssessores();
    refreshEscoposCatalogo();
  }, [refreshClientes, refreshAssessores, refreshEscoposCatalogo]);

  const normalizeEscoposOrder = (items: PropostaEscopoData[]) =>
    items
      .slice()
      .sort((a, b) => a.ordem - b.ordem)
      .map((s, idx) => ({ ...s, ordem: idx }));

  const addEscopo = (escopo: EscopoCatalogItem) => {
    setData((d) => {
      if (d.escopos.some((s) => s.escopoId === escopo.id)) return d;

      const next: PropostaEscopoData = {
        escopoId: escopo.id,
        nome: escopo.nome || 'Escopo',
        descricao: escopo.descricao || '',
        tipoCobranca: escopo.tipoCobranca || '',
        unidadeLabel: escopo.unidadeLabel || '',
        periodicidade: '',
        valorNegociado:
          escopo.valorPadrao === null || escopo.valorPadrao === undefined
            ? ''
            : String(escopo.valorPadrao),
        observacao: '',
        ordem: d.escopos.length,
      };

      return { ...d, escopos: normalizeEscoposOrder([...d.escopos, next]) };
    });
  };

  const removeEscopo = (index: number) => {
    setData((d) => ({
      ...d,
      escopos: normalizeEscoposOrder(d.escopos.filter((_, i) => i !== index)),
    }));
  };

  const moveEscopo = (from: number, to: number) => {
    setData((d) => {
      const items = d.escopos.slice();
      const item = items[from];
      if (!item) return d;
      items.splice(from, 1);
      items.splice(to, 0, item);
      return { ...d, escopos: normalizeEscoposOrder(items) };
    });
  };

  const updateEscopoAt = (sortedIndex: number, patch: Partial<PropostaEscopoData>) => {
    setData((d) => {
      const sorted = d.escopos.slice().sort((a, b) => a.ordem - b.ordem);
      const current = sorted[sortedIndex];
      if (!current) return d;
      sorted[sortedIndex] = { ...current, ...patch };
      return { ...d, escopos: normalizeEscoposOrder(sorted) };
    });
  };

  const handleNew = () => {
    setData(defaultData);
    setPropostaDbId(null);
    setStatusMsg(null);
    setActiveTab('editor');
  };

  const handleOpenSaved = async (id: string) => {
    const res = await fetch(`/api/propostas/${id}`, { cache: 'no-store' });
    if (!res.ok) return;
    const json = (await res.json().catch(() => null)) as
      | {
          id: string;
          proposta: PropostaComercialData;
        }
      | null;
    if (!json) return;
    setPropostaDbId(json.id);
    setData(json.proposta);
    setListOpen(false);
    setStatusMsg(null);
    setActiveTab('editor');
  };

  const handleDeleteSaved = async (id: string) => {
    if (!window.confirm('Excluir esta proposta?')) return;
    const res = await fetch(`/api/propostas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (propostaDbId === id) {
        handleNew();
      }
      await refreshList();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const url = propostaDbId ? `/api/propostas/${propostaDbId}` : '/api/propostas';
      const method = propostaDbId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ proposta: data }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!res.ok) {
        setStatusMsg(json.error ?? 'Erro ao salvar no Supabase');
        return;
      }

      if (json.id) setPropostaDbId(json.id);
      setStatusMsg('Salvo no Supabase');
      setTimeout(() => setStatusMsg(null), 2400);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    setActiveTab('preview');
    setTimeout(() => window.print(), 50);
  };

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: auto; }
          body { background: white; }
          body * { visibility: hidden; }
          #preview-doc, #preview-doc * { visibility: visible; }
          #preview-doc {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 40px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#0D0F14] font-sans text-[#E8EAF0] flex flex-col">
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
                  (data.numeroProposta ? `Proposta #${data.numeroProposta}` : 'Novo documento')}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleNew}
              className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39955] hover:text-[#34D399] hover:bg-transparent"
              title="Novo documento"
            >
              <FilePlus2 className="size-4" />
              Novo
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setListOpen(true);
                refreshList();
              }}
              className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D39944] hover:text-[#34D399] hover:bg-transparent"
              title="Consultar propostas salvas"
            >
              <FolderOpen className="size-4" />
              Propostas
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab('editor')}
              className={`h-auto px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 hover:bg-transparent ${activeTab === 'editor' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
            >
              <Pencil className="size-4" />
              Editor
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab('preview')}
              className={`h-auto px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 hover:bg-transparent ${activeTab === 'preview' ? 'bg-[#34D399] text-[#0B0D12] hover:bg-[#34D399] hover:text-[#0B0D12]' : 'bg-transparent text-[#6B7280]'}`}
            >
              <Eye className="size-4" />
              Preview
            </Button>
            <div className="w-px h-5 bg-[#1E2130] mx-1" />
            <Button
              type="button"
              variant="ghost"
              onClick={handleSave}
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
              onClick={handlePrint}
              className="h-auto px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#34D399] hover:text-[#34D399] hover:bg-transparent"
            >
              <Download className="size-4" />
              PDF
            </Button>
          </div>
        </header>

        {statusMsg && (
          <div className="px-8 py-3 border-b border-[#1E2130] text-[12px] text-[#9CA3AF] bg-[#13161D] print:hidden">
            {statusMsg}
          </div>
        )}

	        {listOpen && (
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
                  onClick={() => setListOpen(false)}
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

                {propostas.map((p) => (
                  <div key={p.id} className="p-5 flex items-center gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleOpenSaved(p.id)}
                      className="h-auto flex-1 text-left justify-start px-0 py-0 hover:bg-transparent"
                    >
                      <div className="text-sm font-medium text-[#E8EAF0] truncate">
                        Proposta #{p.numeroProposta ?? '—'} · Rev.{' '}
                        {p.revisao ?? '—'}
                      </div>
                      <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                        {p.status || '—'}{' '}
                        {p.dataProposta ? `· ${p.dataProposta}` : ''}
                        {p.updatedAt ? ` · atualizado ${new Date(p.updatedAt).toLocaleString('pt-BR')}` : ''}
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => handleDeleteSaved(p.id)}
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
                  onClick={() => {
                    handleNew();
                    setListOpen(false);
                  }}
                  className="h-9 px-4 rounded-lg bg-[#34D399] text-[#0B0D12] text-[12px] font-medium hover:bg-[#34D399] hover:text-[#0B0D12]"
                >
                  Novo
                </Button>
              </div>
            </div>
          </div>
	        )}

	        {escoposCatalogoOpen && (
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
	                  onClick={() => setEscoposCatalogoOpen(false)}
	                  className="h-auto w-auto text-[#6B7280] hover:text-[#E8EAF0] px-2 py-1 rounded hover:bg-transparent"
	                >
	                  ✕
	                </Button>
	              </div>

	              <div className="px-6 py-4 border-b border-[#1E2130]">
	                <input
	                  value={escoposCatalogoQuery}
	                  onChange={(e) => setEscoposCatalogoQuery(e.target.value)}
	                  placeholder="Buscar escopo..."
	                  className="w-full h-[48px] bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-all duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 hover:border-[#252A3A] focus-visible:border-[#34D399] focus-visible:ring-[3px] focus-visible:ring-[#34D39922]"
	                />
	              </div>

	              <div className="max-h-[60vh] overflow-auto divide-y divide-[#1E2130]">
	                {escoposCatalogo
	                  .filter((e) => {
	                    const q = escoposCatalogoQuery.trim().toLowerCase();
	                    if (!q) return true;
	                    return (
	                      e.nome.toLowerCase().includes(q) ||
	                      e.descricao.toLowerCase().includes(q) ||
	                      e.tipoCobranca.toLowerCase().includes(q)
	                    );
	                  })
	                  .map((e) => {
	                    const already = data.escopos.some(
	                      (s) => s.escopoId === e.id,
	                    );
	                    return (
	                      <div
	                        key={e.id}
	                        className="p-5 flex items-start gap-3"
	                      >
	                        <Button
	                          type="button"
	                          variant="ghost"
	                          onClick={() => addEscopo(e)}
	                          disabled={already}
	                          className="h-auto flex-1 text-left justify-start px-0 py-0 hover:bg-transparent disabled:opacity-60"
	                        >
	                          <div className="text-sm font-medium text-[#E8EAF0] truncate">
	                            {e.nome}
	                          </div>
	                          <div className="text-[11px] text-[#6B7280] font-mono mt-1">
	                            {e.tipoCobranca || 'Escopo'}
	                            {e.unidadeLabel ? ` · ${e.unidadeLabel}` : ''}
	                            {e.descricao ? ` · ${e.descricao}` : ''}
	                          </div>
	                        </Button>
	                        <Button
	                          type="button"
	                          variant="ghost"
	                          size="xs"
	                          onClick={() => addEscopo(e)}
	                          disabled={already}
	                          className={`h-8 px-3 rounded-lg border ${
	                            already
	                              ? 'border-[#252A3A] text-[#6B7280] bg-transparent hover:bg-transparent'
	                              : 'border-[#34D39944] text-[#34D399] bg-[#34D39918] hover:bg-[#34D39933] hover:text-[#34D399]'
	                          }`}
	                        >
	                          <Plus className="size-4" />
	                          {already ? 'Adicionado' : 'Adicionar'}
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
	                  onClick={() => setEscoposCatalogoOpen(false)}
	                  className="h-9 px-4 rounded-lg bg-[#34D399] text-[#0B0D12] text-[12px] font-medium hover:bg-[#34D399] hover:text-[#0B0D12]"
	                >
	                  Concluir
	                </Button>
	              </div>
	            </div>
	          </div>
	        )}

	        <div className="flex-1 overflow-auto">
          <div
            className={`grid grid-cols-[360px_1fr] min-h-[calc(100vh-60px)] ${activeTab === 'preview' ? 'hidden' : ''} print:hidden`}
          >
            <div className="border-r border-[#1E2130] p-[28px_24px] overflow-y-auto bg-[#13161D]">
              <div className="text-[10px] font-mono text-[#34D399] tracking-[0.15em] uppercase mb-5 pb-3.5 border-b border-[#1E2130]">
                Informações gerais
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Field
                  label="Número"
                  value={data.numeroProposta}
                  onChange={(v) => setData((d) => ({ ...d, numeroProposta: v }))}
                  placeholder="Ex: 1024"
                />
                <Field
                  label="Revisão"
                  value={data.revisao}
                  onChange={(v) => setData((d) => ({ ...d, revisao: v }))}
                  placeholder="0"
                />
              </div>

              <SelectField
                label="Status"
                value={data.status}
                onChange={(v) => setData((d) => ({ ...d, status: v }))}
                options={statusOptions}
                placeholder="Selecione o status"
              />

              <Field
                label="Cidade"
                value={data.cidade}
                onChange={(v) => setData((d) => ({ ...d, cidade: v }))}
                placeholder="Ex: São Paulo"
              />

              <SelectField
                label="Cliente"
                value={data.clienteId}
                onChange={(v) => setData((d) => ({ ...d, clienteId: v }))}
                options={clientes.map((c) => ({
                  value: c.id,
                  label: c.razaoSocial || c.id,
                }))}
                placeholder="Selecione o cliente"
              />

              <SelectField
                label="Assessor"
                value={data.assessorId}
                onChange={(v) => setData((d) => ({ ...d, assessorId: v }))}
                options={assessores.map((a) => ({
                  value: a.id,
                  label: a.nome || a.id,
                }))}
                placeholder="Selecione o assessor"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="mb-4">
                  <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                    Data da proposta
                  </label>
	                  <DatePicker
	                    value={data.dataProposta}
	                    onChange={(v) => setData((d) => ({ ...d, dataProposta: v }))}
	                    placeholder="dd/mm/aaaa"
	                    accentColor="#34D399"
	                  />
                </div>
                <Field
                  label="Prazo (meses)"
                  value={data.prazoContratoMeses}
                  onChange={(v) =>
                    setData((d) => ({ ...d, prazoContratoMeses: v }))
                  }
                  placeholder="Ex: 12"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="mb-4">
                  <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                    Data do aceite
                  </label>
	                  <DatePicker
	                    value={data.dataAceite}
	                    onChange={(v) => setData((d) => ({ ...d, dataAceite: v }))}
	                    placeholder="dd/mm/aaaa"
	                    accentColor="#34D399"
	                  />
                </div>
                <Field
                  label="Total mensal"
                  value={data.valorTotalMensal}
                  onChange={(v) =>
                    setData((d) => ({ ...d, valorTotalMensal: v }))
                  }
                  placeholder="Ex: 4500"
                />
              </div>

              <Field
                label="Responsável (aceite)"
                value={data.nomeResponsavelAssinatura}
                onChange={(v) =>
                  setData((d) => ({ ...d, nomeResponsavelAssinatura: v }))
                }
                placeholder="Nome do responsável"
              />

              <TextAreaField
                label="Observações"
                value={data.observacoes}
                onChange={(v) => setData((d) => ({ ...d, observacoes: v }))}
                placeholder="Notas adicionais, condições, links..."
                rows={4}
              />
            </div>

	            <div className="p-[28px_32px] overflow-y-auto">
	              <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-[#1E2130]">
	                <div className="text-[10px] font-mono text-[#34D399] tracking-[0.15em] uppercase">
	                  Escopos
	                </div>
	                <span className="text-[11px] font-mono text-[#6B7280]">
	                  Selecione e defina valores
	                </span>
	              </div>
	              {data.escopos.length === 0 && (
	                <div className="text-center p-[56px_24px] text-[#6B7280] text-sm border border-dashed border-[#1E2130] rounded-xl mb-4">
	                  <div className="text-4xl mb-3 opacity-35">
	                    <ClipboardList className="mx-auto size-10" />
	                  </div>
	                  <div className="mb-1.5 font-medium">
	                    Nenhum escopo adicionado
	                  </div>
	                  <div className="text-xs text-[#1E2130]">
	                    Clique em &quot;Adicionar escopo&quot; para começar
	                  </div>
	                </div>
	              )}

	              {data.escopos
	                .slice()
	                .sort((a, b) => a.ordem - b.ordem)
	                .map((s, index) => (
	                  <div
	                    key={`${s.escopoId}-${index}`}
	                    className="p-4 bg-[#191C25] border border-[#252A3A] rounded-[10px] mb-2"
	                  >
	                    <div className="flex items-start justify-between gap-3">
	                      <div className="flex items-start gap-3">
	                        <div className="min-w-[28px] h-7 rounded-full bg-gradient-to-br from-[#34D399] to-[#4F7EFF] flex items-center justify-center text-[11px] font-bold text-white font-mono shrink-0 mt-0.5">
	                          {String(index + 1).padStart(2, '0')}
	                        </div>
	                        <div className="flex-1 min-w-0">
	                          <div className="text-[13px] font-sans font-medium text-[#E8EAF0] truncate">
	                            {s.nome}
	                          </div>
	                          <div className="text-[11px] font-mono text-[#6B7280] mt-0.5">
	                            {s.tipoCobranca ? s.tipoCobranca : 'Escopo'}
	                            {s.unidadeLabel ? ` · ${s.unidadeLabel}` : ''}
	                          </div>
	                        </div>
	                      </div>

	                      <div className="flex items-center gap-1.5 shrink-0">
	                        <Button
	                          type="button"
	                          variant="ghost"
	                          size="icon-xs"
	                          onClick={() => moveEscopo(index, Math.max(0, index - 1))}
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
	                            moveEscopo(
	                              index,
	                              Math.min(data.escopos.length - 1, index + 1),
	                            )
	                          }
	                          disabled={index === data.escopos.length - 1}
	                          className="bg-transparent hover:bg-transparent text-[#6B7280] hover:text-[#E8EAF0] disabled:opacity-30"
	                          title="Mover para baixo"
	                        >
	                          <ChevronDown className="size-3.5" />
	                        </Button>
	                        <Button
	                          type="button"
	                          variant="ghost"
	                          size="icon-xs"
	                          onClick={() => removeEscopo(index)}
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
	                          value={s.periodicidade}
	                          onChange={(e) =>
	                            updateEscopoAt(index, {
	                              periodicidade: e.target.value,
	                            })
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
	                          value={s.valorNegociado}
	                          onChange={(e) =>
	                            updateEscopoAt(index, {
	                              valorNegociado: e.target.value,
	                            })
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
	                        value={s.observacao}
	                        onChange={(e) =>
	                          updateEscopoAt(index, { observacao: e.target.value })
	                        }
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
	                onClick={() => setEscoposCatalogoOpen(true)}
	                className="h-auto w-full p-3.5 bg-[#34D39918] border border-dashed border-[#34D39944] rounded-xl text-[#34D399] text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 mt-1 hover:bg-[#34D39933] hover:text-[#34D399]"
	              >
	                <Plus className="size-4" />
	                Adicionar escopo
	              </Button>
	            </div>
	          </div>

          <div
            className={`${activeTab === 'preview' ? 'block' : 'hidden'} print:block p-[40px_32px] bg-[#0D0F14] min-h-full print:p-0 print:bg-white`}
          >
            <Preview
              proposta={data}
              cliente={selectedCliente}
              assessor={selectedAssessor}
            />
          </div>
        </div>
      </div>
    </>
  );
}
