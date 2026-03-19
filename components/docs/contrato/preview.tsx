'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { scopeSectionDefs } from './constants';
import { ContratoData } from './types';

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatGeneratedDate(value: Date) {
  return format(value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function PartyCard({
  title,
  name,
  cnpj,
  address,
}: {
  title: string;
  name: string;
  cnpj: string;
  address: string;
}) {
  return (
    <div className="contract-no-print-shadow rounded-[20px] border border-[#D1D5DB] bg-[#FAFAFA] p-5">
      <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
        {title}
      </div>
      <div className="mt-3 text-[18px] font-semibold leading-tight text-[#111827]">
        {name}
      </div>
      <div className="mt-3 space-y-1.5 text-[13px] leading-6 text-[#374151]">
        <div>
          <span className="font-medium text-[#111827]">CNPJ:</span> {cnpj}
        </div>
        <div>
          <span className="font-medium text-[#111827]">Endereço:</span>{' '}
          {address}
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  number,
  title,
  children,
  avoidBreak = true,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  avoidBreak?: boolean;
}) {
  return (
    <section className={avoidBreak ? 'break-inside-avoid' : ''}>
      <div className="border-b border-[#E5E7EB] pb-2">
        <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
          Cláusula {number}
        </div>
        <h2 className="mt-1 text-[18px] font-semibold text-[#111827]">
          {title}
        </h2>
      </div>
      <div className="mt-4 space-y-3 text-[14px] leading-7 text-[#374151]">
        {children}
      </div>
    </section>
  );
}

export function ContractPreview({ data }: { data: ContratoData }) {
  const responsabilidadesContratante = splitLines(
    data.responsabilidadesContratante,
  );
  const responsabilidadesContratada = splitLines(
    data.responsabilidadesContratada,
  );
  const signatureLocation = data.foroCidadeUf.trim() || 'Cidade não informada';
  const generatedDateLabel = formatGeneratedDate(new Date());
  const contratadaSignatureLabel =
    data.contratadaNome.trim() || data.assinaturaContratadaLabel;

  return (
    <div
      id="contract-print-root"
      className="mx-auto w-full max-w-[980px] px-3 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8 print:max-w-none print:p-0"
    >
      <article className="contract-paper contract-no-print-shadow mx-auto w-full max-w-[860px] rounded-[32px] border border-[#D1D5DB] bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:p-8 lg:p-12">
        <header className="border-b border-[#E5E7EB] pb-8 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#6B7280]">
            Documento Contratual
          </div>
          <h1 className="mt-4 text-[28px] font-semibold tracking-[0.03em] text-[#111827] sm:text-[32px]">
            {data.contractTitle}
          </h1>
          <div className="mt-2 text-[15px] font-medium uppercase tracking-[0.16em] text-[#4B5563]">
            {data.projectTitle}
          </div>
          <div className="mt-4 text-[13px] text-[#6B7280]">
            Referência comercial: {data.proposalReference}
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <PartyCard
            title="Contratante"
            name={data.contratanteNome}
            cnpj={data.contratanteCnpj}
            address={data.contratanteEndereco}
          />
          <PartyCard
            title="Contratada"
            name={data.contratadaNome}
            cnpj={data.contratadaCnpj}
            address={data.contratadaEndereco}
          />
        </section>

        <div className="mt-6 text-[14px] leading-7 text-[#374151]">
          Tem entre si, justo e contratado, o presente contrato de prestação de
          serviços, mediante as cláusulas e condições seguintes:
        </div>

        <div className="mt-10 space-y-8">
          <PreviewSection number="1" title="Das Partes">
            <p>
              As partes acima identificadas celebram o presente instrumento,
              reconhecendo-se mutuamente aptas para contratar e assumir as
              obrigações ora estabelecidas.
            </p>
          </PreviewSection>

          <PreviewSection number="2" title="Objeto do Contrato">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA PRIMEIRA:
              </span>{' '}
              {data.objectText}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Primeiro:
              </span>{' '}
              {data.objectAnnexClause}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Segundo:
              </span>{' '}
              {data.objectStartClause}
              {data.dataInicioExecucao
                ? ` Início previsto em ${data.dataInicioExecucao}.`
                : ''}
            </p>
          </PreviewSection>

          <PreviewSection number="3" title="Pagamento">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA SEGUNDA:
              </span>{' '}
              {data.paymentSummary}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Primeiro:
              </span>{' '}
              {data.paymentInstallmentClause}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Segundo:
              </span>{' '}
              {data.paymentRenewalClause}
            </p>
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Terceiro:
              </span>{' '}
              {data.paymentDefaultClause}
            </p>
          </PreviewSection>

          <PreviewSection number="4" title="Obrigações da Contratante">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA TERCEIRA:
              </span>{' '}
              A CONTRATANTE se obriga a desenvolver o serviço objeto do contrato
              dentro das especificações aprovadas e utilizando os recursos
              previstos no anexo deste instrumento.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {responsabilidadesContratante.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PreviewSection>

          <PreviewSection number="5" title="Obrigações da Contratada">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA QUARTA:
              </span>{' '}
              São obrigações da CONTRATADA:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {responsabilidadesContratada.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PreviewSection>

          <PreviewSection number="6" title="Da Rescisão">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA QUINTA:
              </span>{' '}
              {data.rescisaoText}
            </p>
          </PreviewSection>

          <PreviewSection number="7" title="Disposições Gerais">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA SEXTA:
              </span>{' '}
              {data.generalRightsClause}
            </p>
            <p>{data.generalDelegationClause}</p>
            <p>
              Fica eleito o foro da comarca de{' '}
              <span className="font-semibold text-[#111827]">
                {data.foroCidadeUf}
              </span>{' '}
              para dirimir quaisquer dúvidas oriundas deste contrato.
            </p>
            <p>{data.generalClosingClause}</p>
          </PreviewSection>

          <PreviewSection number="8" title="Anexo" avoidBreak={false}>
            <p>
              Escopo do projeto de reconstrução de website que integra este
              contrato:
            </p>

            <div className="grid items-start gap-3 md:grid-cols-2">
              {scopeSectionDefs.map((section) => {
                const items = splitLines(data[section.key] as string);

                return (
                  <div
                    key={section.number}
                    className="contract-annex-card break-inside-avoid rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3"
                  >
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                      {section.number}
                    </div>
                    <div className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {section.title}
                    </div>
                    <div className="mt-2 text-[13px] leading-6 text-[#374151]">
                      {items.length > 0
                        ? items.join(' • ')
                        : 'Escopo não informado.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </PreviewSection>

          <div className=" rounded-[30px] border border-[#D1D5DB] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-6 py-2 sm:px-8 sm:py-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#6B7280]">
              Assinaturas
            </div>
            <div className="mt-3 text-[14px] text-[#374151]">
              {signatureLocation},{' '}
              <span className="font-medium capitalize text-[#111827]">
                {generatedDateLabel}
              </span>
            </div>

            <div className="mt-20 grid gap-12 md:grid-cols-2">
              <div className="flex flex-col">
                <div className="h-px bg-[#111827]" />
                <div className="mt-4 text-[15px] font-semibold text-[#111827]">
                  {data.contratanteNome}
                </div>
                <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  {data.assinaturaContratanteLabel}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="h-px bg-[#111827]" />
                <div className="mt-4 text-[15px] font-semibold text-[#111827]">
                  {contratadaSignatureLabel}
                </div>
                <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280]">
                  {data.assinaturaContratadaLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
