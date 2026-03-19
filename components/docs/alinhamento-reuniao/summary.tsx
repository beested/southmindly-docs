'use client';

import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AlinhamentoReuniaoData } from './types';

const DATE_MASK = 'dd/MM/yyyy';

function parseBrDate(value: string) {
  if (!value) return null;
  const parsed = parse(value, DATE_MASK, new Date());
  return isValid(parsed) ? parsed : null;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDateWithWeekday(value: string) {
  const parsed = parseBrDate(value);
  if (!parsed) return value || 'Não definido';

  const weekday = capitalize(format(parsed, 'EEEE', { locale: ptBR }));
  return `${format(parsed, DATE_MASK)} - ${weekday}`;
}

function formatSimpleDate(value: string) {
  const parsed = parseBrDate(value);
  if (!parsed) return value || 'Não definido';
  return `${format(parsed, DATE_MASK)} - ${capitalize(
    format(parsed, 'EEEE', { locale: ptBR }),
  )}`;
}

function SummaryCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-[#1E2130] bg-[#13161D] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.24)] sm:p-6">
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#7C3AED]">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-[20px] font-semibold text-[#F3F4F6]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SummaryField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1E2130] bg-[#0D0F14] p-4">
      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
        {label}
      </div>
      <div className="mt-2 text-sm leading-6 text-[#E8EAF0]">
        {value || 'Não definido'}
      </div>
    </div>
  );
}

export function MeetingSummary({
  data,
}: {
  data: AlinhamentoReuniaoData;
}) {
  const participantes = data.participantes
    .map((participant) => participant.nome.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6">
      <div className="rounded-[28px] border border-[#1E2130] bg-[radial-gradient(circle_at_top_left,#1D2A4A_0%,#13161D_38%,#0D0F14_100%)] p-6 shadow-[0_26px_70px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#4F7EFF]">
          Resumo estruturado
        </div>
        <h1 className="mt-4 max-w-[760px] text-[30px] font-semibold leading-[1.05] text-[#F8FAFC] sm:text-[36px]">
          Alinhamento de reunião pronto para orientar a proposta comercial.
        </h1>
        <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[#94A3B8]">
          Este documento consolida participantes, serviços discutidos,
          cronograma operacional e condições comerciais acordadas.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <SummaryField label="Data da reunião" value={formatSimpleDate(data.dataReuniao)} />
          <SummaryField label="Data de início" value={formatDateWithWeekday(data.dataInicioContrato)} />
          <SummaryField
            label="Serviços mapeados"
            value={`${data.servicos.length} item(ns) selecionado(s)`}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SummaryCard eyebrow="Reunião" title="Informações básicas">
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryField label="Data" value={formatSimpleDate(data.dataReuniao)} />
            <SummaryField label="Hora" value={data.horaReuniao || 'Não definido'} />
            <SummaryField label="Local" value={data.localReuniao || 'Não definido'} />
            <SummaryField
              label="Prazo máximo para aprovação"
              value={data.prazoMaximoAprovacao || 'Não definido'}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-[#1E2130] bg-[#0D0F14] p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
              Participantes
            </div>
            <div className="mt-3 space-y-2">
              {participantes.length > 0 ? (
                participantes.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center gap-3 rounded-xl border border-[#1E2130] bg-[#13161D] px-3 py-2.5 text-sm text-[#E8EAF0]"
                  >
                    <span className="size-2 rounded-full bg-[#7C3AED]" />
                    {participant}
                  </div>
                ))
              ) : (
                <div className="text-sm text-[#8B93A7]">
                  Nenhum participante informado.
                </div>
              )}
            </div>
          </div>
        </SummaryCard>

        <SummaryCard eyebrow="Operação" title="Cronograma e entregas">
          <div className="space-y-3">
            <SummaryField
              label="Dia fixo de entrega para aprovação"
              value={data.diaEntregaAprovacao || 'Não definido'}
            />
            <SummaryField
              label="Dia e horário fixo de postagem"
              value={data.diaHorarioPostagem || 'Não definido'}
            />
            <SummaryField
              label="Atividades incluídas"
              value={data.atividadesIncluidas || 'Não definido'}
            />
          </div>
        </SummaryCard>
      </div>

      <SummaryCard eyebrow="Serviços" title="Escopo selecionado na reunião">
        <div className="space-y-4">
          {data.servicos.length > 0 ? (
            data.servicos.map((service, index) => (
              <div
                key={service.id}
                className="rounded-[22px] border border-[#1E2130] bg-[#0D0F14] p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                      Serviço escolhido ({index + 1}º momento)
                    </div>
                    <h3 className="mt-2 text-[19px] font-semibold text-[#F3F4F6]">
                      {service.nome || 'Serviço sem nome'}
                    </h3>
                    {service.descricao ? (
                      <p className="mt-2 text-sm leading-6 text-[#A7AFBF]">
                        {service.descricao}
                      </p>
                    ) : null}
                  </div>
                  <div className="rounded-full border border-[#34D39933] bg-[#34D39914] px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[#34D399]">
                    {service.valor || 'Valor a definir'}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#1E2130] bg-[#13161D] px-4 py-3 text-sm text-[#E8EAF0]">
                  {service.detalhamento || 'Detalhamento não informado'}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#252A3A] bg-[#11141C] p-6 text-sm text-[#8B93A7]">
              Nenhum serviço foi associado a esta reunião.
            </div>
          )}
        </div>
      </SummaryCard>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SummaryCard eyebrow="Comercial" title="Condições acordadas">
          <div className="grid gap-3">
            <SummaryField
              label="Forma de pagamento"
              value={data.formaPagamento || 'Não definido'}
            />
            <SummaryField
              label="Prazo de contrato"
              value={data.prazoContrato || 'Não definido'}
            />
            <SummaryField
              label="Emissão de nota fiscal"
              value={data.emissaoNotaFiscal || 'Não definido'}
            />
          </div>
        </SummaryCard>

        <SummaryCard eyebrow="Notas" title="Observações adicionais">
          <div className="rounded-2xl border border-[#1E2130] bg-[#0D0F14] p-4 text-sm leading-7 text-[#E8EAF0]">
            {data.observacoes || 'Nenhuma observação registrada.'}
          </div>
        </SummaryCard>
      </div>
    </div>
  );
}
