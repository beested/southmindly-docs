'use client';

import { AgendaItem, PautaData } from '@/types/docs';
import { useCallback, useEffect, useState } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface PautaReuniaoProps {
  onBack: () => void;
  openSavedPautasToken?: number;
  openSavedPautaId?: string;
}

const generateId = (): string => Math.random().toString(36).substring(2, 9);

const generateDocId = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `SM-${y}${m}${d}-${rand}`;
};

// â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#4F7EFF]' : 'text-[#6B7280]'}`}
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
        className={`w-full bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none transition-colors duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 ${focused ? 'border-[#4F7EFF]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: TextAreaFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      <label
        className={`block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 transition-colors duration-200 ${focused ? 'text-[#4F7EFF]' : 'text-[#6B7280]'}`}
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
        className={`w-full bg-[#191C25] border rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none resize-y transition-colors duration-200 placeholder:text-[#6B7280] placeholder:opacity-55 ${focused ? 'border-[#4F7EFF]' : 'border-[#1E2130]'}`}
      />
    </div>
  );
}

interface AgendaItemRowProps {
  item: AgendaItem;
  index: number;
  onChange: (item: AgendaItem) => void;
  onRemove: () => void;
}

function AgendaItemRow({
  item,
  index,
  onChange,
  onRemove,
}: AgendaItemRowProps) {
  const [hoverRemove, setHoverRemove] = useState(false);

  // Helper to handle topics as a single text block for editing, splitting by newline
  const topicsText = item.topicos ? item.topicos.join('\n') : '';
  const updateTopics = (text: string) => {
    const lines = text.split('\n');
    onChange({ ...item, topicos: lines });
  };

  return (
    <div className="flex gap-3 items-start p-4 bg-[#191C25] border border-[#252A3A] rounded-[10px] mb-2">
      <div className="min-w-[28px] h-7 rounded-full bg-gradient-to-br from-[#4F7EFF] to-[#A78BFA] flex items-center justify-center text-[11px] font-bold text-white font-mono shrink-0 mt-0.5">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <input
          value={item.titulo}
          onChange={(e) => onChange({ ...item, titulo: e.target.value })}
          placeholder="TÃ­tulo do ponto de pauta..."
          className="bg-transparent border-none outline-none text-[#E8EAF0] text-sm font-sans font-medium w-full placeholder:text-[#6B7280] placeholder:opacity-55"
        />
        <div className="flex gap-2.5">
          <input
            value={item.responsavel}
            onChange={(e) => onChange({ ...item, responsavel: e.target.value })}
            placeholder="ResponsÃ¡vel"
            className="bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-1.5 text-[#9CA3AF] text-xs font-mono outline-none flex-1 placeholder:text-[#6B7280] placeholder:opacity-55"
          />
          <input
            value={item.duracao}
            onChange={(e) => onChange({ ...item, duracao: e.target.value })}
            placeholder="DuraÃ§Ã£o"
            className="bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-1.5 text-[#9CA3AF] text-xs font-mono outline-none w-[150px] placeholder:text-[#6B7280] placeholder:opacity-55"
          />
        </div>

        <textarea
          value={topicsText}
          onChange={(e) => updateTopics(e.target.value)}
          placeholder="TÃ³picos (um por linha)..."
          rows={3}
          className="bg-[#0D0F1488] border border-[#1E2130] rounded-md px-2.5 py-1.5 text-[#9CA3AF] text-xs font-sans outline-none w-full resize-y placeholder:text-[#6B7280] placeholder:opacity-55"
        />
      </div>

      <button
        onClick={onRemove}
        onMouseEnter={() => setHoverRemove(true)}
        onMouseLeave={() => setHoverRemove(false)}
        className={`bg-transparent border-none cursor-pointer p-1 rounded text-sm leading-none shrink-0 transition-colors duration-200 ${hoverRemove ? 'text-[#F87171]' : 'text-[#6B7280]'}`}
      >
        ✕
      </button>
    </div>
  );
}

// â”€â”€ Preview (light document) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface PreviewProps {
  data: PautaData;
  docId: string;
}

