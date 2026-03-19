'use client';

import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';

import {
  meetingBackgroundSrc,
  southMindlyLogoSrc,
} from './constants';
import { AlinhamentoReuniaoData, ClienteItem } from './types';

function parseBrDate(value: string) {
  if (!value) return null;
  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  return isValid(parsed) ? parsed : null;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatVersion(dateBR: string) {
  const parsed = parseBrDate(dateBR);

  if (!parsed) {
    const now = new Date();
    return `Versão ${capitalize(format(now, 'MMMM', { locale: ptBR }))} ${format(now, 'yyyy')}`;
  }

  return `Versão ${capitalize(format(parsed, 'MMMM', { locale: ptBR }))} ${format(parsed, 'yyyy')}`;
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSections(value: string) {
  return value
    .split(/\n\s*\n/)
    .map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .filter((lines) => lines.length > 0)
    .map((lines) => ({
      title: lines[0]?.replace(/:$/, '') || 'Seção',
      items: lines.slice(1),
    }));
}

function formatDateWithWeekday(value: string) {
  const parsed = parseBrDate(value);
  if (!parsed) return value || 'A definir';

  return `${format(parsed, 'dd/MM/yyyy')} - ${capitalize(
    format(parsed, 'EEEE', { locale: ptBR }),
  )}`;
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

function Footer({
  title,
  pageNumber,
  totalPages,
}: {
  title: string;
  pageNumber: number;
  totalPages: number;
}) {
  return (
    <div className="relative z-10 mt-auto flex items-center justify-between gap-6 border-t border-[#E5E7EB]/20 pt-4 text-[11px] font-mono text-[#8C92A4]">
      <div>{title}</div>
      <div>
        Pág. {pageNumber}/{totalPages}
      </div>
    </div>
  );
}

function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="meeting-page relative flex h-[1123px] w-full flex-col overflow-hidden rounded-2xl bg-[#05070B] p-10 text-[#E8EAF0] shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
      style={{
        backgroundImage: `url(${meetingBackgroundSrc})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {children}
    </div>
  );
}

function MeetingDocumentPages({
  data,
  cliente,
}: {
  data: AlinhamentoReuniaoData;
  cliente?: ClienteItem;
}) {
  const totalPages = 3;
  const primaryService = data.servicos[0]?.nome?.trim() || 'Reunião';
  const footerTitle = `ALINHAMENTO REUNIÃO | ${primaryService.toUpperCase()} - ${formatVersion(
    data.dataReuniao,
  )}`;
  const objectives = splitLines(data.objetivosReuniao);
  const sections = parseSections(data.assuntosTratados);
  const proposalConsiderations = splitLines(data.consideracoesProposta);
  const reportIndicators = splitLines(data.indicadoresRelatorio);
  const participants = data.participantes
    .map((participant) => participant.nome.trim())
    .filter(Boolean);

  return (
    <>
      <Page>
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-6">
            <Image
              src={southMindlyLogoSrc}
              alt="SouthMindly"
              width={665}
              height={138}
              className="h-12 w-auto object-contain"
            />
            <div className="rounded-full border border-[#252A3A] bg-[#0D0F1488] px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] text-[#A78BFA]">
              Documento Operacional
            </div>
          </div>

          <div className="mt-7 border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Alinhamento de Reunião
            </div>
            <div className="mt-2.5 max-w-[620px] text-[30px] font-semibold leading-[1.05] text-[#F4F7FB]">
              Estruturação da reunião comercial para evolução da proposta.
            </div>
            <div className="mt-3 text-[13px] leading-6 text-[#D3D8E4]">
              Serviço em foco: <span className="font-semibold">{primaryService}</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-[1.22fr_0.78fr] gap-3.5">
            <div className="rounded-[22px] border border-[#252A3A] bg-[#0D0F1488] p-4.5">
              <div className="flex items-center justify-between gap-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  Informações da reunião
                </div>
                <div className="rounded-full border border-[#2A3143] bg-[#121620] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-[#A78BFA]">
                  Cliente vinculado
                </div>
              </div>

              <div className="mt-3.5 rounded-[20px] border border-[#1E2130] bg-[#13161D]/95 p-3.5">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-[68px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-[#2D3345] bg-[#0B0D12]">
                    {cliente?.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cliente.logoUrl}
                        alt={cliente.razaoSocial}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-[18px] font-semibold uppercase tracking-[0.14em] text-[#A78BFA]">
                        {getClientInitials(cliente)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold leading-tight text-[#F4F7FB]">
                      {cliente?.razaoSocial || 'Cliente não selecionado'}
                    </div>
                    {cliente?.nomeContato ? (
                      <div className="mt-1 text-[12px] leading-5 text-[#AEB5C6]">
                        {cliente.nomeContato}
                        {cliente.cargoContato
                          ? ` · ${cliente.cargoContato}`
                          : ''}
                      </div>
                    ) : (
                      <div className="mt-1 text-[12px] leading-5 text-[#7F8799]">
                        Selecione um cliente para exibir os dados no documento
                      </div>
                    )}
                    <div className="mt-2.5 text-[11px] uppercase tracking-[0.12em] text-[#6B7280]">
                      Contexto da reunião
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                    <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                      Data
                    </div>
                    <div className="mt-1 text-[13px] font-medium text-[#F4F7FB]">
                      {data.dataReuniao || 'A definir'}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                    <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                      Horário
                    </div>
                    <div className="mt-1 text-[13px] font-medium text-[#F4F7FB]">
                      {data.horaReuniao || 'A definir'}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                    <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                      Local
                    </div>
                    <div className="mt-1 text-[13px] font-medium text-[#F4F7FB]">
                      {data.localReuniao || 'A definir'}
                    </div>
                  </div>
                  {cliente?.cidade ? (
                    <div className="rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                      <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                        Cidade
                      </div>
                      <div className="mt-1 text-[12px] text-[#E6EAF2]">
                        {cliente.cidade}
                      </div>
                    </div>
                  ) : null}
                  {cliente?.telefoneContato ? (
                    <div className="rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                      <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                        Telefone
                      </div>
                      <div className="mt-1 text-[12px] text-[#E6EAF2]">
                        {cliente.telefoneContato}
                      </div>
                    </div>
                  ) : null}
                  {cliente?.emailContato ? (
                    <div className="col-span-2 rounded-xl border border-[#202636] bg-[#0D0F14] p-3">
                      <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                        E-mail
                      </div>
                      <div className="mt-1 break-all text-[12px] text-[#E6EAF2]">
                        {cliente.emailContato}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="rounded-[22px] border border-[#252A3A] bg-[#0D0F1488] p-4.5">
              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                Participantes
              </div>
              <div className="mt-3.5 space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center gap-2.5 rounded-xl border border-[#1E2130] bg-[#13161D] px-3.5 py-2.5"
                  >
                    <span className="size-2 rounded-full bg-[#6b19db]" />
                    <span className="text-[13px] text-[#F4F7FB]">
                      {participant}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[22px] border border-[#252A3A] bg-[#0D0F1488] p-4.5">
            <div className="flex items-end justify-between gap-4 border-b border-[#E5E7EB]/10 pb-2.5">
              <div>
                <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
                  Objetivos da reunião
                </div>
                <div className="mt-1.5 text-[12px] leading-5 text-[#9CA3AF]">
                  Direcionamentos centrais alinhados para a evolução da proposta.
                </div>
              </div>
              <div className="rounded-full border border-[#2A3143] bg-[#121620] px-3 py-1 text-[9px] font-mono uppercase tracking-[0.16em] text-[#A78BFA]">
                {objectives.length || 0} pontos
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {objectives.length > 0 ? (
                objectives.map((objective, index) => (
                  <div
                    key={objective}
                    className="rounded-xl border border-[#202636] bg-[#0D0F14] px-3 py-2.5"
                  >
                    <div className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                      Objetivo {String(index + 1).padStart(2, '0')}
                    </div>
                    <p className="mt-1.5 text-[12px] leading-5 text-[#E6EAF2]">
                      {objective}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-xl border border-dashed border-[#2A3143] bg-[#0D0F14] px-4 py-4 text-[12px] text-[#7F8799]">
                  Nenhum objetivo foi preenchido para esta reunião.
                </div>
              )}
            </div>
          </div>

          <Footer title={footerTitle} pageNumber={1} totalPages={totalPages} />
        </div>
      </Page>

      <Page>
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Assuntos Tratados
            </div>
            <div className="mt-2 max-w-[620px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Pontos centrais apresentados e alinhados durante a reunião
            </div>
          </div>

          <div className="mt-5 flex-1 overflow-hidden">
            <div className="flex h-full overflow-hidden rounded-[28px] border border-[#252A3A] bg-[linear-gradient(180deg,rgba(13,15,20,0.95),rgba(8,10,15,0.95))]">
              <div className="flex min-w-0 flex-1 flex-col border-r border-[#202636] px-6 py-5">
                <div className="border-b border-[#E5E7EB]/10 pb-3">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                    Panorama operacional
                  </div>
                  <div className="mt-2 text-[20px] font-semibold leading-tight text-[#F4F7FB]">
                    Temas estruturados ao longo do alinhamento
                  </div>
                </div>

                {sections.length > 0 ? (
                  <div className="mt-5 flex-1 space-y-5 overflow-hidden">
                    {sections.map((section) => (
                      <section
                        key={section.title}
                        className="border-b border-[#202636] pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-end justify-between gap-4">
                          <div className="text-[17px] font-semibold leading-tight text-[#F4F7FB]">
                            {section.title}
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#A78BFA]">
                            {section.items.length} itens
                          </div>
                        </div>
                        <div className="mt-3 space-y-2.5">
                          {section.items.map((item, index) => (
                            <div
                              key={`${section.title}-${item}`}
                              className="flex items-start gap-3"
                            >
                              <div className="min-w-[22px] text-[10px] font-mono uppercase tracking-[0.12em] text-[#A78BFA]">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                              <p className="flex-1 text-[13px] leading-6 text-[#D3D8E4]">
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center text-center text-[14px] leading-6 text-[#7F8799]">
                    Nenhum assunto tratado foi registrado para esta reunião.
                  </div>
                )}
              </div>

              <aside className="flex w-[260px] shrink-0 flex-col px-5 py-5">
                <div className="border-b border-[#E5E7EB]/10 pb-3">
                  <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
                    Diretrizes integradas
                  </div>
                  <div className="mt-2 text-[18px] font-semibold leading-tight text-[#F4F7FB]">
                    Operação e cronograma
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="border-b border-[#202636] pb-3">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Entrega para aprovação
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#D3D8E4]">
                      {data.diaEntregaAprovacao || 'A definir'}
                    </div>
                  </div>
                  <div className="border-b border-[#202636] pb-3">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Prazo de aprovação
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#D3D8E4]">
                      {data.prazoMaximoAprovacao || 'A definir'}
                    </div>
                  </div>
                  <div className="border-b border-[#202636] pb-3">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Postagem fixa
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#D3D8E4]">
                      {data.diaHorarioPostagem || 'A definir'}
                    </div>
                  </div>
                  <div className="border-b border-[#202636] pb-3">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Atividades incluídas
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#D3D8E4]">
                      {data.atividadesIncluidas || 'A definir'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Data de início
                    </div>
                    <div className="mt-1 text-[13px] leading-6 text-[#D3D8E4]">
                      {formatDateWithWeekday(data.dataInicioContrato)}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <Footer title={footerTitle} pageNumber={2} totalPages={totalPages} />
        </div>
      </Page>

      <Page>
        <div className="relative z-10 flex h-full flex-col">
          <div className="border-b border-[#E5E7EB]/20 pb-5">
            <div className="text-sm font-mono uppercase tracking-[0.22em] text-[#6b19db]">
              Escopo e Condições
            </div>
            <div className="mt-2 max-w-[620px] text-[28px] font-semibold leading-[1.1] text-[#F4F7FB]">
              Serviço selecionado, investimento e condições comerciais
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-5 overflow-hidden">
            {data.servicos.map((service, index) => (
              <section
                key={service.id}
                className="rounded-[24px] border border-[#252A3A] bg-[#0D0F1488] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                      Serviço escolhido ({index === 0 ? 'Primeiro Momento' : `${index + 1}º momento`})
                    </div>
                    <div className="mt-2 text-[22px] font-semibold text-[#F4F7FB]">
                      {service.nome}
                    </div>
                  </div>
                  <div className="rounded-full border border-[#34D39933] bg-[#34D39914] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[#34D399]">
                    {service.valor || 'Valor a definir'}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#1E2130] bg-[#13161D] px-4 py-3 text-[15px] font-medium text-[#F4F7FB]">
                  {service.detalhamento || 'Detalhamento a definir'}
                </div>

                <div className="mt-4 text-[14px] leading-7 text-[#D3D8E4]">
                  {service.descricao || 'Descrição não informada.'}
                </div>
              </section>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <section className="rounded-[24px] border border-[#252A3A] bg-[#0D0F1488] p-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  Condições comerciais
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Forma de pagamento
                    </div>
                    <div className="mt-1 text-[14px] leading-6 text-[#F4F7FB]">
                      {data.formaPagamento || 'A definir'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Prazo de contrato
                    </div>
                    <div className="mt-1 text-[14px] leading-6 text-[#F4F7FB]">
                      {data.prazoContrato || 'A definir'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Emissão de notas fiscais
                    </div>
                    <div className="mt-1 text-[14px] leading-6 text-[#F4F7FB]">
                      {data.emissaoNotaFiscal || 'A definir'}
                    </div>
                  </div>
                  {proposalConsiderations.length > 0 ? (
                    <div className="border-t border-[#E5E7EB]/10 pt-4">
                      <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                        Direcionamento comercial
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {proposalConsiderations.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-xl border border-[#1E2130] bg-[#11141C] px-3.5 py-3"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b19db]" />
                            <p className="flex-1 text-[13px] leading-6 text-[#D3D8E4]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#252A3A] bg-[#0D0F1488] p-5">
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  Acompanhamento
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                      Observações
                    </div>
                    <div className="mt-1 text-[14px] leading-6 text-[#F4F7FB]">
                      {data.observacoes || 'Sem observações adicionais.'}
                    </div>
                  </div>
                  {reportIndicators.length > 0 ? (
                    <div className="border-t border-[#E5E7EB]/10 pt-4">
                      <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#8C92A4]">
                        Relatórios e indicadores
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {reportIndicators.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-xl border border-[#1E2130] bg-[#11141C] px-3.5 py-3"
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#6b19db]" />
                            <p className="flex-1 text-[13px] leading-6 text-[#D3D8E4]">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>

          <Footer title={footerTitle} pageNumber={3} totalPages={totalPages} />
        </div>
      </Page>
    </>
  );
}

export function MeetingPreview({
  data,
  cliente,
}: {
  data: AlinhamentoReuniaoData;
  cliente?: ClienteItem;
}) {
  return (
    <>
      <div
        id="meeting-preview-doc"
        className="mx-auto flex w-full max-w-[794px] flex-col gap-8"
      >
        <MeetingDocumentPages data={data} cliente={cliente} />
      </div>

      <div id="meeting-print-root" className="hidden" aria-hidden="true">
        <MeetingDocumentPages data={data} cliente={cliente} />
      </div>
    </>
  );
}
