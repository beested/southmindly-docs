'use client';

import { useMemo } from 'react';

import { PropostaComercialData } from '@/types/docs';

import {
  budgetClosingParagraphs,
  budgetIntroParagraph,
  budgetScopeDefinitions,
  contractParagraphs,
  criticalAnalysisParagraphs,
  generalConditionsItems,
  methodologyIntroParagraph,
  methodologyScopeDefinitions,
  objectiveClosingParagraph,
  objectiveComplementaryItems,
  objectiveMainParagraph,
  paymentConditionsParagraph,
  presentationParagraphs,
  propostaBackgroundSrc,
  southMindlyLogoSrc,
} from './constants';
import { ClienteItem } from './types';
import { formatProposalVersion } from './utils';

function normalizeScopeLabel(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function PropostaPreview({
  proposta,
  cliente,
}: {
  proposta: PropostaComercialData;
  cliente?: ClienteItem;
}) {
  const footerVersionLabel = useMemo(
    () => formatProposalVersion(proposta.dataProposta),
    [proposta.dataProposta],
  );

  const clientCompanyLabel = cliente?.razaoSocial?.trim() || 'empresa cliente';
  const objectiveItems = useMemo(
    () =>
      objectiveComplementaryItems.map((item) =>
        item.replace('TOIGO', clientCompanyLabel),
      ),
    [clientCompanyLabel],
  );
  const methodologyScopes = useMemo(() => {
    const sortedEscopos = proposta.escopos
      .slice()
      .sort((a, b) => a.ordem - b.ordem);
    const scopes = sortedEscopos
      .map((escopo) => {
        const normalizedLabel = normalizeScopeLabel(
          `${escopo.nome} ${escopo.descricao} ${escopo.tipoCobranca}`,
        );

        return methodologyScopeDefinitions.find((definition) =>
          definition.aliases.some((alias) =>
            normalizedLabel.includes(normalizeScopeLabel(alias)),
          ),
        );
      })
      .filter(
        (
          definition,
          index,
          definitions,
        ): definition is (typeof methodologyScopeDefinitions)[number] =>
          Boolean(definition) &&
          definitions.findIndex((item) => item?.id === definition?.id) ===
            index,
      );

    return scopes;
  }, [proposta.escopos]);
  const budgetScopes = useMemo(
    () =>
      methodologyScopes
        .map((scope) =>
          budgetScopeDefinitions.find((budget) => budget.id === scope.id),
        )
        .filter((scope): scope is (typeof budgetScopeDefinitions)[number] =>
          Boolean(scope),
        ),
    [methodologyScopes],
  );
  const totalPages = 7;
  const renderFooter = (pageNumber: number) => (
    <div className="relative z-10 mt-auto flex items-center justify-between gap-6 border-t border-[#E5E7EB]/20 pt-4 text-[11px] font-mono text-[#8C92A4]">
      <div>
        Proposta de Prestação de Serviços para Assessoria de Marketing Digital
        {' - '}
        {footerVersionLabel}
      </div>
      <div>
        Pág. {pageNumber}/{totalPages}
      </div>
    </div>
  );

  return (
    <div
      id="preview-doc"
      className="mx-auto flex w-full max-w-[794px] flex-col gap-8 print:max-w-none print:gap-0"
    >
      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#0B0D12] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 mb-14 flex flex-col items-center pt-6 text-center">
          <img
            src={southMindlyLogoSrc}
            alt="SouthMindly"
            className="mb-12 h-16 w-auto object-contain"
          />

          <div className="text-sm font-mono uppercase tracking-[0.2em] text-[#6B7280]">
            Proposta N° {proposta.numeroProposta || '—'} (Rev.{' '}
            {proposta.revisao || '—'})
          </div>

          <div className="mt-3 text-sm font-mono tracking-[0.18em] text-[#8C92A4]">
            {[proposta.cidade || cliente?.cidade, proposta.dataProposta]
              .filter(Boolean)
              .join(' · ') || '—'}
          </div>

          <div className="mt-8 text-[42px] font-semibold uppercase leading-[1.05] tracking-[0.08em] text-[#E8EAF0]">
            <div>Proposta de</div>
            <div>Prestação de Serviços</div>
          </div>

          {cliente?.logoUrl && (
            <img
              src={cliente.logoUrl}
              alt={cliente.razaoSocial}
              className="mt-16 h-32 w-auto max-w-[340px] object-contain"
            />
          )}

          <div className="mt-4 text-lg font-medium text-[#E8EAF0]">
            {cliente?.nomeContato || '—'}
          </div>
        </div>

        {renderFooter(1)}
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-6">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Apresentação
            </div>
            <div className="mt-3 max-w-[520px] text-[30px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Conhecendo a SouthMindly
            </div>
          </div>

          <div className="mt-8 space-y-5 text-[15px] leading-7 text-[#D3D8E4]">
            {presentationParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {renderFooter(2)}
        </div>
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-6">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Objetivos
            </div>
            <div className="mt-3 max-w-[560px] text-[30px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Direcionamento estratégico da proposta
            </div>
          </div>

          <div className="mt-8 space-y-6 text-[15px] leading-7 text-[#D3D8E4]">
            <div className="space-y-2">
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Objetivo Principal:
              </div>
              <p>{objectiveMainParagraph}</p>
            </div>

            <div className="space-y-3">
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Objetivos Complementares:
              </div>
              <div className="space-y-3">
                {objectiveItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b19db]" />
                    <p className="flex-1">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <p>{objectiveClosingParagraph}</p>
          </div>

          {renderFooter(3)}
        </div>
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Metodologia de Atuação
            </div>
            <div className="mt-2 max-w-[560px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Escopos contemplados nesta proposta
            </div>
          </div>

          <div className="mt-5 flex-1 overflow-hidden">
            <p className="max-w-[660px] text-[13px] leading-6 text-[#D3D8E4]">
              {methodologyIntroParagraph}
            </p>

            {methodologyScopes.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {methodologyScopes.map((methodologyScope) => (
                  <div
                    key={methodologyScope.id}
                    className="rounded-2xl border border-[#252A3A] bg-[#0D0F1488] p-4"
                  >
                    <div className="text-[14px] font-semibold leading-5 text-[#F4F7FB]">
                      {methodologyScope.title}
                    </div>

                    <div className="mt-3 space-y-2">
                      {methodologyScope.items.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b19db]" />
                          <p className="flex-1 text-[12px] leading-5 text-[#D3D8E4]">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-[#252A3A] bg-[#0D0F1488] p-6 text-sm leading-7 text-[#D3D8E4]">
                Nenhum texto de metodologia foi configurado para os escopos
                selecionados.
              </div>
            )}
          </div>

          {renderFooter(4)}
        </div>
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Planejamento Orçamentário
            </div>
            <div className="mt-2 max-w-[620px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Valores para cada opção apresentada
            </div>
          </div>

          <div className="mt-5 flex-1 overflow-hidden">
            <p className="text-[14px] leading-6 text-[#D3D8E4]">
              {budgetIntroParagraph}
            </p>

            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3">
                <div className="rounded-xl border border-[#35204D] bg-[linear-gradient(180deg,#6b19db_0%,#12051d_100%)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
                  Escopo
                </div>
                <div className="rounded-xl border border-[#35204D] bg-[linear-gradient(180deg,#6b19db_0%,#12051d_100%)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
                  Periodicidade
                </div>
                <div className="rounded-xl border border-[#35204D] bg-[linear-gradient(180deg,#6b19db_0%,#12051d_100%)] px-4 py-3 text-center text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
                  Investimento
                </div>
              </div>

              {budgetScopes.length > 0 ? (
                budgetScopes.map((scope) =>
                  scope.rows.map((row, rowIndex) => (
                    <div
                      key={`${scope.id}-${rowIndex}`}
                      className="grid grid-cols-[1.2fr_1fr_1fr] gap-3"
                    >
                      <div className="rounded-2xl border border-[#252A3A] bg-[#0D0F1488] px-4 py-4 text-center text-[13px] font-semibold leading-5 text-[#F4F7FB]">
                        {rowIndex === 0
                          ? scope.label
                          : `${scope.label} · opção ${rowIndex + 1}`}
                      </div>
                      <div className="rounded-2xl border border-[#252A3A] bg-[#0D0F1488] px-4 py-4 text-center text-[13px] font-medium leading-5 text-[#D3D8E4]">
                        {row.periodicidade}
                      </div>
                      <div className="rounded-2xl border border-[#252A3A] bg-[#111624] px-4 py-4 text-center text-[13px] font-semibold leading-5 text-[#F4F7FB]">
                        {row.investimento}
                      </div>
                    </div>
                  )),
                )
              ) : (
                <div className="rounded-2xl border border-[#252A3A] bg-[#0D0F1488] px-4 py-6 text-center text-[13px] font-medium leading-5 text-[#D3D8E4]">
                  Nenhum escopo selecionado para composição do planejamento
                  orçamentário.
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3 text-[13px] leading-6 text-[#D3D8E4]">
              {budgetClosingParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          {renderFooter(5)}
        </div>
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Condições Comerciais
            </div>
            <div className="mt-2 max-w-[620px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Pagamento e formalização contratual
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-8 overflow-hidden">
            <section>
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Condições de Pagamento
              </div>
              <p className="mt-4 text-[15px] leading-7 text-[#D3D8E4]">
                {paymentConditionsParagraph}
              </p>
            </section>

            <section>
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Contrato
              </div>
              <div className="mt-4 space-y-4">
                {contractParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-7 text-[#D3D8E4]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          </div>

          {renderFooter(6)}
        </div>
      </div>

      <div
        className="proposal-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
        style={{
          backgroundImage: `url(${propostaBackgroundSrc})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Dados Complementares
            </div>
            <div className="mt-2 max-w-[620px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Condições gerais e análise crítica do cliente
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-8 overflow-hidden">
            <section>
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Condições Gerais
              </div>
              <div className="mt-4 space-y-3">
                {generalConditionsItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b19db]" />
                    <p className="flex-1 text-[15px] leading-7 text-[#D3D8E4]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="text-[18px] font-semibold text-[#F4F7FB]">
                Análise Crítica do Cliente
              </div>
              <div className="mt-4 space-y-4">
                {criticalAnalysisParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-7 text-[#D3D8E4]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[#6b19db] bg-[#F3F4F6] text-[#111111]">
              <div className="grid grid-cols-2">
                <div className="border-r border-[#6b19db] p-5">
                  <div className="text-[15px] font-semibold">
                    Atenciosamente,
                  </div>
                  <div className="mt-4 h-[120px] w-[170px]">
                    <img
                      src="/assinatura-felipe.png"
                      alt="Assinatura Felipe Susin"
                      className="h-full w-full object-contain object-left"
                    />
                  </div>
                  <div className="mt-4 space-y-0.5 text-[12px] font-semibold leading-6">
                    <div>Felipe Susin</div>
                    <div>Assessor de Marketing Digital</div>
                    <div>felipepereira.susin1@gmail.com</div>
                    <div>(54) 99255-2959</div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[15px] font-semibold">
                    Responsável pelo aceite
                  </div>

                  <div className="mt-20 border-b-2 border-[#111111]" />
                  <div className="mt-2 max-w-[360px] text-[12px] leading-5 text-[#2A2A2A]">
                    Nome e assinatura do responsável de aceite por esta
                    proposta.
                  </div>

                  <div className="mt-14 text-[12px] font-medium">
                    ____/____/____
                  </div>
                  <div className="mt-1 text-[12px] text-[#2A2A2A]">
                    Data de aceite da proposta
                  </div>
                </div>
              </div>
            </section>
          </div>

          {renderFooter(7)}
        </div>
      </div>
    </div>
  );
}
