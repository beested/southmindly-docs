'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getFirstZodErrorMessage,
  normalizeLoadedProposta,
  propostaComercialSchema,
} from '@/lib/schemas/proposta-comercial';
import { PropostaComercialData, PropostaEscopoData } from '@/types/docs';

import { defaultData, printStyles, statusOptions } from './constants';
import { EscoposCatalogModal } from './escopos-catalog-modal';
import { EscoposEditor } from './escopos-editor';
import { GeneralInfoPanel } from './general-info-panel';
import { PropostaHeader } from './header';
import { PropostaPreview } from './preview';
import { PropostasModal } from './propostas-modal';
import {
  ClienteItem,
  EscopoCatalogItem,
  PropostaComercialProps,
  PropostaListItem,
  PropostaResponse,
} from './types';
import { normalizeEscoposOrder } from './utils';

export default function PropostaComercial({ onBack }: PropostaComercialProps) {
  const [data, setData] = useState<PropostaComercialData>(defaultData);
  const [propostaDbId, setPropostaDbId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [creatingNewFromList, setCreatingNewFromList] = useState(false);
  const [openingPropostaId, setOpeningPropostaId] = useState<string | null>(
    null,
  );
  const [deletingPropostaId, setDeletingPropostaId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [clientes, setClientes] = useState<ClienteItem[]>([]);
  const [escoposCatalogo, setEscoposCatalogo] = useState<EscopoCatalogItem[]>(
    [],
  );
  const [escoposCatalogoOpen, setEscoposCatalogoOpen] = useState(false);
  const [escoposCatalogoQuery, setEscoposCatalogoQuery] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [propostas, setPropostas] = useState<PropostaListItem[]>([]);

  const selectedCliente = useMemo(
    () => clientes.find((cliente) => cliente.id === data.clienteId),
    [clientes, data.clienteId],
  );

  const refreshClientes = useCallback(async () => {
    const res = await fetch('/api/clientes', { cache: 'no-store' });
    const json = (await res.json().catch(() => ({}))) as {
      items?: ClienteItem[];
    };
    setClientes(Array.isArray(json.items) ? json.items : []);
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
    refreshEscoposCatalogo();
  }, [refreshClientes, refreshEscoposCatalogo]);

  const updateData = useCallback((patch: Partial<PropostaComercialData>) => {
    setData((current) => ({ ...current, ...patch }));
  }, []);

  const addEscopo = useCallback((escopo: EscopoCatalogItem) => {
    setData((current) => {
      if (current.escopos.some((item) => item.escopoId === escopo.id)) {
        return current;
      }

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
        ordem: current.escopos.length,
      };

      return {
        ...current,
        escopos: normalizeEscoposOrder([...current.escopos, next]),
      };
    });
  }, []);

  const removeEscopo = useCallback((index: number) => {
    setData((current) => ({
      ...current,
      escopos: normalizeEscoposOrder(
        current.escopos.filter((_, currentIndex) => currentIndex !== index),
      ),
    }));
  }, []);

  const moveEscopo = useCallback((from: number, to: number) => {
    setData((current) => {
      const items = current.escopos.slice();
      const item = items[from];
      if (!item) return current;

      items.splice(from, 1);
      items.splice(to, 0, item);

      return {
        ...current,
        escopos: normalizeEscoposOrder(items),
      };
    });
  }, []);

  const updateEscopoAt = useCallback(
    (sortedIndex: number, patch: Partial<PropostaEscopoData>) => {
      setData((current) => {
        const sorted = current.escopos
          .slice()
          .sort((a, b) => a.ordem - b.ordem);
        const existing = sorted[sortedIndex];
        if (!existing) return current;

        sorted[sortedIndex] = { ...existing, ...patch };

        return {
          ...current,
          escopos: normalizeEscoposOrder(sorted),
        };
      });
    },
    [],
  );

  const handleNew = useCallback(() => {
    setData(defaultData);
    setPropostaDbId(null);
    setStatusMsg(null);
    setActiveTab('editor');
  }, []);

  const handleCreateNewFromList = useCallback(async () => {
    setCreatingNewFromList(true);
    setStatusMsg('Preparando nova proposta...');

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });

      handleNew();
      setListOpen(false);
    } finally {
      setCreatingNewFromList(false);
    }
  }, [handleNew]);

  const handleOpenSaved = useCallback(async (id: string) => {
    try {
      setOpeningPropostaId(id);
      setStatusMsg('Carregando proposta...');

      const res = await fetch(`/api/propostas/${id}`, { cache: 'no-store' });
      if (!res.ok) {
        setStatusMsg('Erro ao carregar proposta');
        return;
      }

      const json = (await res.json().catch(() => null)) as PropostaResponse;
      if (!json) {
        setStatusMsg('Erro ao carregar proposta');
        return;
      }

      const proposta = normalizeLoadedProposta(json.proposta);

      setPropostaDbId(json.id);
      setData(proposta);
      setListOpen(false);
      setStatusMsg(null);
      setActiveTab('editor');
    } catch (error) {
      if (error instanceof Error) {
        setStatusMsg(error.message);
        return;
      }

      setStatusMsg('Erro ao carregar proposta');
      return;
    } finally {
      setOpeningPropostaId(null);
    }
  }, []);

  const handleDeleteSaved = useCallback(
    async (id: string) => {
      setDeletingPropostaId(id);
      setStatusMsg('Excluindo proposta...');

      try {
        const res = await fetch(`/api/propostas/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          setStatusMsg('Erro ao excluir proposta');
          return;
        }

        if (propostaDbId === id) {
          handleNew();
        }

        await refreshList();
        setStatusMsg('Proposta excluída');
        setTimeout(() => setStatusMsg(null), 2400);
      } finally {
        setDeletingPropostaId(null);
      }
    },
    [handleNew, propostaDbId, refreshList],
  );

  const handleSave = useCallback(async () => {
    const parsed = propostaComercialSchema.safeParse(data);
    if (!parsed.success) {
      setStatusMsg(getFirstZodErrorMessage(parsed.error));
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    try {
      const proposta = parsed.data;
      const url = propostaDbId
        ? `/api/propostas/${propostaDbId}`
        : '/api/propostas';
      const method = propostaDbId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ proposta }),
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
  }, [data, propostaDbId]);

  const handlePrint = useCallback(() => {
    setActiveTab('preview');
    setTimeout(() => {
      document.body.classList.add('printing');
      window.print();
      document.body.classList.remove('printing');
    }, 50);
  }, []);
  return (
    <>
      <style>{printStyles}</style>

      <div className="min-h-screen bg-[#0D0F14] font-sans text-[#E8EAF0] flex flex-col">
        <PropostaHeader
          onBack={onBack}
          activeTab={activeTab}
          selectedCliente={selectedCliente}
          numeroProposta={data.numeroProposta}
          propostaDbId={propostaDbId}
          saving={saving}
          onNew={handleNew}
          onOpenList={() => {
            setListOpen(true);
            refreshList();
          }}
          onSetEditor={() => setActiveTab('editor')}
          onSetPreview={() => setActiveTab('preview')}
          onSave={handleSave}
          onPrint={handlePrint}
        />

        {statusMsg && (
          <div className="border-b border-[#1E2130] bg-[#13161D] px-4 py-3 text-[12px] text-[#9CA3AF] print:hidden sm:px-6 lg:px-8">
            {statusMsg}
          </div>
        )}

        <PropostasModal
          open={listOpen}
          propostas={propostas}
          creatingNew={creatingNewFromList}
          openingId={openingPropostaId}
          deletingId={deletingPropostaId}
          onClose={() => setListOpen(false)}
          onNew={handleCreateNewFromList}
          onOpenSaved={handleOpenSaved}
          onDeleteSaved={handleDeleteSaved}
        />

        <EscoposCatalogModal
          open={escoposCatalogoOpen}
          escoposCatalogo={escoposCatalogo}
          query={escoposCatalogoQuery}
          escoposSelecionados={data.escopos}
          onClose={() => setEscoposCatalogoOpen(false)}
          onQueryChange={setEscoposCatalogoQuery}
          onAddEscopo={addEscopo}
        />

        <div className="flex-1 overflow-auto">
          <div
            className={`min-h-[calc(100vh-60px)] ${activeTab === 'preview' ? 'hidden' : 'grid'} grid-cols-1 print:hidden lg:grid-cols-[360px_1fr]`}
          >
            <GeneralInfoPanel
              data={data}
              onChange={updateData}
              clientes={clientes}
              statusOptions={statusOptions}
            />
            <EscoposEditor
              escopos={data.escopos}
              onMove={moveEscopo}
              onRemove={removeEscopo}
              onUpdate={updateEscopoAt}
              onOpenCatalog={() => setEscoposCatalogoOpen(true)}
            />
          </div>

          <div
            className={`${activeTab === 'preview' ? 'block' : 'hidden'} min-h-full bg-[#0D0F14] px-3 py-6 print:block print:bg-white print:p-0 sm:px-4 lg:p-[40px_32px]`}
          >
            <PropostaPreview proposta={data} cliente={selectedCliente} />
          </div>
        </div>
      </div>
    </>
  );
}
