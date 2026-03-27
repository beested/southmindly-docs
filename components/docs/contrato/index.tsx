'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, SelectField, TextAreaField } from '@/components/ui/inputs';
import { DatePicker } from '@/components/ui/inputs/date-picker';
import {
  Eye,
  FilePlus2,
  FolderOpen,
  Pencil,
  Printer,
  Save,
} from 'lucide-react';

import {
  contractTemplates,
  contractPrintStyles,
  createContratoData,
  defaultContratoData,
  getContractTemplate,
  getScopeSectionDefs,
  southMindlyContractInfo,
} from './constants';
import { ContratosModal } from './contratos-modal';
import { ContractPreview } from './preview';
import {
  ClienteItem,
  ContratoData,
  ContractListItem,
  ContractResponse,
  ContratoProps,
  ContractTemplateId,
} from './types';

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 border-b border-[#1E2130] pb-3.5">
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
  );
}

export default function Contrato({ onBack }: ContratoProps) {
  const [data, setData] = useState<ContratoData>({ ...defaultContratoData });
  const [contratoId, setContratoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [clientes, setClientes] = useState<ClienteItem[]>([]);
  const [contratos, setContratos] = useState<ContractListItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [creatingNewFromList, setCreatingNewFromList] = useState(false);
  const [openingContratoId, setOpeningContratoId] = useState<string | null>(
    null,
  );
  const [deletingContratoId, setDeletingContratoId] = useState<string | null>(
    null,
  );
  const [listOpen, setListOpen] = useState(false);
  const activeTemplate = useMemo(
    () => getContractTemplate(data.templateId),
    [data.templateId],
  );
  const scopeSectionDefs = useMemo(
    () => getScopeSectionDefs(data.templateId),
    [data.templateId],
  );

  const selectedCliente = useMemo(
    () => clientes.find((cliente) => cliente.id === data.clienteId),
    [clientes, data.clienteId],
  );

  useEffect(() => {
    let active = true;

    const loadClientes = async () => {
      try {
        const response = await fetch('/api/clientes', { cache: 'no-store' });
        const payload = (await response.json().catch(() => ({}))) as {
          items?: ClienteItem[];
        };

        if (!active) return;
        setClientes(Array.isArray(payload.items) ? payload.items : []);
      } catch {
        if (!active) return;
        setClientes([]);
      }
    };

    void loadClientes();

    return () => {
      active = false;
    };
  }, []);

  const updateField = useCallback(
    <K extends keyof ContratoData>(key: K, value: ContratoData[K]) => {
      setData((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const handleClienteChange = useCallback(
    (clienteId: string) => {
      const cliente = clientes.find((item) => item.id === clienteId);

      setData((current) => ({
        ...current,
        clienteId,
        contratanteNome: cliente?.razaoSocial || '',
        contratanteCnpj: cliente?.cnpj || '',
        contratanteEndereco: cliente?.endereco || cliente?.cidade || '',
      }));
    },
    [clientes],
  );

  const handleTemplateChange = useCallback(
    (templateId: ContractTemplateId) => {
      setData((current) => {
        const nextData = createContratoData(templateId);

        return {
          ...nextData,
          clienteId: current.clienteId,
          contratanteNome: current.contratanteNome,
          contratanteCnpj: current.contratanteCnpj,
          contratanteEndereco: current.contratanteEndereco,
        };
      });
    },
    [],
  );

  const resetDocument = useCallback(() => {
    setData((current) => {
      const nextData = createContratoData(current.templateId);

      return {
        ...nextData,
        clienteId: current.clienteId,
        contratanteNome: current.contratanteNome,
        contratanteCnpj: current.contratanteCnpj,
        contratanteEndereco: current.contratanteEndereco,
      };
    });
    setContratoId(null);
    setStatusMsg(null);
    setActiveTab('editor');
  }, []);

  const refreshList = useCallback(async () => {
    const response = await fetch('/api/contratos', { cache: 'no-store' });
    const payload = (await response.json().catch(() => ({}))) as {
      items?: ContractListItem[];
    };
    setContratos(Array.isArray(payload.items) ? payload.items : []);
  }, []);

  const handleNew = useCallback(() => {
    setData({ ...defaultContratoData });
    setContratoId(null);
    setStatusMsg(null);
    setActiveTab('editor');
  }, []);

  const handleCreateNewFromList = useCallback(async () => {
    setCreatingNewFromList(true);
    setStatusMsg('Preparando novo contrato...');

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
      setOpeningContratoId(id);
      setStatusMsg('Carregando contrato...');

      const response = await fetch(`/api/contratos/${id}`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        setStatusMsg('Erro ao carregar contrato');
        return;
      }

      const payload = (await response.json().catch(() => null)) as ContractResponse;
      if (!payload) {
        setStatusMsg('Erro ao carregar contrato');
        return;
      }

      setContratoId(payload.id);
      setData(payload.contrato);
      setListOpen(false);
      setStatusMsg(null);
      setActiveTab('editor');
    } catch (error) {
      if (error instanceof Error) {
        setStatusMsg(error.message);
        return;
      }

      setStatusMsg('Erro ao carregar contrato');
    } finally {
      setOpeningContratoId(null);
    }
  }, []);

  const handleDeleteSaved = useCallback(
    async (id: string) => {
      setDeletingContratoId(id);
      setStatusMsg('Excluindo contrato...');

      try {
        const response = await fetch(`/api/contratos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          setStatusMsg('Erro ao excluir contrato');
          return;
        }

        if (contratoId === id) {
          handleNew();
        }

        await refreshList();
        setStatusMsg('Contrato excluído');
        setTimeout(() => setStatusMsg(null), 2400);
      } finally {
        setDeletingContratoId(null);
      }
    },
    [contratoId, handleNew, refreshList],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatusMsg(null);

    try {
      const sanitizedData =
        data.templateId === 'marketing-digital'
          ? { ...data, scopeFaq: '' }
          : data;
      const url = contratoId ? `/api/contratos/${contratoId}` : '/api/contratos';
      const method = contratoId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ contrato: sanitizedData }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        id?: string;
        error?: string;
      };

      if (!response.ok) {
        setStatusMsg(payload.error ?? 'Erro ao salvar contrato');
        return;
      }

      if (payload.id) {
        setContratoId(payload.id);
      }

      setStatusMsg(contratoId ? 'Contrato atualizado' : 'Contrato salvo');
      window.setTimeout(() => setStatusMsg(null), 2400);
    } finally {
      setSaving(false);
    }
  }, [contratoId, data]);

  const handlePrint = useCallback(() => {
    setActiveTab('preview');
    window.setTimeout(() => {
      const printSource = document.getElementById('contract-print-root');
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
    <title>Contrato</title>
    ${inheritedHead}
    <style>${contractPrintStyles}</style>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
      }

      #contract-print-root {
        display: block !important;
      }
    </style>
  </head>
  <body>
    <div id="contract-print-root">${printSource.innerHTML}</div>
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
                Documento Contratual
              </div>
              <div className="truncate text-[13px] font-medium text-[#E8EAF0]">
                Contrato
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
              Restaurar modelo
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setListOpen(true);
                refreshList();
              }}
              className="h-auto rounded-lg border border-[#252A3A] bg-transparent px-3 py-1.5 text-[12px] font-medium text-[#9CA3AF] transition-all duration-200 hover:border-[#7C3AED44] hover:bg-transparent hover:text-[#7C3AED] sm:px-4.5 sm:text-[13px]"
              title="Consultar contratos salvos"
            >
              <FolderOpen className="size-4" />
              Contratos
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
              {saving ? 'Salvando...' : contratoId ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </div>
      </header>

      {statusMsg ? (
        <div className="border-b border-[#1E2130] bg-[#13161D] px-4 py-3 text-[12px] text-[#9CA3AF] print:hidden sm:px-6 lg:px-8">
          {statusMsg}
        </div>
      ) : null}

      <ContratosModal
        open={listOpen}
        contratos={contratos}
        creatingNew={creatingNewFromList}
        openingId={openingContratoId}
        deletingId={deletingContratoId}
        onClose={() => setListOpen(false)}
        onNew={handleCreateNewFromList}
        onOpenSaved={handleOpenSaved}
        onDeleteSaved={handleDeleteSaved}
      />

      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' ? (
          <div className="grid min-h-[calc(100vh-60px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
            <div className="overflow-y-auto border-b border-[#1E2130] bg-[#13161D] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-[28px_24px]">
              <SelectField
                label="Modelo de contrato"
                value={data.templateId}
                onChange={handleTemplateChange}
                options={contractTemplates.map((template) => ({
                  value: template.id,
                  label: template.label,
                }))}
                placeholder="Selecione o modelo"
              />
              <div className="mb-6 rounded-[20px] border border-[#252A3A] bg-[#13161D] p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                  Modelo ativo
                </div>
                <div className="mt-2 text-[15px] font-semibold text-[#F3F4F6]">
                  {activeTemplate.label}
                </div>
                <div className="mt-1 text-[12px] leading-5 text-[#8B93A7]">
                  {activeTemplate.description}
                </div>
              </div>
              <SectionTitle
                eyebrow="Documento"
                title="Identificação do contrato"
                description="Ajuste o título, a referência comercial e os dados das partes."
              />

              <Field
                label="Título principal"
                value={data.contractTitle}
                onChange={(value) => updateField('contractTitle', value)}
              />
              <Field
                label="Subtítulo / projeto"
                value={data.projectTitle}
                onChange={(value) => updateField('projectTitle', value)}
              />
              <Field
                label="Referência da proposta"
                value={data.proposalReference}
                onChange={(value) => updateField('proposalReference', value)}
                placeholder="Ex: Março de 2026"
              />

              <SectionTitle
                eyebrow="Partes"
                title="Contratante e contratada"
                description="O cliente selecionado preenche a contratante e a SouthMindly permanece como contratada."
              />

              <SelectField
                label="Contratante (cliente)"
                value={data.clienteId}
                onChange={handleClienteChange}
                options={clientes.map((cliente) => ({
                  value: cliente.id,
                  label: cliente.razaoSocial || cliente.id,
                }))}
                placeholder="Selecione o cliente"
              />

              {selectedCliente ? (
                <div className="mb-4 overflow-hidden rounded-[24px] border border-[#252A3A] bg-[linear-gradient(180deg,rgba(17,20,28,0.98),rgba(13,15,20,0.98))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
                  <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                    Cliente selecionado
                  </div>
                  <div className="mt-3 text-[18px] font-semibold text-[#F3F4F6]">
                    {selectedCliente.razaoSocial}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {selectedCliente.nomeContato ? (
                      <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                          Contato
                        </div>
                        <div className="mt-1 text-[13px] text-[#E8EAF0]">
                          {selectedCliente.nomeContato}
                          {selectedCliente.cargoContato
                            ? ` · ${selectedCliente.cargoContato}`
                            : ''}
                        </div>
                      </div>
                    ) : null}
                    {selectedCliente.endereco || selectedCliente.cidade ? (
                      <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                          Endereço
                        </div>
                        <div className="mt-1 text-[13px] text-[#E8EAF0]">
                          {selectedCliente.endereco || selectedCliente.cidade}
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
                      <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                          Telefone
                        </div>
                        <div className="mt-1 text-[13px] text-[#E8EAF0]">
                          {selectedCliente.telefoneContato}
                        </div>
                      </div>
                    ) : null}
                    <div className="rounded-2xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5 sm:col-span-2">
                      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                        CNPJ no contrato
                      </div>
                      <div className="mt-1 text-[13px] text-[#E8EAF0]">
                        {selectedCliente.cnpj ||
                          'Não informado no cadastro de clientes'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <SectionTitle
                eyebrow="Financeiro"
                title="Dados de fechamento"
                description="Defina a cidade de assinatura e os rótulos finais do documento."
              />

              <Field
                label="Cidade da assinatura"
                value={data.cidadeAssinatura}
                onChange={(value) => updateField('cidadeAssinatura', value)}
                placeholder="Ex: Caxias do Sul - RS"
              />
              <Field
                label="Assinatura contratante"
                value={data.assinaturaContratanteLabel}
                onChange={(value) =>
                  updateField('assinaturaContratanteLabel', value)
                }
              />
              <div className="mb-4 rounded-[20px] border border-[#252A3A] bg-[#13161D] p-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                  Contratada fixa
                </div>
                <div className="mt-2 text-[15px] font-semibold text-[#F3F4F6]">
                  {southMindlyContractInfo.nome}
                </div>
                <div className="mt-1 text-[12px] text-[#8B93A7]">
                  Todos os campos da contratada permanecem vinculados à
                  SouthMindly.
                </div>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-5 lg:p-[28px_32px]">
              <SectionTitle
                eyebrow="Cláusula 1"
                title="Objeto do contrato"
                description="Estruture o objeto e os parágrafos iniciais conforme o contrato de referência."
              />

              <TextAreaField
                label="Objeto"
                value={data.objectText}
                onChange={(value) => updateField('objectText', value)}
                rows={4}
              />
              <TextAreaField
                label="Parágrafo primeiro"
                value={data.objectAnnexClause}
                onChange={(value) => updateField('objectAnnexClause', value)}
                rows={3}
              />
              <TextAreaField
                label="Parágrafo segundo"
                value={data.objectStartClause}
                onChange={(value) => updateField('objectStartClause', value)}
                rows={3}
              />
              <div className="mb-4">
                <label className="mb-1.5 block text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                  Data de início da execução
                </label>
                <DatePicker
                  value={data.dataInicioExecucao}
                  onChange={(value) => updateField('dataInicioExecucao', value)}
                  placeholder="dd/mm/aaaa"
                  accentColor="#7C3AED"
                />
              </div>

              <SectionTitle
                eyebrow="Cláusula 2"
                title="Pagamento"
                description="Monte a cláusula de pagamento seguindo a estrutura do PDF de referência."
              />

              <TextAreaField
                label="Texto principal da cláusula"
                value={data.paymentSummary}
                onChange={(value) => updateField('paymentSummary', value)}
                rows={4}
              />
              <TextAreaField
                label="Parágrafo primeiro"
                value={data.paymentInstallmentClause}
                onChange={(value) =>
                  updateField('paymentInstallmentClause', value)
                }
                rows={4}
              />
              <TextAreaField
                label="Parágrafo segundo"
                value={data.paymentRenewalClause}
                onChange={(value) => updateField('paymentRenewalClause', value)}
                rows={3}
              />
              <TextAreaField
                label="Parágrafo terceiro"
                value={data.paymentDefaultClause}
                onChange={(value) => updateField('paymentDefaultClause', value)}
                rows={3}
              />
              <TextAreaField
                label="Parágrafo quarto"
                value={data.paymentLateFeeClause}
                onChange={(value) => updateField('paymentLateFeeClause', value)}
                rows={3}
              />

              <SectionTitle
                eyebrow="Cláusulas 3 a 7"
                title="Obrigações, revisões, rescisão e disposições gerais"
                description="Ajuste as responsabilidades das partes, a política de revisões e as cláusulas finais do contrato."
              />

              <TextAreaField
                label="Responsabilidades da contratante"
                value={data.responsabilidadesContratante}
                onChange={(value) =>
                  updateField('responsabilidadesContratante', value)
                }
                rows={5}
                placeholder="Uma responsabilidade por linha"
              />
              <TextAreaField
                label="Responsabilidades da contratada"
                value={data.responsabilidadesContratada}
                onChange={(value) =>
                  updateField('responsabilidadesContratada', value)
                }
                rows={5}
                placeholder="Uma responsabilidade por linha"
              />
              <TextAreaField
                label="Entregas e revisões"
                value={data.revisionDeliveryClause}
                onChange={(value) => updateField('revisionDeliveryClause', value)}
                rows={4}
              />
              <TextAreaField
                label="Texto de rescisão"
                value={data.rescisaoText}
                onChange={(value) => updateField('rescisaoText', value)}
                rows={3}
              />
              <TextAreaField
                label="Direitos e portfólio"
                value={data.generalRightsClause}
                onChange={(value) => updateField('generalRightsClause', value)}
                rows={4}
              />
              <TextAreaField
                label="Delegação e responsabilidades"
                value={data.generalDelegationClause}
                onChange={(value) =>
                  updateField('generalDelegationClause', value)
                }
                rows={3}
              />
              <TextAreaField
                label="Fechamento da cláusula geral"
                value={data.generalClosingClause}
                onChange={(value) => updateField('generalClosingClause', value)}
                rows={3}
              />

              <SectionTitle
                eyebrow="Anexo"
                title="Escopo do projeto"
                description="Os itens abaixo compõem o anexo que será impresso ao final do contrato."
              />

              <div className="grid gap-4 xl:grid-cols-2">
                {scopeSectionDefs.map((section) => (
                  <div
                    key={section.number}
                    className="rounded-[24px] border border-[#1E2130] bg-[#13161D] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.2)]"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7C3AED]">
                      {section.number}
                    </div>
                    <div className="mt-1 text-[16px] font-semibold text-[#F3F4F6]">
                      {section.title}
                    </div>
                    <div className="mt-2 text-[12px] leading-5 text-[#8B93A7]">
                      Um item por linha.
                    </div>
                    <div className="mt-4">
                      <TextAreaField
                        label="Itens"
                        value={data[section.key] as string}
                        onChange={(value) => updateField(section.key, value)}
                        rows={6}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <ContractPreview data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
