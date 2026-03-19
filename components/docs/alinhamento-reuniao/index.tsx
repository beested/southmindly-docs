'use client';

import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, SelectField, TextAreaField } from '@/components/ui/inputs';
import { DatePicker } from '@/components/ui/inputs/date-picker';
import {
  Eye,
  FilePlus2,
  Pencil,
  Plus,
  Printer,
  Save,
  Trash2,
} from 'lucide-react';

import { meetingPrintStyles } from './constants';
import { MeetingPreview } from './preview';
import { ServicesModal } from './services-modal';
import {
  AlinhamentoReuniaoData,
  AlinhamentoReuniaoProps,
  ClienteItem,
  ReuniaoParticipante,
  ReuniaoServico,
  ServicoCatalogoItem,
} from './types';

function createItemId(prefix: string) {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

function formatDateWithWeekday(value: string) {
  if (!value) return 'Não definida';

  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  if (!isValid(parsed)) return value;

  const weekday = format(parsed, 'EEEE', { locale: ptBR });
  return `${format(parsed, 'dd/MM/yyyy')} - ${
    weekday.charAt(0).toUpperCase() + weekday.slice(1)
  }`;
}

function createParticipant(nome = ''): ReuniaoParticipante {
  return {
    id: createItemId('participant'),
    nome,
  };
}

function createEmptyData(): AlinhamentoReuniaoData {
  return {
    clienteId: '',
    participantes: [createParticipant()],
    dataReuniao: '',
    horaReuniao: '',
    localReuniao: '',
    objetivosReuniao: '',
    assuntosTratados: '',
    servicos: [],
    diaEntregaAprovacao: '',
    prazoMaximoAprovacao: '',
    diaHorarioPostagem: '',
    atividadesIncluidas: '',
    formaPagamento: '',
    prazoContrato: '',
    emissaoNotaFiscal: '',
    dataInicioContrato: '',
    consideracoesProposta: '',
    indicadoresRelatorio: '',
    observacoes: '',
  };
}

function createSeededData(): AlinhamentoReuniaoData {
  return {
    clienteId: '',
    participantes: [
      createParticipant('Manolo Reis'),
      createParticipant('Felipe Susin'),
      createParticipant('Bruno Paim'),
    ],
    dataReuniao: '16/03/2026',
    horaReuniao: '19:00',
    localReuniao: 'Google Meet',
    objetivosReuniao: [
      'Apresentar a SouthMindly e sua atuação no mercado de marketing digital',
      'Demonstrar as soluções propostas para o fortalecimento da presença digital',
      'Detalhar os escopos de trabalho, investimentos e metodologia de atuação',
      'Alinhar expectativas e esclarecer dúvidas sobre a proposta',
    ].join('\n'),
    assuntosTratados: [
      'Apresentação da SouthMindly:',
      'Histórico e experiência da empresa',
      'Diferenciais e metodologia de trabalho',
      'Cases de sucesso e portfólio',
      'Valores e comprometimento com resultados',
      '',
      'Análise do Cenário Atual do Cliente:',
      'Crescer a presença digital da empresa no Instagram.',
      'Transmitir informações importantes sobre a empresa de maneira didática e simples.',
      'Focar no primeiro momento na Matriz e também na área de Odontologia.',
      '',
      'SAC:',
      'Quem responde comentários? Manolo ou Gisele',
      'Quem responde directs? Manolo ou Gisele',
      'A SouthMindly responde direto ou apenas encaminha? Encaminhar no grupo de WhatsApp',
      '',
      'Pilares de Conteúdo:',
      'Institucional',
      'Educativo',
      'Bastidores',
      'Promoções',
      'Autoridade',
      'Prova social',
      '',
      'Responsabilidades do Cliente:',
      'Fotos',
      'Vídeos',
      'Informações internas',
      'Eventos',
      '',
      'Acessos às Plataformas:',
      'Instagram',
      'Facebook',
    ].join('\n'),
    servicos: [
      {
        id: createItemId('service'),
        catalogoId: 'gestao-digital',
        nome: 'Gestão Digital',
        descricao: 'Criação gráfica, textos e gerenciamento de interações',
        detalhamento: '4 postagens/mês',
        valor: 'R$ 600,00',
      },
    ],
    diaEntregaAprovacao: 'Última/Penúltima Sexta-Feira do mês',
    prazoMaximoAprovacao: '48 horas',
    diaHorarioPostagem: 'Quarta-feira às 17:00',
    atividadesIncluidas:
      'Criação gráfica, textos e gerenciamento de interações',
    formaPagamento: 'Boleto bancário - Vencimento dia 15',
    prazoContrato: '6 meses',
    emissaoNotaFiscal: 'SouthMindly - Grupo QualiSul',
    dataInicioContrato: '01/04/2026',
    consideracoesProposta: [
      'A proposta foi enviada previamente para análise, garantindo que o cliente já tenha conhecimento dos detalhes do serviço oferecido.',
      'Estamos abertos a ajustes e customizações conforme as necessidades específicas do cliente.',
      'O objetivo é construir uma parceria de longo prazo focada em resultados sustentáveis.',
    ].join('\n'),
    indicadoresRelatorio: [
      'Apresentação de relatório (Trimestral)',
      'Visualizações mensais (Alcance)',
      'Volume de interações',
      'Alcance de não-seguidores',
      'Novos seguidores (Crescimento)',
    ].join('\n'),
    observacoes: '',
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function getClientInitials(cliente?: ClienteItem) {
  const source = cliente?.razaoSocial?.trim();
  if (!source) return 'CL';

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function buildServiceFromCatalogItem(
  service: ServicoCatalogoItem,
): ReuniaoServico {
  return {
    id: createItemId('service'),
    catalogoId: service.id,
    nome: service.nome,
    descricao: service.descricao || '',
    detalhamento: service.unidadeLabel || '',
    valor:
      service.valorPadrao === null || service.valorPadrao === undefined
        ? ''
        : formatCurrency(service.valorPadrao),
  };
}

function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-[#1E2130] pb-3.5 xl:flex-row xl:items-start xl:justify-between">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#7C3AED]">
          {eyebrow}
        </div>
        <div className="mt-2 text-[20px] font-semibold text-[#F3F4F6]">
          {title}
        </div>
        {description ? (
          <p className="mt-2 max-w-[620px] text-sm leading-6 text-[#8B93A7]">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export default function AlinhamentoReuniao({
  onBack,
}: AlinhamentoReuniaoProps) {
  const [data, setData] = useState<AlinhamentoReuniaoData>(() =>
    createSeededData(),
  );
  const [alinhamentoId, setAlinhamentoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [clientes, setClientes] = useState<ClienteItem[]>([]);
  const [catalogServices, setCatalogServices] = useState<ServicoCatalogoItem[]>(
    [],
  );
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [servicesQuery, setServicesQuery] = useState('');

  const selectedCatalogIds = useMemo(
    () => data.servicos.map((service) => service.catalogoId).filter(Boolean),
    [data.servicos],
  );
  const selectedCliente = useMemo(
    () => clientes.find((cliente) => cliente.id === data.clienteId),
    [clientes, data.clienteId],
  );

  const refreshClientes = useCallback(async () => {
    try {
      const response = await fetch('/api/clientes', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as {
        items?: ClienteItem[];
      };

      setClientes(Array.isArray(payload.items) ? payload.items : []);
    } catch {
      setClientes([]);
    }
  }, []);

  const refreshCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setCatalogError(null);

    try {
      const response = await fetch('/api/escopos', { cache: 'no-store' });
      const payload = (await response.json().catch(() => ({}))) as {
        items?: ServicoCatalogoItem[];
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          payload.error ?? 'Erro ao carregar catálogo de serviços',
        );
      }

      setCatalogServices(Array.isArray(payload.items) ? payload.items : []);
    } catch (error) {
      setCatalogError(
        error instanceof Error
          ? error.message
          : 'Erro ao carregar catálogo de serviços',
      );
      setCatalogServices([]);
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    refreshClientes();
  }, [refreshClientes]);

  const updateData = useCallback((patch: Partial<AlinhamentoReuniaoData>) => {
    setData((current) => ({ ...current, ...patch }));
  }, []);

  const updateParticipant = useCallback((id: string, nome: string) => {
    setData((current) => ({
      ...current,
      participantes: current.participantes.map((participant) =>
        participant.id === id ? { ...participant, nome } : participant,
      ),
    }));
  }, []);

  const addParticipant = useCallback(() => {
    setData((current) => ({
      ...current,
      participantes: [...current.participantes, createParticipant()],
    }));
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setData((current) => {
      const nextParticipants = current.participantes.filter(
        (participant) => participant.id !== id,
      );

      return {
        ...current,
        participantes:
          nextParticipants.length > 0
            ? nextParticipants
            : [createParticipant()],
      };
    });
  }, []);

  const updateService = useCallback(
    (id: string, patch: Partial<ReuniaoServico>) => {
      setData((current) => ({
        ...current,
        servicos: current.servicos.map((service) =>
          service.id === id ? { ...service, ...patch } : service,
        ),
      }));
    },
    [],
  );

  const removeService = useCallback((id: string) => {
    setData((current) => ({
      ...current,
      servicos: current.servicos.filter((service) => service.id !== id),
    }));
  }, []);

  const handleAddServices = useCallback((services: ServicoCatalogoItem[]) => {
    setData((current) => ({
      ...current,
      servicos: [
        ...current.servicos,
        ...services.map((service) => buildServiceFromCatalogItem(service)),
      ],
    }));
    setServicesModalOpen(false);
    setServicesQuery('');
  }, []);

  const resetDocument = useCallback(() => {
    setData(createEmptyData());
    setAlinhamentoId(null);
    setSaving(false);
    setStatusMsg(null);
    setActiveTab('editor');
    setServicesQuery('');
    setServicesModalOpen(false);
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatusMsg(null);

    try {
      const url = alinhamentoId
        ? `/api/alinhamentos-reuniao/${alinhamentoId}`
        : '/api/alinhamentos-reuniao';
      const method = alinhamentoId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ alinhamento: data }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatusMsg(payload.error ?? 'Erro ao salvar alinhamento');
        return;
      }

      if (payload.id) {
        setAlinhamentoId(payload.id);
      }

      setStatusMsg(alinhamentoId ? 'Alinhamento atualizado' : 'Alinhamento salvo');
      window.setTimeout(() => setStatusMsg(null), 2400);
    } finally {
      setSaving(false);
    }
  }, [alinhamentoId, data]);

  const handlePrint = useCallback(() => {
    setActiveTab('preview');
    window.setTimeout(() => {
      const printSource = document.getElementById('meeting-print-root');
      if (!printSource) return;

      const inheritedHead = Array.from(
        document.querySelectorAll('style, link[rel="stylesheet"]'),
      )
        .map((node) => node.outerHTML)
        .join('\n');

      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      document.body.appendChild(iframe);

      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) {
        iframe.remove();
        return;
      }

      iframeDocument.open();
      iframeDocument.write(`<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Alinhamento de Reunião</title>
    ${inheritedHead}
    <style>${meetingPrintStyles}</style>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #05070B;
      }

      #meeting-print-root {
        display: block !important;
      }
    </style>
  </head>
  <body>
    <div id="meeting-print-root">${printSource.innerHTML}</div>
  </body>
</html>`);
      iframeDocument.close();

      const runPrint = () => {
        const frameWindow = iframe.contentWindow;
        if (!frameWindow) {
          iframe.remove();
          return;
        }

        frameWindow.focus();
        frameWindow.print();

        window.setTimeout(() => {
          iframe.remove();
        }, 1000);
      };

      if (iframe.contentWindow?.document.readyState === 'complete') {
        window.setTimeout(runPrint, 150);
        return;
      }

      iframe.onload = () => {
        window.setTimeout(runPrint, 150);
      };
    }, 50);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#0D0F14] font-sans text-[#E8EAF0]">
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
                Documento Operacional
              </div>
              <div className="truncate text-[13px] font-medium text-[#E8EAF0]">
                Alinhamento de Reunião
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={resetDocument}
              className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#7C3AED55] hover:bg-transparent hover:text-[#7C3AED] sm:px-4.5 sm:text-[13px]"
            >
              <FilePlus2 className="size-4" />
              Novo alinhamento
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab('editor')}
              className={`h-auto rounded-lg border-none px-3 py-1.5 text-[12px] font-medium transition-all duration-200 hover:bg-transparent sm:px-4 sm:text-[13px] ${
                activeTab === 'editor'
                  ? 'bg-[#7C3AED] text-white hover:bg-[#7C3AED] hover:text-white'
                  : 'bg-transparent text-[#6B7280]'
              }`}
            >
              <Pencil className="size-4" />
              Editor
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab('preview')}
              className={`h-auto rounded-lg border-none px-3 py-1.5 text-[12px] font-medium transition-all duration-200 hover:bg-transparent sm:px-4 sm:text-[13px] ${
                activeTab === 'preview'
                  ? 'bg-[#7C3AED] text-white hover:bg-[#7C3AED] hover:text-white'
                  : 'bg-transparent text-[#6B7280]'
              }`}
            >
              <Eye className="size-4" />
              Preview
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrint}
              className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#7C3AED] hover:bg-transparent hover:text-[#7C3AED] sm:px-4.5 sm:text-[13px]"
            >
              <Printer className="size-4" />
              Imprimir
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSave}
              disabled={saving}
              className="h-auto rounded-lg border border-[#7C3AED44] bg-[#7C3AED18] px-3 py-1.5 text-[12px] font-medium text-[#7C3AED] transition-all duration-200 hover:bg-[#7C3AED33] hover:text-[#7C3AED] disabled:opacity-60 sm:px-4.5 sm:text-[13px]"
            >
              <Save className="size-4" />
              {saving ? 'Salvando...' : alinhamentoId ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </header>

      {statusMsg ? (
        <div className="border-b border-[#1E2130] bg-[#13161D] px-4 py-3 text-[12px] text-[#9CA3AF] print:hidden sm:px-6 lg:px-8">
          {statusMsg}
        </div>
      ) : null}

      {catalogError ? (
        <div className="border-b border-[#7F1D1D] bg-[#2A1114] px-4 py-3 text-[12px] text-[#FCA5A5] print:hidden sm:px-6 lg:px-8">
          {catalogError}
        </div>
      ) : null}

      <ServicesModal
        open={servicesModalOpen}
        query={servicesQuery}
        services={catalogServices}
        selectedCatalogIds={selectedCatalogIds}
        onClose={() => {
          setServicesModalOpen(false);
          setServicesQuery('');
        }}
        onQueryChange={setServicesQuery}
        onConfirm={handleAddServices}
      />

      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' ? (
          <div className="grid min-h-[calc(100vh-60px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
            <div className="overflow-y-auto border-b border-[#1E2130] bg-[#13161D] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-[28px_24px]">
              <SectionTitle
                eyebrow="Reunião"
                title="Informações básicas"
                description="Registre os dados centrais da reunião e quem participou do alinhamento."
              />

              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                    Participantes
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addParticipant}
                    className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[11px] font-medium text-[#9CA3AF] hover:bg-transparent hover:text-[#E8EAF0]"
                  >
                    <Plus className="size-3.5" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {data.participantes.map((participant, index) => (
                    <div
                      key={participant.id}
                      className="rounded-2xl border border-[#1E2130] bg-[#11141C] p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                          Participante {index + 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeParticipant(participant.id)}
                          className="h-auto rounded-lg border border-transparent px-2 py-1 text-[#6B7280] hover:border-[#252A3A] hover:bg-transparent hover:text-[#F87171]"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                      <Field
                        label="Nome"
                        value={participant.nome}
                        onChange={(nome) =>
                          updateParticipant(participant.id, nome)
                        }
                        placeholder="Ex: Felipe Susin"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className="mb-4">
                  <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                    Data da reunião
                  </label>
                  <DatePicker
                    value={data.dataReuniao}
                    onChange={(dataReuniao) => updateData({ dataReuniao })}
                    placeholder="dd/mm/aaaa"
                    accentColor="#7C3AED"
                  />
                </div>
                <Field
                  label="Hora"
                  value={data.horaReuniao}
                  onChange={(horaReuniao) => updateData({ horaReuniao })}
                  placeholder="Ex: 14:30"
                />
              </div>

              <Field
                label="Local da reunião"
                value={data.localReuniao}
                onChange={(localReuniao) => updateData({ localReuniao })}
                placeholder="Ex: Google Meet, presencial, Zoom..."
              />

              <SelectField
                label="Cliente"
                value={data.clienteId}
                onChange={(clienteId) => updateData({ clienteId })}
                options={clientes.map((cliente) => ({
                  value: cliente.id,
                  label: cliente.razaoSocial || cliente.id,
                }))}
                placeholder="Selecione o cliente"
              />

              {selectedCliente ? (
                <div className="mb-4 overflow-hidden rounded-[24px] border border-[#252A3A] bg-[linear-gradient(180deg,rgba(17,20,28,0.98),rgba(13,15,20,0.98))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                    Cliente da reunião
                  </div>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-[#2D3345] bg-[#0E1016]">
                      {selectedCliente.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={selectedCliente.logoUrl}
                          alt={selectedCliente.razaoSocial}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xl font-semibold uppercase tracking-[0.14em] text-[#A78BFA]">
                          {getClientInitials(selectedCliente)}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[18px] font-semibold leading-tight text-[#F4F7FB]">
                        {selectedCliente.razaoSocial}
                      </div>
                      {selectedCliente.nomeContato ? (
                        <div className="mt-1 text-[13px] text-[#A7AFBF]">
                          {selectedCliente.nomeContato}
                          {selectedCliente.cargoContato
                            ? ` · ${selectedCliente.cargoContato}`
                            : ''}
                        </div>
                      ) : null}

                      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {selectedCliente.cidade ? (
                          <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5">
                            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                              Cidade
                            </div>
                            <div className="mt-1 text-[13px] text-[#E8EAF0]">
                              {selectedCliente.cidade}
                            </div>
                          </div>
                        ) : null}
                        {selectedCliente.emailContato ? (
                          <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5">
                            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                              E-mail
                            </div>
                            <div className="mt-1 break-all text-[13px] text-[#E8EAF0]">
                              {selectedCliente.emailContato}
                            </div>
                          </div>
                        ) : null}
                        {selectedCliente.telefoneContato ? (
                          <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5 sm:col-span-2">
                            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                              Telefone
                            </div>
                            <div className="mt-1 text-[13px] text-[#E8EAF0]">
                              {selectedCliente.telefoneContato}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <TextAreaField
                label="Objetivos da reunião"
                value={data.objetivosReuniao}
                onChange={(objetivosReuniao) =>
                  updateData({ objetivosReuniao })
                }
                placeholder="Um objetivo por linha"
                rows={7}
              />

              <SectionTitle
                eyebrow="Comercial"
                title="Condições da negociação"
                description="Estruture os termos acordados para facilitar a evolução para proposta."
              />

              <Field
                label="Forma de pagamento"
                value={data.formaPagamento}
                onChange={(formaPagamento) => updateData({ formaPagamento })}
                placeholder="Ex: Boleto bancário - vencimento dia 15"
              />
              <Field
                label="Prazo de contrato"
                value={data.prazoContrato}
                onChange={(prazoContrato) => updateData({ prazoContrato })}
                placeholder="Ex: 6 meses"
              />
              <Field
                label="Emissão de nota fiscal"
                value={data.emissaoNotaFiscal}
                onChange={(emissaoNotaFiscal) =>
                  updateData({ emissaoNotaFiscal })
                }
                placeholder="Ex: SouthMindly - Grupo QualiSul"
              />

              <div className="mb-4">
                <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                  Data de início
                </label>
                <DatePicker
                  value={data.dataInicioContrato}
                  onChange={(dataInicioContrato) =>
                    updateData({ dataInicioContrato })
                  }
                  placeholder="dd/mm/aaaa"
                  accentColor="#7C3AED"
                />
                <div className="mt-2 rounded-xl border border-[#1E2130] bg-[#11141C] px-3 py-2 text-[12px] text-[#8B93A7]">
                  Data formatada:{' '}
                  <span className="text-[#E8EAF0]">
                    {formatDateWithWeekday(data.dataInicioContrato)}
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5 lg:p-[28px_32px]">
              <SectionTitle
                eyebrow="Escopo"
                title="Serviços e cronograma"
                description="Selecione os serviços discutidos na reunião e detalhe a operação combinada."
                action={
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setServicesModalOpen(true)}
                    disabled={loadingCatalog}
                    className="h-auto rounded-lg border border-[#7C3AED44] bg-[#7C3AED18] px-4 py-2 text-[13px] font-medium text-[#7C3AED] hover:bg-[#7C3AED33] hover:text-[#7C3AED] disabled:opacity-60"
                  >
                    <Plus className="size-4" />
                    {loadingCatalog
                      ? 'Carregando serviços...'
                      : 'Adicionar Serviço'}
                  </Button>
                }
              />

              <div className="space-y-4">
                {data.servicos.length > 0 ? (
                  data.servicos.map((service, index) => (
                    <div
                      key={service.id}
                      className="rounded-[24px] border border-[#1E2130] bg-[#13161D] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
                    >
                      <div className="mb-4 flex flex-col gap-3 border-b border-[#1E2130] pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                            Serviço {index + 1}
                          </div>
                          <div className="mt-1 text-sm text-[#E8EAF0]">
                            Item editável selecionado a partir do catálogo
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeService(service.id)}
                          className="h-auto rounded-lg border border-transparent px-2.5 py-1.5 text-[#6B7280] hover:border-[#252A3A] hover:bg-transparent hover:text-[#F87171]"
                        >
                          <Trash2 className="size-4" />
                          Remover
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-2">
                        <Field
                          label="Nome do serviço"
                          value={service.nome}
                          onChange={(nome) =>
                            updateService(service.id, { nome })
                          }
                          placeholder="Ex: Gestão Digital"
                        />
                        <Field
                          label="Valor"
                          value={service.valor}
                          onChange={(valor) =>
                            updateService(service.id, { valor })
                          }
                          placeholder="Ex: R$ 600,00"
                        />
                      </div>

                      <Field
                        label="Detalhamento"
                        value={service.detalhamento}
                        onChange={(detalhamento) =>
                          updateService(service.id, { detalhamento })
                        }
                        placeholder="Ex: 4 postagens/mês"
                      />

                      <TextAreaField
                        label="Descrição"
                        value={service.descricao}
                        onChange={(descricao) =>
                          updateService(service.id, { descricao })
                        }
                        placeholder="Observações sobre o serviço, escopo ou contexto discutido"
                        rows={3}
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-[24px] border border-dashed border-[#252A3A] bg-[#11141C] p-6 text-sm text-[#8B93A7]">
                    Nenhum serviço adicionado ainda. Use o botão acima para
                    abrir o modal e selecionar um ou mais itens do catálogo.
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-[28px] border border-[#1E2130] bg-[#13161D] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)] sm:p-6">
                <SectionTitle
                  eyebrow="Conteúdo"
                  title="Assuntos tratados e definições operacionais"
                  description="Registre o conteúdo discutido na reunião e os combinados operacionais."
                />

                <TextAreaField
                  label="Assuntos tratados"
                  value={data.assuntosTratados}
                  onChange={(assuntosTratados) =>
                    updateData({ assuntosTratados })
                  }
                  placeholder="Separe seções com uma linha em branco"
                  rows={10}
                />

                <Field
                  label="Dia fixo de entrega para aprovação"
                  value={data.diaEntregaAprovacao}
                  onChange={(diaEntregaAprovacao) =>
                    updateData({ diaEntregaAprovacao })
                  }
                  placeholder="Ex: Última sexta-feira do mês"
                />
                <Field
                  label="Prazo máximo para aprovação"
                  value={data.prazoMaximoAprovacao}
                  onChange={(prazoMaximoAprovacao) =>
                    updateData({ prazoMaximoAprovacao })
                  }
                  placeholder="Ex: 48 horas"
                />
                <Field
                  label="Dia e horário fixo de postagem"
                  value={data.diaHorarioPostagem}
                  onChange={(diaHorarioPostagem) =>
                    updateData({ diaHorarioPostagem })
                  }
                  placeholder="Ex: Quarta-feira às 17:00"
                />
                <TextAreaField
                  label="Atividades incluídas"
                  value={data.atividadesIncluidas}
                  onChange={(atividadesIncluidas) =>
                    updateData({ atividadesIncluidas })
                  }
                  placeholder="Ex: Criação gráfica, textos e gerenciamento de interações"
                  rows={4}
                />
                <TextAreaField
                  label="Direcionamento comercial"
                  value={data.consideracoesProposta}
                  onChange={(consideracoesProposta) =>
                    updateData({ consideracoesProposta })
                  }
                  placeholder="Um ponto por linha. Ex: A proposta foi enviada previamente para análise"
                  rows={5}
                />
                <TextAreaField
                  label="Relatórios e indicadores"
                  value={data.indicadoresRelatorio}
                  onChange={(indicadoresRelatorio) =>
                    updateData({ indicadoresRelatorio })
                  }
                  placeholder="Um item por linha. Ex: Apresentação de relatório (Trimestral)"
                  rows={5}
                />
                <TextAreaField
                  label="Observações adicionais"
                  value={data.observacoes}
                  onChange={(observacoes) => updateData({ observacoes })}
                  placeholder="Notas gerais da reunião, próximos passos, restrições e alinhamentos extras"
                  rows={5}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0D0F14] px-3 py-6 print:bg-transparent print:p-0 sm:px-4 lg:p-[40px_32px]">
            <MeetingPreview data={data} cliente={selectedCliente} />
          </div>
        )}
      </div>
    </div>
  );
}
