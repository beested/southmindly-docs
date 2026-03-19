'use client';

import { Button } from '@/components/ui/button';
import { DOC_DEFINITIONS, PEOPLE_DEFINITIONS } from '@/lib/docs/registry';
import { DocType } from '@/types/docs';
import {
  Building2,
  CheckCircle2,
  FileBadge2,
  FileText,
  FolderKanban,
  type LucideIcon,
  Plus,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

type ClienteListItem = {
  id: string;
  razaoSocial: string;
  cidade: string;
  endereco: string;
  ativo: boolean;
  createdAt: string;
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

type ActivityItem = {
  id: string;
  kind: 'proposta' | 'cliente';
  title: string;
  subtitle: string;
  updatedAt: string;
};

interface DocHomeProps {
  onSelectDoc: (doc: DocType) => void;
}

const statusLabels: Record<string, string> = {
  rascunho: 'Rascunho',
  enviada: 'Enviada',
  em_negociacao: 'Em negociação',
  aceita: 'Aceita',
  recusada: 'Recusada',
  cancelada: 'Cancelada',
};

const statusColors: Record<string, string> = {
  rascunho: '#6B7280',
  enviada: '#4F7EFF',
  em_negociacao: '#F59E0B',
  aceita: '#34D399',
  recusada: '#F87171',
  cancelada: '#9CA3AF',
};

function parseBrDate(value: string) {
  const normalized = value.trim();
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(normalized)) return null;

  const [dayStr, monthStr, yearStr] = normalized.split('/');
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseAnyDate(value: string) {
  if (!value) return null;
  const brDate = parseBrDate(value);
  if (brDate) return brDate;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeLabel(value: string, fallback: string) {
  const normalized = value.trim();
  return normalized ? normalized : fallback;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(key: string) {
  const [yearStr, monthStr] = key.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
  })
    .format(new Date(year, month - 1, 1))
    .replace('.', '');
}

function getLastMonths(total: number) {
  const result: string[] = [];
  const now = new Date();

  for (let index = total - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    result.push(getMonthKey(date));
  }

  return result;
}

function ChartCard({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-[#1E2130] bg-[#13161D] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
            {eyebrow}
          </div>
          <h2 className="mt-2 text-[20px] font-semibold leading-tight text-[#F3F4F6]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#1E2130] bg-[#13161D] p-5">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
            {label}
          </div>
          <div className="mt-3 text-[34px] font-semibold leading-none text-[#F3F4F6]">
            {value}
          </div>
          <div className="mt-2 text-[13px] leading-5 text-[#8B93A7]">
            {helper}
          </div>
        </div>
        <div
          className="flex size-12 items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: `${accent}18`,
            borderColor: `${accent}40`,
          }}
        >
          <Icon className="size-5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

export default function DocHome({ onSelectDoc }: DocHomeProps) {
  const [propostas, setPropostas] = useState<PropostaListItem[]>([]);
  const [clientes, setClientes] = useState<ClienteListItem[]>([]);
  const [escopos, setEscopos] = useState<EscopoCatalogItem[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const refreshDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    setDashboardError(null);

    try {
      const [propostasRes, clientesRes, escoposRes] = await Promise.all([
        fetch('/api/propostas', { cache: 'no-store' }),
        fetch('/api/clientes?all=1', { cache: 'no-store' }),
        fetch('/api/escopos', { cache: 'no-store' }),
      ]);

      const [propostasJson, clientesJson, escoposJson] = await Promise.all([
        propostasRes.json().catch(() => ({})),
        clientesRes.json().catch(() => ({})),
        escoposRes.json().catch(() => ({})),
      ]);

      if (!propostasRes.ok) {
        throw new Error(
          (propostasJson as { error?: string }).error ??
            'Erro ao carregar propostas',
        );
      }

      if (!clientesRes.ok) {
        throw new Error(
          (clientesJson as { error?: string }).error ??
            'Erro ao carregar clientes',
        );
      }

      if (!escoposRes.ok) {
        throw new Error(
          (escoposJson as { error?: string }).error ??
            'Erro ao carregar escopos',
        );
      }

      setPropostas(
        Array.isArray((propostasJson as { items?: PropostaListItem[] }).items)
          ? ((propostasJson as { items?: PropostaListItem[] }).items ?? [])
          : [],
      );
      setClientes(
        Array.isArray((clientesJson as { items?: ClienteListItem[] }).items)
          ? ((clientesJson as { items?: ClienteListItem[] }).items ?? [])
          : [],
      );
      setEscopos(
        Array.isArray((escoposJson as { items?: EscopoCatalogItem[] }).items)
          ? ((escoposJson as { items?: EscopoCatalogItem[] }).items ?? [])
          : [],
      );
    } catch (error) {
      setDashboardError(
        error instanceof Error ? error.message : 'Erro ao carregar dashboard',
      );
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const availableTemplates =
    DOC_DEFINITIONS.filter((doc) => doc.available).length +
    PEOPLE_DEFINITIONS.filter((doc) => doc.available).length;
  const activeClients = clientes.filter((cliente) => cliente.ativo);
  const lastMonths = useMemo(() => getLastMonths(6), []);

  const monthlyActivity = useMemo(() => {
    return lastMonths.map((monthKey) => {
      const propostasCount = propostas.filter((proposta) => {
        const sourceDate =
          parseAnyDate(proposta.dataProposta) ??
          parseAnyDate(proposta.updatedAt);
        return sourceDate ? getMonthKey(sourceDate) === monthKey : false;
      }).length;

      return {
        monthKey,
        label: getMonthLabel(monthKey),
        propostas: propostasCount,
      };
    });
  }, [lastMonths, propostas]);

  const statusStats = useMemo(() => {
    const base = Object.keys(statusLabels).map((key) => ({
      key,
      label: statusLabels[key],
      value: propostas.filter((proposta) => proposta.status === key).length,
      color: statusColors[key],
    }));

    return base.sort((a, b) => b.value - a.value);
  }, [propostas]);

  const cityStats = useMemo(() => {
    const counts = new Map<string, number>();

    for (const cliente of activeClients) {
      const city = normalizeLabel(cliente.cidade, 'Sem cidade');
      counts.set(city, (counts.get(city) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [activeClients]);

  const escopoTypeStats = useMemo(() => {
    const counts = new Map<string, number>();

    for (const escopo of escopos) {
      const label = normalizeLabel(escopo.tipoCobranca, 'Sem classificação');
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [escopos]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    const proposalItems = propostas.map((proposta) => ({
      id: proposta.id,
      kind: 'proposta' as const,
      title: `Proposta #${proposta.numeroProposta ?? '—'}`,
      subtitle: `${statusLabels[proposta.status] ?? 'Sem status'} · Rev. ${
        proposta.revisao ?? '—'
      }`,
      updatedAt: proposta.updatedAt,
    }));

    const clienteItems = clientes
      .filter((cliente) => cliente.createdAt)
      .map((cliente) => ({
        id: cliente.id,
        kind: 'cliente' as const,
        title: cliente.razaoSocial || 'Cliente sem nome',
        subtitle: `${cliente.ativo ? 'Ativo' : 'Inativo'} · ${normalizeLabel(
          cliente.cidade,
          'Sem cidade',
        )}`,
        updatedAt: cliente.createdAt,
      }));

    return [...proposalItems, ...clienteItems]
      .sort((a, b) => {
        const aTime = parseAnyDate(a.updatedAt)?.getTime() ?? 0;
        const bTime = parseAnyDate(b.updatedAt)?.getTime() ?? 0;
        return bTime - aTime;
      })
      .slice(0, 8);
  }, [clientes, propostas]);

  const maxMonthlyValue = Math.max(
    1,
    ...monthlyActivity.map((item) => item.propostas),
  );
  const maxCityValue = Math.max(1, ...cityStats.map((item) => item.value));
  const maxEscopoTypeValue = Math.max(
    1,
    ...escopoTypeStats.map((item) => item.value),
  );
  const maxStatusValue = Math.max(1, ...statusStats.map((item) => item.value));

  const stats = [
    {
      label: 'Documentos gerados',
      value: String(propostas.length),
      helper: 'Propostas comerciais registradas',
      icon: FileText,
      accent: '#4F7EFF',
    },
    {
      label: 'Clientes cadastrados',
      value: String(clientes.length),
      helper: `${activeClients.length} ativos no momento`,
      icon: Building2,
      accent: '#34D399',
    },
    {
      label: 'Escopos ativos',
      value: String(escopos.length),
      helper: 'Disponíveis para novas propostas',
      icon: FolderKanban,
      accent: '#6B19DB',
    },
    {
      label: 'Templates disponíveis',
      value: String(availableTemplates),
      helper: 'Documentos e cadastros operacionais',
      icon: CheckCircle2,
      accent: '#F59E0B',
    },
  ] as const;

  return (
    <div className="w-full px-4 py-20 text-[#E8EAF0] sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1380px]">
        <div className="relative overflow-hidden rounded-[26px] border border-[#1E2130] bg-[radial-gradient(circle_at_top_left,#1E2A4A_0%,#13161D_36%,#0D0F14_100%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7 lg:rounded-[30px] lg:p-8">
          <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(circle_at_center,#6B19DB20_0%,transparent_70%)] lg:block" />
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#4F7EFF]">
                Dashboard Operacional
              </div>
              <h1 className="mt-4 text-[30px] font-semibold leading-[1.02] text-[#F8FAFC] sm:text-[36px] lg:text-[42px]">
                Visão consolidada dos documentos e cadastros da operação.
              </h1>
              <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#94A3B8]">
                A dashboard agora usa dados reais do Supabase para acompanhar
                propostas, clientes e escopos em um só lugar.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={refreshDashboard}
                className="h-10 rounded-xl border border-[#2A3658] bg-[#101623] px-4 text-[13px] text-[#C7D2FE] hover:border-[#4F7EFF] hover:bg-[#101623]"
              >
                <RefreshCw
                  className={`size-4 ${loadingDashboard ? 'animate-spin' : ''}`}
                />
                Atualizar dados
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onSelectDoc('proposta-comercial')}
                className="h-10 rounded-xl border border-[#34D39944] bg-[#34D39918] px-4 text-[13px] text-[#34D399] hover:bg-[#34D39930] hover:text-[#34D399]"
              >
                <Plus className="size-4" />
                Nova proposta
              </Button>
            </div>
          </div>
        </div>

        {dashboardError ? (
          <div className="mt-6 rounded-2xl border border-[#7F1D1D] bg-[#2A1114] px-5 py-4 text-sm text-[#FCA5A5]">
            {dashboardError}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="mt-8 grid gap-4 xl:grid-cols-[1.45fr_1fr]">
          <ChartCard
            eyebrow="Ritmo"
            title="Produção dos últimos 6 meses"
            action={
              <div className="rounded-full border border-[#1E2130] bg-[#0D0F14] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                Propostas
              </div>
            }
          >
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="flex min-w-[560px] items-end gap-3 sm:min-w-0">
                {monthlyActivity.map((item) => (
                  <div
                    key={item.monthKey}
                    className="flex flex-1 flex-col items-center"
                  >
                    <div className="mb-3 flex h-[210px] w-full items-end justify-center gap-2 rounded-[20px] border border-[#1E2130] bg-[#0D0F1488] px-2 pb-3 pt-6">
                      <div className="flex w-full max-w-[34px] flex-col items-center gap-2">
                        <div className="text-[10px] font-mono text-[#6B7280]">
                          {item.propostas}
                        </div>
                        <div
                          className="w-full rounded-t-[10px] bg-[#4F7EFF]"
                          style={{
                            height: `${(item.propostas / maxMonthlyValue) * 150 + 12}px`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#8B93A7]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-6 text-[12px] text-[#8B93A7]">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#4F7EFF]" />
                Propostas
              </div>
            </div>
          </ChartCard>

          <ChartCard
            eyebrow="Pipeline"
            title="Distribuição de propostas por status"
          >
            <div className="space-y-4">
              {statusStats.map((item) => (
                <div key={item.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-[#E8EAF0]">{item.label}</span>
                    </div>
                    <span className="font-mono text-[#9CA3AF]">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#191C25]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / maxStatusValue) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr_1.1fr]">
          <ChartCard eyebrow="Clientes" title="Concentração por cidade">
            <div className="space-y-4">
              {cityStats.length > 0 ? (
                cityStats.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#E8EAF0]">{item.label}</span>
                      <span className="font-mono text-[#9CA3AF]">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#191C25]">
                      <div
                        className="h-full rounded-full bg-[#34D399]"
                        style={{
                          width: `${(item.value / maxCityValue) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[#1E2130] bg-[#0D0F1488] p-5 text-sm text-[#8B93A7]">
                  Nenhum cliente cadastrado ainda.
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard eyebrow="Escopos" title="Modelos de cobrança mais usados">
            <div className="space-y-4">
              {escopoTypeStats.length > 0 ? (
                escopoTypeStats.map((item, index) => (
                  <div key={item.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#E8EAF0]">{item.label}</span>
                      <span className="font-mono text-[#9CA3AF]">
                        {item.value}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-[#191C25]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / maxEscopoTypeValue) * 100}%`,
                          backgroundColor: [
                            '#6B19DB',
                            '#4F7EFF',
                            '#34D399',
                            '#F59E0B',
                            '#F87171',
                          ][index % 5],
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[#1E2130] bg-[#0D0F1488] p-5 text-sm text-[#8B93A7]">
                  Nenhum escopo ativo encontrado.
                </div>
              )}
            </div>
          </ChartCard>

          <ChartCard eyebrow="Atividade" title="Últimas movimentações">
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div
                    key={`${item.kind}-${item.id}`}
                    className="flex items-start gap-3 rounded-2xl border border-[#1E2130] bg-[#0D0F1488] p-4"
                  >
                    <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl border border-[#252A3A] bg-[#13161D]">
                      {item.kind === 'proposta' ? (
                        <FileBadge2 className="size-4 text-[#4F7EFF]" />
                      ) : (
                        <Users className="size-4 text-[#F59E0B]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-medium text-[#E8EAF0]">
                        {item.title}
                      </div>
                      <div className="mt-1 text-[12px] leading-5 text-[#8B93A7]">
                        {item.subtitle}
                      </div>
                    </div>
                    <div className="text-right text-[11px] font-mono text-[#6B7280]">
                      {parseAnyDate(item.updatedAt)?.toLocaleDateString(
                        'pt-BR',
                      ) ?? '—'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[#1E2130] bg-[#0D0F1488] p-5 text-sm text-[#8B93A7]">
                  Nenhuma movimentação registrada ainda.
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.15em] text-[#4B5563]">
            Templates disponíveis
            <div className="h-px flex-1 bg-[#1E2130]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
            {DOC_DEFINITIONS.map((card) => (
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
                  className={`relative h-full overflow-hidden rounded-[18px] border border-[#1E2130] bg-[#13161D] p-6 transition-all duration-[220ms] ease-out ${
                    card.available
                      ? 'group-hover:-translate-y-[3px] group-hover:border-[var(--card-color)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]'
                      : ''
                  }`}
                >
                  {card.available && (
                    <div
                      className="absolute left-0 right-0 top-0 h-0.5"
                      style={{
                        background: `linear-gradient(90deg, ${card.color}, transparent)`,
                      }}
                    />
                  )}

                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                      style={{
                        background: card.available
                          ? `${card.color}18`
                          : '#1E2130',
                        borderColor: card.available
                          ? `${card.color}33`
                          : '#252A3A',
                      }}
                    >
                      <card.icon
                        className="size-[22px]"
                        style={{
                          color: card.available ? card.color : '#6B7280',
                        }}
                      />
                    </div>

                    {card.available ? (
                      <span
                        className="rounded-full px-2 py-[3px] text-[10px] font-mono tracking-[0.05em]"
                        style={{
                          background: `${card.color}22`,
                          color: card.color,
                        }}
                      >
                        Disponível
                      </span>
                    ) : card.badge ? (
                      <span className="rounded-full bg-[#1E2130] px-2 py-[3px] text-[10px] font-mono tracking-[0.05em] text-[#4B5563]">
                        {card.badge}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mb-2 text-[15px] font-semibold text-[#E8EAF0]">
                    {card.label}
                  </h3>
                  <p className="mb-5 text-[13px] leading-relaxed text-[#6B7280]">
                    {card.description}
                  </p>

                  <div
                    className="text-xs font-medium font-mono"
                    style={{ color: card.available ? card.color : '#4B5563' }}
                  >
                    {card.available
                      ? 'Criar documento →'
                      : 'Em desenvolvimento'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {PEOPLE_DEFINITIONS.length > 0 && (
          <div className="mt-12">
            <div className="mb-5 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.15em] text-[#4B5563]">
              Pessoas
              <div className="h-px flex-1 bg-[#1E2130]" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
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
                    className={`relative h-full overflow-hidden rounded-[18px] border border-[#1E2130] bg-[#13161D] p-6 transition-all duration-[220ms] ease-out ${
                      card.available
                        ? 'group-hover:-translate-y-[3px] group-hover:border-[var(--card-color)] group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]'
                        : ''
                    }`}
                  >
                    {card.available && (
                      <div
                        className="absolute left-0 right-0 top-0 h-0.5"
                        style={{
                          background: `linear-gradient(90deg, ${card.color}, transparent)`,
                        }}
                      />
                    )}

                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                        style={{
                          background: card.available
                            ? `${card.color}18`
                            : '#1E2130',
                          borderColor: card.available
                            ? `${card.color}33`
                            : '#252A3A',
                        }}
                      >
                        <card.icon
                          className="size-[22px]"
                          style={{
                            color: card.available ? card.color : '#6B7280',
                          }}
                        />
                      </div>

                      {card.available ? (
                        <span
                          className="rounded-full px-2 py-[3px] text-[10px] font-mono tracking-[0.05em]"
                          style={{
                            background: `${card.color}22`,
                            color: card.color,
                          }}
                        >
                          Disponível
                        </span>
                      ) : card.badge ? (
                        <span className="rounded-full bg-[#1E2130] px-2 py-[3px] text-[10px] font-mono tracking-[0.05em] text-[#4B5563]">
                          {card.badge}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mb-2 text-[15px] font-semibold text-[#E8EAF0]">
                      {card.label}
                    </h3>
                    <p className="mb-5 text-[13px] leading-relaxed text-[#6B7280]">
                      {card.description}
                    </p>

                    <div
                      className="text-xs font-medium font-mono"
                      style={{ color: card.available ? card.color : '#4B5563' }}
                    >
                      {card.available ? 'Gerenciar →' : 'Em desenvolvimento'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
