'use client';

import { Button } from '@/components/ui/button';
import { DOC_DEFINITIONS, PEOPLE_DEFINITIONS } from '@/lib/docs/registry';
import { DocType } from '@/types/docs';
import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  FileText,
  Plus,
  RefreshCw,
  Rocket,
  Trash2,
} from 'lucide-react';

type PautaListItem = {
  id: string;
  docId: string;
  titulo: string;
  updatedAt: string;
  createdAt: string;
};

interface DocHomeProps {
  onSelectDoc: (doc: DocType) => void;
  onOpenSavedPauta: (id: string) => void;
}

export default function DocHome({
  onSelectDoc,
  onOpenSavedPauta,
}: DocHomeProps) {
  const stats = [
    { label: 'Documentos gerados', value: '0', icon: FileText },
    { label: 'Templates ativos', value: '1', icon: CheckCircle2 },
    { label: 'Em breve', value: '4', icon: Rocket },
  ] as const;

  const [pautas, setPautas] = useState<PautaListItem[]>([]);
  const [loadingPautas, setLoadingPautas] = useState(false);
  const [pautasError, setPautasError] = useState<string | null>(null);

  const refreshPautas = useCallback(async () => {
    setLoadingPautas(true);
    setPautasError(null);
    try {
      const res = await fetch('/api/pautas', { cache: 'no-store' });
      const json = (await res.json().catch(() => ({}))) as {
        items?: PautaListItem[];
        error?: string;
      };
      if (!res.ok) {
        setPautasError(json.error ?? 'Erro ao carregar pautas');
        setPautas([]);
        return;
      }
      setPautas(Array.isArray(json.items) ? json.items : []);
    } finally {
      setLoadingPautas(false);
    }
  }, []);

  useEffect(() => {
    refreshPautas();
  }, [refreshPautas]);

  const deletePauta = async (id: string) => {
    if (!window.confirm('Excluir esta pauta?')) return;
    const res = await fetch(`/api/pautas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      refreshPautas();
    }
  };

  return (
    <div className="p-[40px_48px] max-w-[960px] w-full text-[#E8EAF0] font-sans">
      {/* Hero */}
      <div className="mb-12">
        <div className="text-[11px] text-[#4F7EFF] tracking-[0.2em] uppercase mb-3 font-mono">
          Sistema de Documentos
        </div>

        <h1 className="text-4xl font-normal text-[#E8EAF0] mb-3 leading-tight">
          Bem-vindo ao <br />
          <img
            src="/logo-full.png"
            alt="SouthMindly Docs"
            className="h-[42px] mt-2 block"
          />
        </h1>

        <p className="text-[15px] text-[#6B7280] m-0 max-w-[520px] leading-relaxed">
          Crie, padronize e automatize seus documentos empresariais. Escolha um
          template abaixo para começar.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#13161D] border border-[#1E2130] rounded-xl p-5 flex items-center gap-4 transition-colors duration-200 hover:bg-[#191C25]"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#1E2130] border border-[#252A3A]">
              <stat.icon className="size-5 text-[#9CA3AF]" />
            </div>
            <div>
              <div className="text-[26px] font-medium text-[#E8EAF0] leading-none mb-1 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-[#6B7280] font-sans">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="text-[11px] text-[#4B5563] tracking-[0.15em] uppercase mb-5 flex items-center gap-3 font-mono">
        Templates disponíveis
        <div className="flex-1 h-px bg-[#1E2130]" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {DOC_DEFINITIONS.map((card) => (
          <div
            key={card.id}
            className={`group ${
              card.available ? 'cursor-pointer' : 'cursor-default opacity-55'
            }`}
            style={
              {
                '--card-color': card.color,
              } as React.CSSProperties
            }
            onClick={() => card.available && onSelectDoc(card.id)}
          >
            <div
              className={`bg-[#13161D] border border-[#1E2130] rounded-[14px] p-6 h-full relative overflow-hidden transition-all duration-[220ms] ease-out 
              ${
                card.available
                  ? 'group-hover:-translate-y-[3px] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-[var(--card-color)]'
                  : ''
              }`}
            >
              {/* Top accent line */}
              {card.available && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[14px]"
                  style={{
                    background: `linear-gradient(90deg, ${card.color}, ${card.color}00)`,
                  }}
                />
              )}

              <div className="flex justify-between items-start mb-4">
	              <div
	                className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
	                style={{
	                  background: card.available ? `${card.color}18` : '#1E2130',
	                  border: `1px solid ${
	                    card.available ? card.color + '33' : '#252A3A'
	                  }`,
	                }}
	              >
	                  <card.icon
	                    className="size-[22px]"
	                    style={{
	                      color: card.available ? card.color : '#6B7280',
	                    }}
	                  />
	              </div>

                {card.badge && (
                  <span className="text-[10px] bg-[#1E2130] text-[#4B5563] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono">
                    {card.badge}
                  </span>
                )}

                {card.available && (
                  <span
                    className="text-[10px] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono"
                    style={{
                      background: `${card.color}22`,
                      color: card.color,
                    }}
                  >
                    Disponível
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-semibold text-[#E8EAF0] m-0 mb-2 font-sans">
                {card.label}
              </h3>

              <p className="text-[13px] text-[#6B7280] m-0 mb-5 leading-relaxed">
                {card.description}
              </p>

              {card.available ? (
                <div
                  className="flex items-center gap-1.5 text-xs font-medium font-mono"
                  style={{ color: card.color }}
                >
                  Criar documento →
                </div>
              ) : (
                <div className="text-xs text-[#374151] font-mono">
                  Em desenvolvimento
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {PEOPLE_DEFINITIONS.length > 0 && (
        <>
          {/* Divider */}
          <div className="text-[11px] text-[#4B5563] tracking-[0.15em] uppercase mt-12 mb-5 flex items-center gap-3 font-mono">
            Pessoas
            <div className="flex-1 h-px bg-[#1E2130]" />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {PEOPLE_DEFINITIONS.map((card) => (
              <div
                key={card.id}
                className={`group ${
                  card.available
                    ? 'cursor-pointer'
                    : 'cursor-default opacity-55'
                }`}
                style={
                  {
                    '--card-color': card.color,
                  } as React.CSSProperties
                }
                onClick={() => card.available && onSelectDoc(card.id)}
              >
                <div
                  className={`bg-[#13161D] border border-[#1E2130] rounded-[14px] p-6 h-full relative overflow-hidden transition-all duration-[220ms] ease-out 
                  ${
                    card.available
                      ? 'group-hover:-translate-y-[3px] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-[var(--card-color)]'
                      : ''
                  }`}
                >
                  {/* Top accent line */}
                  {card.available && (
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[14px]"
                      style={{
                        background: `linear-gradient(90deg, ${card.color}, ${card.color}00)`,
                      }}
                    />
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
                      style={{
                        background: card.available ? `${card.color}18` : '#1E2130',
                        border: `1px solid ${
                          card.available ? card.color + '33' : '#252A3A'
                        }`,
                      }}
                    >
                      <card.icon
                        className="size-[22px]"
                        style={{
                          color: card.available ? card.color : '#6B7280',
                        }}
                      />
                    </div>

                    {card.badge && (
                      <span className="text-[10px] bg-[#1E2130] text-[#4B5563] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono">
                        {card.badge}
                      </span>
                    )}

                    {card.available && (
                      <span
                        className="text-[10px] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono"
                        style={{
                          background: `${card.color}22`,
                          color: card.color,
                        }}
                      >
                        Disponível
                      </span>
                    )}
                  </div>

                  <h3 className="text-[15px] font-semibold text-[#E8EAF0] m-0 mb-2 font-sans">
                    {card.label}
                  </h3>

                  <p className="text-[13px] text-[#6B7280] m-0 mb-5 leading-relaxed">
                    {card.description}
                  </p>

                  {card.available ? (
                    <div
                      className="flex items-center gap-1.5 text-xs font-medium font-mono"
                      style={{ color: card.color }}
                    >
                      Gerenciar →
                    </div>
                  ) : (
                    <div className="text-xs text-[#374151] font-mono">
                      Em desenvolvimento
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="text-[11px] text-[#4B5563] tracking-[0.15em] uppercase mt-12 mb-5 flex items-center gap-3 font-mono">
        Meus documentos
        <div className="flex-1 h-px bg-[#1E2130]" />
      </div>

      <div className="bg-[#13161D] border border-[#1E2130] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E2130] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-[#6B7280] tracking-[0.14em] uppercase">
              Pautas de reunião
            </div>
            <div className="text-sm font-medium text-[#E8EAF0]">
              {loadingPautas ? 'Carregando...' : `${pautas.length} item(ns)`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={refreshPautas}
              className="h-9 px-3 rounded-lg border border-[#252A3A] bg-transparent text-[#9CA3AF] text-[12px] font-medium hover:border-[#4F7EFF44] hover:text-[#4F7EFF] hover:bg-transparent"
              title="Atualizar lista"
            >
              <RefreshCw className="size-4" />
              Atualizar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelectDoc('pauta-reuniao')}
              className="h-9 px-4 rounded-lg bg-[#4F7EFF] text-white text-[12px] font-medium hover:bg-[#4F7EFF] hover:text-white"
              title="Criar nova pauta"
            >
              <Plus className="size-4" />
              Nova pauta
            </Button>
          </div>
        </div>

        {pautasError && (
          <div className="px-6 py-4 text-sm text-[#F87171] bg-[#F8717110] border-b border-[#1E2130]">
            {pautasError}
          </div>
        )}

        <div className="max-h-[50vh] overflow-auto divide-y divide-[#1E2130]">
          {!loadingPautas && pautas.length === 0 && !pautasError && (
            <div className="p-6 text-sm text-[#6B7280]">
              Nenhuma pauta salva ainda.
            </div>
          )}

          {pautas.map((p) => (
            <div key={p.id} className="p-5 flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenSavedPauta(p.id)}
                className="h-auto flex-1 text-left justify-start px-0 py-0 hover:bg-transparent"
              >
                <div className="text-sm font-medium text-[#E8EAF0] truncate">
                  {p.titulo || 'Sem título'}
                </div>
                <div className="text-[11px] text-[#6B7280] font-mono mt-1">
                  {p.docId} · atualizado{' '}
                  {new Date(p.updatedAt).toLocaleString('pt-BR')}
                </div>
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => deletePauta(p.id)}
                title="Excluir"
              >
                <Trash2 className="size-4" />
                Excluir
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
