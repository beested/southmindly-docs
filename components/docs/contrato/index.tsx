'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, SelectField, TextAreaField } from '@/components/ui/inputs';
import { DatePicker } from '@/components/ui/inputs/date-picker';
import { Eye, FilePlus2, Pencil, Printer } from 'lucide-react';

import {
  contractPrintStyles,
  defaultContratoData,
  scopeSectionDefs,
} from './constants';
import { ContractPreview } from './preview';
import { ClienteItem, ContratoData, ContratoProps } from './types';

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
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [clientes, setClientes] = useState<ClienteItem[]>([]);

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
        contratadaNome: cliente?.razaoSocial || '',
        contratadaCnpj: cliente?.cnpj || '',
        contratadaEndereco: cliente?.cidade || '',
      }));
    },
    [clientes],
  );

  const resetDocument = useCallback(() => {
    setData({ ...defaultContratoData });
    setActiveTab('editor');
  }, []);

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
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        {activeTab === 'editor' ? (
          <div className="grid min-h-[calc(100vh-60px)] grid-cols-1 lg:grid-cols-[360px_1fr]">
            <div className="overflow-y-auto border-b border-[#1E2130] bg-[#13161D] p-4 sm:p-5 lg:border-b-0 lg:border-r lg:p-[28px_24px]">
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
                description="A SouthMindly fica como contratante e o cliente selecionado preenche a contratada."
              />

              <SelectField
                label="Contratada (cliente)"
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
                description="Defina foro, cidade de assinatura e os rótulos finais do documento."
              />

              <Field
                label="Foro"
                value={data.foroCidadeUf}
                onChange={(value) => {
                  updateField('foroCidadeUf', value);
                  updateField('cidadeAssinatura', value);
                }}
                placeholder="Ex: Porto Alegre/RS"
              />
              <Field
                label="Assinatura contratante"
                value={data.assinaturaContratanteLabel}
                onChange={(value) =>
                  updateField('assinaturaContratanteLabel', value)
                }
              />
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

              <SectionTitle
                eyebrow="Cláusulas 3 a 7"
                title="Obrigações, rescisão e disposições gerais"
                description="Siga a mesma organização do PDF-base para responsabilidades e encerramento."
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
                description="O anexo segue o escopo do website e será impresso ao final do contrato."
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