function Preview({ data, docId }: PreviewProps) {
  return (
    <div
      id="preview-doc"
      className="bg-white rounded-xl p-[52px_56px] pb-[132px] font-sans text-[#111] max-w-[720px] mx-auto shadow-[0_4px_48px_rgba(0,0,0,0.35)] relative overflow-hidden print:shadow-none print:m-0 print:max-w-none print:w-full print:rounded-none print:p-[40px] print:pb-[120px]"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-purple-800">
        <h1 className="font-sans text-4xl font-bold text-black m-0 leading-tight">
          Pauta de Reunião
        </h1>
        <img src="/logo-icon.png" alt="SouthMindly" className="h-12 w-auto" />
      </div>
      <div className="text-[10px] font-mono text-gray-500 mb-6">
        Documento: {docId}
      </div>

      {/* Info Header */}
      <div className="flex justify-between items-start mb-12 text-sm">
        <div>
          <span className="font-bold mr-1">Participantes:</span>
          {data.participantes}
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex gap-1">
            <span className="font-bold">Data:</span>
            <span>{data.data || '—'}</span>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">Horário:</span>
            <span>{data.horario || '—'}</span>
          </div>
          <div className="italic mt-1">
            {data.local || 'Google Meet - Gravação da reunião'}
          </div>
        </div>
      </div>

      {/* Objectives */}
      {data.objetivo && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-black">
            Objetivos dessa reuniÃ£o:
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {data.objetivo
              .split('\n')
              .filter((line) => line.trim())
              .map((line, i) => (
                <li key={i} className="text-sm leading-relaxed text-[#374151]">
                  {line}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Topics / Agenda Items */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4 text-black">
          Assuntos a serem tratados
        </h2>

        <div className="space-y-6">
          {data.itens.map((item, i) => (
            <div key={item.id}>
              <div className="font-bold text-[#111] text-sm mb-1">
                {item.titulo || `Ponto ${i + 1}`}
              </div>

              {item.topicos && item.topicos.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {item.topicos
                    .filter((t) => t.trim())
                    .map((topico, idx) => (
                      <li
                        key={idx}
                        className="text-sm leading-relaxed text-[#374151]"
                      >
                        {topico}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic pl-5">
                  Sem tÃ³picos detalhados.
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Page Number */}
      <div
        id="preview-doc-footer"
        className="fixed bottom-10 left-14 right-14 z-50 bg-white border-t border-gray-300 pt-2 flex items-center justify-between gap-4 text-[10px] font-bold text-black print:fixed print:bottom-10 print:left-10 print:right-10"
      >
        <div className="min-w-0 truncate">
          PAUTA REUNIÃO | {data.titulo ? data.titulo.toUpperCase() : 'GERAL'} -{' '}
          {new Date().getFullYear()}
        </div>
        <div className="shrink-0 whitespace-nowrap">Pág. 1/1</div>
      </div>
    </div>
  );
}

// â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const EMPTY_DATA: PautaData = {
  titulo: '',
  data: '',
  horario: '',
  local: '',
  participantes: '',
  objetivo: '',
  observacoes: '',
  itens: [],
};

type PautaListItem = {
  id: string;
  docId: string;
  titulo: string;
  updatedAt: string;
  createdAt: string;
};

export default function PautaReuniao({
  onBack,
  openSavedPautasToken,
  openSavedPautaId,
}: PautaReuniaoProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [data, setData] = useState<PautaData>(EMPTY_DATA);
  const [docId, setDocId] = useState<string>(generateDocId);
  const [pautaDbId, setPautaDbId] = useState<string | null>(null);
  const [pautas, setPautas] = useState<PautaListItem[]>([]);
  const [listOpen, setListOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof PautaData>(field: K, value: PautaData[K]) => {
      setData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addItem = useCallback(() => {
    const newItem: AgendaItem = {
      id: generateId(),
      titulo: '',
      responsavel: '',
      duracao: '',
      topicos: [],
    };
    setData((prev) => ({ ...prev, itens: [...prev.itens, newItem] }));
  }, []);

  const updateItem = useCallback((id: string, updated: AgendaItem) => {
    setData((prev) => ({
      ...prev,
      itens: prev.itens.map((it) => (it.id === id ? updated : it)),
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      itens: prev.itens.filter((it) => it.id !== id),
    }));
  }, []);

  const handlePrint = () => window.print();

  const refreshList = useCallback(async () => {
    const res = await fetch('/api/pautas', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: PautaListItem[];
      error?: string;
    };

    if (!res.ok) {
      setStatusMsg(json.error ?? 'Erro ao carregar pautas');
      return;
    }

    setPautas(Array.isArray(json.items) ? json.items : []);
  }, []);

  useEffect(() => {
    if (!openSavedPautasToken) return;
    setListOpen(true);
    refreshList();
  }, [openSavedPautasToken, refreshList]);

  useEffect(() => {
    if (!openSavedPautaId) return;
    handleOpenSaved(openSavedPautaId);
  }, [openSavedPautaId]);

  const handleNew = () => {
    setPautaDbId(null);
    setDocId(generateDocId());
    setData({ ...EMPTY_DATA, itens: [] });
    setStatusMsg(null);
    setActiveTab('editor');
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(
        pautaDbId ? `/api/pautas/${pautaDbId}` : '/api/pautas',
        {
          method: pautaDbId ? 'PUT' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ docId, pauta: data }),
        },
      );

      const json = (await res.json().catch(() => ({}))) as
        | { id: string }
        | { error?: string };

      if (!res.ok) {
        setStatusMsg((json as { error?: string }).error ?? 'Erro ao salvar');
        return;
      }

      setPautaDbId((json as { id: string }).id);
      setStatusMsg('Salvo no Supabase');
      await refreshList();
    } finally {
      setSaving(false);
    }
  };

  const handleOpenSaved = async (id: string) => {
    const res = await fetch(`/api/pautas/${id}`, { cache: 'no-store' });
    if (!res.ok) return;
    const json = (await res.json()) as {
      id: string;
      docId: string;
      pauta: PautaData;
    };

    setPautaDbId(json.id);
    setDocId(json.docId);
    setData(json.pauta);
    setListOpen(false);
    setActiveTab('editor');
    setStatusMsg(null);
  };

  const handleDeleteSaved = async (id: string) => {
    if (!window.confirm('Excluir esta pauta?')) return;
    const res = await fetch(`/api/pautas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      if (pautaDbId === id) {
        handleNew();
      }
      await refreshList();
    }
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
        {/* Topbar */}
        <header className="border-b border-[#1E2130] px-8 flex items-center justify-between h-[60px] bg-[#0D0F14EE] backdrop-blur-md shrink-0 print:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="bg-transparent border-none text-[#6B7280] cursor-pointer text-lg p-1 px-2 flex items-center transition-colors duration-200 hover:text-[#E8EAF0]"
            >
              ←
            </button>
            <div className="w-px h-5 bg-[#1E2130]" />
            <div>
              <div className="text-[10px] font-mono text-[#6B7280] tracking-[0.1em] uppercase">
                Pauta de Reunião
              </div>
              <div className="text-[13px] font-sans text-[#E8EAF0] font-medium">
                {data.titulo || 'Novo documento'}
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={handleNew}
              className="px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#A78BFA55] hover:text-[#A78BFA]"
              title="Novo documento"
            >
              ＋ Novo
            </button>
            <button
              onClick={() => {
                setListOpen(true);
                refreshList();
              }}
              className="px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#4F7EFF44] hover:text-[#4F7EFF]"
              title="Consultar pautas salvas"
            >
              📂 Pautas
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 ${activeTab === 'editor' ? 'bg-[#4F7EFF] text-white' : 'bg-transparent text-[#6B7280]'}`}
            >
              ✏️ Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-sans font-medium transition-all duration-200 ${activeTab === 'preview' ? 'bg-[#4F7EFF] text-white' : 'bg-transparent text-[#6B7280]'}`}
            >
              👁 Preview
            </button>
            <div className="w-px h-5 bg-[#1E2130] mx-1" />
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4.5 py-1.5 rounded-lg border border-[#4F7EFF44] cursor-pointer text-[13px] font-sans font-medium bg-[#4F7EFF18] text-[#4F7EFF] transition-all duration-200 hover:bg-[#4F7EFF33] disabled:opacity-60"
              title="Salvar no Supabase"
            >
              💾 {pautaDbId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              onClick={handlePrint}
              className="px-4.5 py-1.5 rounded-lg border border-[#252A3A] cursor-pointer text-[13px] font-sans font-medium bg-transparent text-[#9CA3AF] transition-all duration-200 hover:border-[#4F7EFF] hover:text-[#4F7EFF]"
            >
              ⬇ PDF
            </button>
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
                    Minhas pautas
                  </div>
                  <div className="text-sm font-medium text-[#E8EAF0]">
                    Selecione para abrir ou excluir
                  </div>
                </div>
                <button
                  onClick={() => setListOpen(false)}
                  className="text-[#6B7280] hover:text-[#E8EAF0] px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-[60vh] overflow-auto divide-y divide-[#1E2130]">
                {pautas.length === 0 && (
                  <div className="p-6 text-sm text-[#6B7280]">
                    Nenhuma pauta salva ainda.
                  </div>
                )}

                {pautas.map((p) => (
                  <div key={p.id} className="p-5 flex items-center gap-3">
                    <button
                      onClick={() => handleOpenSaved(p.id)}
                      className="flex-1 text-left"
                    >
                      <div className="text-sm font-medium text-[#E8EAF0] truncate">
                        {p.titulo || 'Sem título'}
                      </div>
                      <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                        {p.docId} · atualizado{' '}
                        {new Date(p.updatedAt).toLocaleString('pt-BR')}
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteSaved(p.id)}
                      className="h-9 px-3 rounded-lg border border-[#252A3A] bg-transparent text-[#F87171] text-[12px] font-medium hover:border-[#F8717133]"
                      title="Excluir"
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-[#1E2130] flex items-center justify-between">
                <div className="text-[11px] text-[#6B7280] font-mono">
                  {pautas.length} {pautas.length === 1 ? 'item' : 'itens'}
                </div>
                <button
                  onClick={() => {
                    handleNew();
                    setListOpen(false);
                  }}
                  className="h-9 px-4 rounded-lg bg-[#4F7EFF] text-white text-[12px] font-medium"
                >
                  Novo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div
            className={`grid grid-cols-[340px_1fr] min-h-[calc(100vh-60px)] ${activeTab === 'preview' ? 'hidden' : ''} print:hidden`}
          >
            {/* Left panel: form */}
            <div className="border-r border-[#1E2130] p-[28px_24px] overflow-y-auto bg-[#13161D]">
              <div className="text-[10px] font-mono text-[#4F7EFF] tracking-[0.15em] uppercase mb-5 pb-3.5 border-b border-[#1E2130]">
                InformaÃ§Ãµes gerais
              </div>

              <Field
                label="TÃ­tulo da ReuniÃ£o"
                value={data.titulo}
                onChange={(v) => updateField('titulo', v)}
                placeholder="Ex: Alinhamento Q2 â€“ Produto"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <div className="mb-4">
                  <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
                    Data
                  </label>
                  <DatePicker
                    value={data.data}
                    onChange={(v) => updateField('data', v)}
                    placeholder="dd/mm/aaaa"
                  />
                </div>
                <Field
                  label="HorÃ¡rio"
                  value={data.horario}
                  onChange={(v) => {
                    let val = v.replace(/\D/g, '');
                    if (val.length > 4) val = val.substring(0, 4);
                    if (val.length > 2)
                      val = val.replace(/(\d{2})(\d{0,2})/, '$1:$2');
                    updateField('horario', val);
                  }}
                  placeholder="00:00"
                />
              </div>

              <Field
                label="Local / Link"
                value={data.local}
                onChange={(v) => updateField('local', v)}
                placeholder="Sala 01 ou meet.google.com/..."
              />

              <Field
                label="Participantes"
                value={data.participantes}
                onChange={(v) => updateField('participantes', v)}
                placeholder="Nome 1, Nome 2, Nome 3..."
              />

              <div className="text-[10px] font-mono text-[#4F7EFF] tracking-[0.15em] uppercase margin-[24px_0_16px] pt-5 pb-3.5 border-y border-[#1E2130] mt-6 mb-4">
                Contexto
              </div>

              <TextAreaField
                label="Objetivo da ReuniÃ£o"
                value={data.objetivo}
                onChange={(v) => updateField('objetivo', v)}
                placeholder="Listar objetivos (um por linha)..."
              />
              <TextAreaField
                label="ObservaÃ§Ãµes"
                value={data.observacoes}
                onChange={(v) => updateField('observacoes', v)}
                placeholder="Notas adicionais, links ou avisos..."
              />
            </div>

            {/* Right panel: agenda items */}
            <div className="p-[28px_32px] overflow-y-auto">
              <div className="flex justify-between items-center mb-5 pb-3.5 border-b border-[#1E2130]">
                <div className="text-[10px] font-mono text-[#4F7EFF] tracking-[0.15em] uppercase">
                  Pontos de Pauta
                </div>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {data.itens.length}{' '}
                  {data.itens.length === 1 ? 'item' : 'itens'}
                </span>
              </div>

              {data.itens.length === 0 && (
                <div className="text-center p-[56px_24px] text-[#6B7280] text-sm border border-dashed border-[#1E2130] rounded-xl mb-4">
                  <div className="text-4xl mb-3 opacity-35">📋</div>
                  <div className="mb-1.5 font-medium">
                    Nenhum ponto de pauta
                  </div>
                  <div className="text-xs text-[#1E2130]">
                    Clique em &quot;Adicionar item&quot; para comeÃ§ar
                  </div>
                </div>
              )}

              {data.itens.map((item, i) => (
                <AgendaItemRow
                  key={item.id}
                  item={item}
                  index={i}
                  onChange={(updated) => updateItem(item.id, updated)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}

              <button
                onClick={addItem}
                className="w-full p-3.5 bg-[#4F7EFF18] border border-dashed border-[#4F7EFF44] rounded-xl text-[#4F7EFF] text-[13px] font-sans font-medium cursor-pointer transition-colors duration-200 mt-1 hover:bg-[#4F7EFF33]"
              >
                + Adicionar item
              </button>
            </div>
          </div>

          {/* Preview Container (Visible in Preview Tab OR Print Mode) */}
          <div
            className={`${activeTab === 'preview' ? 'block' : 'hidden'} print:block p-[40px_32px] bg-[#0D0F14] min-h-full print:p-0 print:bg-white`}
          >
            <Preview data={data} docId={docId} />
          </div>
        </div>
      </div>
    </>
  );
}
