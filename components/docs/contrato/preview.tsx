'use client';

import {
  getAnnexIntro,
  getScopeFieldValue,
  getScopeSectionDefs,
  southMindlyContractInfo,
} from './constants';
import { ContratoData } from './types';

function splitLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
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
  label,
  title,
  children,
  avoidBreak = true,
}: {
  label?: string;
  title: string;
  children: React.ReactNode;
  avoidBreak?: boolean;
}) {
  return (
    <section className={avoidBreak ? 'break-inside-avoid' : ''}>
      <div className="border-b border-[#E5E7EB] pb-2">
        {label ? (
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#6B7280]">
            {label}
          </div>
        ) : null}
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
  const scopeSectionDefs = getScopeSectionDefs(data.templateId);
  const annexIntro = getAnnexIntro(data.templateId);
  const websiteDeliveryDeadlineText =
    data.templateId === 'website' && data.prazoTotal
      ? ` Prazo estimado de entrega: ${data.prazoTotal}.`
      : '';
  const responsabilidadesContratante = splitLines(
    data.responsabilidadesContratante,
  );
  const responsabilidadesContratada = splitLines(
    data.responsabilidadesContratada,
  );
  const signatureLocation = data.cidadeAssinatura.trim() || 'Cidade não informada';
  const todayLabel = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date());
  const contratadaSignatureLabel =
    data.contratadaNome.trim() || southMindlyContractInfo.nome;

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

        <section className="contract-parties-grid mt-8 grid gap-4 print:grid-cols-2 md:grid-cols-2">
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
          Têm entre si, justo e contratado, o presente contrato de prestação de
          serviços, mediante as cláusulas e condições seguintes:
        </div>

        <div className="mt-10 space-y-8">
          <PreviewSection label="Partes" title="Das Partes">
            <p>
              As partes acima identificadas celebram o presente instrumento,
              reconhecendo-se mutuamente aptas para contratar e assumir as
              obrigações ora estabelecidas.
            </p>
          </PreviewSection>

          <PreviewSection label="Cláusula 1" title="Objeto do Contrato">
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
              {websiteDeliveryDeadlineText}
            </p>
          </PreviewSection>

          <PreviewSection label="Cláusula 2" title="Pagamento">
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
            <p>
              <span className="font-semibold text-[#111827]">
                Parágrafo Quarto:
              </span>{' '}
              {data.paymentLateFeeClause}
            </p>
          </PreviewSection>

          <PreviewSection label="Cláusula 3" title="Obrigações da Contratada">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA TERCEIRA:
              </span>{' '}
              A CONTRATADA se obriga a desenvolver o serviço objeto do contrato
              dentro das especificações aprovadas e utilizando os recursos
              previstos no anexo deste instrumento.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {responsabilidadesContratada.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PreviewSection>

          <PreviewSection label="Cláusula 4" title="Obrigações da Contratante">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA QUARTA:
              </span>{' '}
              São obrigações da CONTRATANTE:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {responsabilidadesContratante.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </PreviewSection>

          <PreviewSection label="Cláusula 5" title="Entregas e Revisões">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA QUINTA:
              </span>{' '}
              {data.revisionDeliveryClause}
            </p>
          </PreviewSection>

          <PreviewSection label="Cláusula 6" title="Da Rescisão">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA SEXTA:
              </span>{' '}
              {data.rescisaoText}
            </p>
          </PreviewSection>

          <PreviewSection label="Cláusula 7" title="Disposições Gerais">
            <p>
              <span className="font-semibold text-[#111827]">
                CLÁUSULA SÉTIMA:
              </span>{' '}
              {data.generalRightsClause}
            </p>
            <p>{data.generalDelegationClause}</p>
            <p>
              Fica eleito o foro da comarca de{' '}
              <span className="font-semibold text-[#111827]">
                {signatureLocation}
              </span>{' '}
              para dirimir quaisquer dúvidas oriundas deste contrato.
            </p>
            <p>{data.generalClosingClause}</p>
          </PreviewSection>

          <PreviewSection label="Anexo" title="Anexo" avoidBreak={false}>
            <p>{annexIntro}</p>

            <div className="contract-annex-grid grid items-stretch gap-3 print:grid-cols-2 md:grid-cols-2">
              {scopeSectionDefs.map((section) => {
                const items = splitLines(getScopeFieldValue(data, section.key));

                return (
                  <div
                    key={section.number}
                    className="contract-annex-card break-inside-avoid flex h-full flex-col rounded-[18px] border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3"
                  >
                    <div className="text-[12px] font-mono uppercase tracking-[0.12em] text-[#6B7280]">
                      {section.number}
                    </div>
                    <div className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {section.title}
                    </div>
                    <div className="mt-2 flex-1 text-[13px] leading-6 text-[#374151]">
                      {items.length > 0
                        ? items.join(' • ')
                        : 'Escopo não informado.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </PreviewSection>

          <div className="contract-signatures-section break-inside-avoid rounded-[30px] border border-[#D1D5DB] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-6 py-2 sm:px-8 sm:py-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#6B7280]">
              Assinaturas
            </div>
            <div className="mt-3 text-[14px] text-center text-[#374151]">
              {signatureLocation}, {todayLabel}
            </div>

            <div className="contract-signatures-grid mt-20 grid gap-12 print:grid-cols-2 md:grid-cols-2">
              <div className="contract-signature flex min-w-0 flex-col items-center text-center">
                <div className="contract-signature-line w-full max-w-[320px]" />
                <div className="contract-signature-name mt-4 text-[15px] font-semibold leading-snug text-[#111827] break-words">
                  {data.contratanteNome}
                </div>
                <div className="contract-signature-label mt-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280] break-words">
                  {data.assinaturaContratanteLabel}
                </div>
              </div>

              <div className="contract-signature flex min-w-0 flex-col items-center text-center">
                <div className="contract-signature-line w-full max-w-[320px]" />
                <div className="contract-signature-name mt-4 text-[15px] font-semibold leading-snug text-[#111827] break-words">
                  {contratadaSignatureLabel}
                </div>
                <div className="contract-signature-label mt-1 text-[11px] font-mono uppercase tracking-[0.14em] text-[#6B7280] break-words">
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
