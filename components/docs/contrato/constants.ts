'use client';

import { ContractTemplateId, ContratoData, ScopeSectionDef } from './types';

export const southMindlyContractInfo = {
  nome: 'SouthMindly',
  cnpj: '19.618.599/0001-50',
  endereco:
    'Rua Marcílio Machado da Silveira, 334 - Serrano, Caxias do Sul/RS - CEP 95059-790',
} as const;

export const contractPrintStyles = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 5mm 4mm;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      overflow: visible !important;
    }

    body > *:not(#contract-print-root) {
      display: none !important;
    }

    #contract-print-root {
      display: block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
    }

    #contract-print-root .contract-paper {
      box-sizing: border-box !important;
      display: block !important;
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 4mm 3mm !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      background: #ffffff !important;
      box-decoration-break: clone;
      -webkit-box-decoration-break: clone;
      break-inside: auto;
      page-break-inside: auto;
    }

    #contract-print-root .break-inside-avoid {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #contract-print-root .contract-no-print-shadow {
      box-shadow: none !important;
      border-color: #D1D5DB !important;
    }

    #contract-print-root .contract-parties-grid,
    #contract-print-root .contract-annex-grid,
    #contract-print-root .contract-signatures-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    #contract-print-root .contract-parties-grid {
      column-gap: 5mm !important;
      row-gap: 4mm !important;
    }

    #contract-print-root .contract-annex-grid {
      column-gap: 4mm !important;
      row-gap: 3mm !important;
    }

    #contract-print-root .contract-signatures-grid {
      column-gap: 9mm !important;
      row-gap: 6mm !important;
    }

    #contract-print-root .contract-signature {
      min-width: 0 !important;
    }

    #contract-print-root .contract-signature-line {
      width: 100% !important;
      border-top: 1.2pt solid #111827 !important;
      height: 0 !important;
    }

    #contract-print-root .contract-signature-name,
    #contract-print-root .contract-signature-label {
      overflow-wrap: anywhere;
      word-break: break-word;
    }
  }
`;

const websiteScopeSections = [
  { key: 'scopeHome', number: '2.1', title: 'Página Inicial (Home)' },
  { key: 'scopeSobreNos', number: '2.2', title: 'Página "Sobre Nós"' },
  { key: 'scopeCorpoClinico', number: '2.3', title: 'Corpo Clínico' },
  { key: 'scopeExames', number: '2.4', title: 'Página de Exames' },
  { key: 'scopeFaq', number: '2.5', title: 'FAQ (Perguntas Frequentes)' },
  { key: 'scopeNovidades', number: '2.6', title: 'Seção de Novidades' },
  { key: 'scopeContato', number: '2.7', title: 'Página de Contato' },
  {
    key: 'scopeProvaSocial',
    number: '2.8',
    title: 'Prova Social e Credibilidade',
  },
  { key: 'scopeMobile', number: '2.9', title: 'Otimização Mobile' },
] as const satisfies ReadonlyArray<ScopeSectionDef>;

const marketingDigitalScopeSections = [
  { key: 'scopeHome', number: '2.1', title: 'Estratégia e Planejamento' },
  {
    key: 'scopeSobreNos',
    number: '2.2',
    title: 'Gestão de Redes Sociais',
  },
  { key: 'scopeCorpoClinico', number: '2.3', title: 'Criação de Conteúdo' },
  { key: 'scopeExames', number: '2.4', title: 'Design e Criativos' },
  { key: 'scopeNovidades', number: '2.5', title: 'Relatórios' },
  { key: 'scopeContato', number: '2.6', title: 'Atendimento e Aprovações' },
  {
    key: 'scopeProvaSocial',
    number: '2.7',
    title: 'Escopo Extra e Demandas Pontuais',
  },
  {
    key: 'scopeMobile',
    number: '2.8',
    title: 'Otimizações e Evolução Contínua',
  },
] as const satisfies ReadonlyArray<ScopeSectionDef>;

type ContractTemplateDefinition = {
  id: ContractTemplateId;
  label: string;
  description: string;
  annexIntro: string;
  scopeSections: ReadonlyArray<ScopeSectionDef>;
  defaults: ContratoData;
};

const baseContratoData = {
  clienteId: '',
  contratanteNome: '[Nome do cliente]',
  contratanteCnpj: '[CNPJ do cliente]',
  contratanteEndereco: '[Endereço completo]',
  contratadaNome: southMindlyContractInfo.nome,
  contratadaCnpj: southMindlyContractInfo.cnpj,
  contratadaEndereco: southMindlyContractInfo.endereco,
  dataInicioExecucao: '',
  cidadeAssinatura: 'Caxias do Sul - RS',
  prazoTotal: '',
  cronogramaPlanejamento: '',
  cronogramaDesign: '',
  cronogramaDesenvolvimento: '',
  cronogramaTestes: '',
  prazoCondicoes: '',
  investimentoValor: '',
  investimentoValorExtenso: '',
  formasPagamento: '',
  manutencaoValorHora: '',
  alteracoesServicosAdicionais: '',
  cancelamento: '',
  entregaProjeto: '',
  direitosUsoPortfolio: '',
  disposicoesGerais: '',
  assinaturaContratanteLabel: 'CONTRATANTE',
  assinaturaContratadaLabel: 'CONTRATADA',
  dataAssinatura: '',
} as const;

const websiteDefaults: ContratoData = {
  ...baseContratoData,
  templateId: 'website',
  contractTitle: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS',
  projectTitle: 'RECONSTRUÇÃO DE WEBSITE',
  proposalReference: 'Março de 2026',
  objectText:
    'O presente contrato tem como objeto a prestação de serviços de reconstrução, modernização e otimização do website da CONTRATANTE, conforme proposta apresentada em Março de 2026.',
  objectAnnexClause:
    'O projeto contendo os serviços a serem desenvolvidos integra este instrumento como anexo, passando a fazer parte deste contrato para todos os efeitos.',
  objectStartClause:
    'A prestação de serviços inicia com o briefing inicial, alinhamento dos materiais e definição das datas de entrega.',
  paymentSummary:
    'O preço ajustado neste contrato será pago conforme a condição comercial definida entre as partes, respeitando os vencimentos acordados no momento da contratação.',
  paymentInstallmentClause:
    'Obriga-se a CONTRATANTE a pagar o valor total de R$ 2.200,00 (dois mil e duzentos reais), podendo realizar o pagamento à vista via PIX ou boleto, ou de forma parcelada com entrada de 30% e 3 parcelas mensais.',
  paymentRenewalClause:
    'Por se tratar de um projeto fechado de reconstrução de website, não há renovação automática. Qualquer nova etapa, manutenção técnica pós-entrega ou ampliação será objeto de manutenção avulsa, ao valor de R$ 100,00 (cem reais) por hora técnica. Os custos de terceiros necessários à operação ou continuidade do website, incluindo hospedagem, domínio, e serviços equivalentes, não estão incluídos neste contrato e serão de responsabilidade exclusiva da CONTRATANTE.',
  paymentDefaultClause:
    'Caso a CONTRATANTE não cumpra com as obrigações de pagamento, a CONTRATADA poderá suspender a continuidade do projeto até a regularização dos valores em aberto.',
  paymentLateFeeClause:
    'O não pagamento por prazo superior a 10 (dez) dias do vencimento poderá acarretar multa moratória de 2% (dois por cento) sobre o valor devido, além de juros de 1% (um por cento) ao mês, calculados pro rata die.',
  rescisaoText:
    'O presente contrato poderá ser considerado rescindido de pleno direito pela parte prejudicada na ocorrência de descumprimento de qualquer de suas cláusulas, sem prejuízo da cobrança dos valores já vencidos e dos serviços efetivamente executados até a data da rescisão.',
  generalRightsClause:
    'Ficam assegurados à CONTRATANTE os direitos de uso do projeto após a quitação integral dos valores contratados, sem prejuízo do direito da CONTRATADA de utilizar o trabalho em portfólio, apresentação comercial e divulgação de seus serviços.',
  generalDelegationClause:
    'A CONTRATANTE não poderá, sem prévia concordância da CONTRATADA, transferir ou delegar integralmente as atribuições e responsabilidades assumidas por força deste contrato.',
  generalClosingClause:
    'E por assim estarem justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.',
  revisionDeliveryClause:
    'Estão incluídas até 2 (duas) rodadas de ajustes por etapa entregue, desde que respeitado o escopo aprovado inicialmente. Após o go-live, a CONTRATADA prestará suporte técnico limitado, pelo prazo de 30 (trinta) dias corridos, exclusivamente para correção de bugs ou falhas de desenvolvimento relacionadas ao escopo entregue. Solicitações adicionais, alterações fora do escopo ou manutenções evolutivas poderão ser tratadas como serviço complementar, com eventual revisão de prazo e valor.',
  scopeHome: [
    'Reestruturação com foco institucional',
    'Destaque para diferenciais da clínica',
    'Inclusão de indicadores institucionais',
    'Carrossel de convênios',
    'Destaque para certificações',
  ].join('\n'),
  scopeSobreNos: [
    'Reorganização institucional',
    'Linha do tempo da clínica',
    'Apresentação da história e evolução',
  ].join('\n'),
  scopeCorpoClinico: [
    'Layout moderno',
    'Apresentação individual dos médicos',
    'Organização por especialidades',
  ].join('\n'),
  scopeExames: [
    'Descrição',
    'Objetivo',
    'Preparo',
    'Tempo de duração',
    'Orientações',
    'Disponibilidade de resultados',
  ].join('\n'),
  scopeFaq: 'Criação de seção com dúvidas comuns dos pacientes',
  scopeNovidades: [
    'Reformulação visual',
    'Exibição em carrossel',
    'Atualização das imagens',
  ].join('\n'),
  scopeContato: [
    'Ajuste de comunicação',
    'Link para WhatsApp com mensagem personalizada pré-preenchida',
  ].join('\n'),
  scopeProvaSocial: [
    'Inserção de depoimentos',
    'Destaque de certificações',
    'Indicadores institucionais',
  ].join('\n'),
  scopeMobile: [
    'Adaptação completa para dispositivos móveis',
    'Ajustes de navegação e responsividade',
  ].join('\n'),
  responsabilidadesContratante: [
    'Fornecer textos, imagens e informações necessárias',
    'Aprovar etapas dentro dos prazos acordados',
    'Indicar responsável pelo acompanhamento do projeto',
    'Arcar com os custos e renovações de domínio, hospedagem, licenças e serviços necessários ao website',
  ].join('\n'),
  responsabilidadesContratada: [
    'Executar o projeto conforme escopo definido',
    'Garantir qualidade técnica e visual',
    'Manter comunicação clara durante o desenvolvimento',
  ].join('\n'),
};

const marketingDigitalDefaults: ContratoData = {
  ...baseContratoData,
  templateId: 'marketing-digital',
  contractTitle: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE MARKETING DIGITAL',
  projectTitle: 'ASSESSORIA DE MARKETING DIGITAL',
  proposalReference: 'Março de 2026',
  objectText:
    'O presente contrato tem como objeto a prestação de serviço em formato de consultoria e monitoramento de marketing, com referências institucionais da CONTRATANTE.',
  objectAnnexClause:
    'O projeto contendo os serviços a serem desenvolvidos, com a descrição dos entregáveis, limites operacionais e rotinas aplicáveis, está anexado a este instrumento, sendo parte integrante deste contrato para todos os efeitos.',
  objectStartClause:
    'A prestação de serviços inicia com o briefing inicial, liberação dos acessos necessários e definição das datas de entrega, ficando sua execução condicionada ao envio, pela CONTRATANTE, das informações e aprovações indispensáveis ao andamento das atividades.',
  dataInicioExecucao: '01/03/2026',
  paymentSummary:
    'O preço ajustado neste contrato será pago mensalmente, com vencimento no dia 15 de cada mês, sendo o primeiro vencimento em 15/03/2026.',
  paymentInstallmentClause:
    'Obriga-se a CONTRATANTE a pagar mensalmente o valor de R$ 500,00 (quinhentos reais), iniciando em 01/03/2026, pelo período de 6 (seis) meses, referente ao serviço contratado.',
  paymentRenewalClause:
    'O contrato vigorará pelo período mínimo inicial de 6 (seis) meses, com renovação automática por iguais períodos, salvo manifestação escrita em sentido contrário com antecedência mínima de 30 (trinta) dias. Os valores contratados poderão ser reajustados anualmente com base na variação acumulada do IPCA, ou por outro índice que venha a ser acordado entre as partes. Em caso de rescisão imotivada antes do término da vigência inicial, a CONTRATANTE ficará sujeita ao pagamento de multa compensatória equivalente a 50% (cinquenta por cento) do valor restante do contrato até o encerramento do prazo mínimo.',
  paymentDefaultClause:
    'Caso a CONTRATANTE não cumpra com qualquer das obrigações referentes aos pagamentos, a CONTRATADA poderá suspender total ou parcialmente a execução dos serviços, campanhas, publicações e atendimentos até a regularização integral dos valores em aberto, sem prejuízo da cobrança dos encargos previstos neste contrato.',
  paymentLateFeeClause:
    'O não pagamento por prazo superior a 10 (dez) dias do vencimento poderá acarretar multa moratória de 2% (dois por cento) sobre o valor devido, além de juros de 1% (um por cento) ao mês, calculados pro rata die.',
  rescisaoText:
    'O presente contrato poderá ser considerado rescindido de pleno direito pela parte prejudicada, na ocorrência de descumprimento de qualquer de suas cláusulas, sem prejuízo da cobrança dos valores já vencidos, dos serviços já executados e da multa contratual aplicável. A ausência de resposta, aprovação ou envio de materiais pela CONTRATANTE por período superior a 5 (cinco) dias úteis autoriza a suspensão dos prazos de execução até a regularização da pendência, sem caracterizar inadimplemento da CONTRATADA.',
  generalRightsClause:
    'Ficam assegurados à CONTRATANTE, após a quitação integral dos valores contratados, os direitos de uso dos materiais finais aprovados e entregues no âmbito deste contrato. Arquivos editáveis, estruturas internas de campanhas, templates, documentos estratégicos e demais materiais de trabalho da CONTRATADA não se presumem cedidos ou transferidos, salvo ajuste expresso entre as partes. A CONTRATADA poderá utilizar os materiais produzidos para portfólio, apresentação comercial e divulgação de seus serviços, salvo manifestação contrária da CONTRATANTE por escrito.',
  generalDelegationClause:
    'A CONTRATADA não poderá transferir integralmente as obrigações assumidas por força deste contrato sem anuência prévia da CONTRATANTE. A CONTRATADA não garante resultados específicos, tais como vendas, leads, alcance, crescimento de audiência ou faturamento, por dependerem de fatores externos alheios à sua atuação exclusiva.',
  generalClosingClause:
    'E por assim estarem justos e contratados, assinam o presente instrumento em duas (02) vias de igual teor.',
  revisionDeliveryClause:
    'A CONTRATADA executará os serviços dentro das especificações aprovadas e dos limites operacionais previstos no projeto anexado a este instrumento.  A CONTRATANTE deverá apresentar suas aprovações ou solicitações de ajuste em até 2 (dois) dias úteis após cada envio; ultrapassado esse prazo, os cronogramas poderão ser reprogramados. Não estão incluídos neste contrato, salvo ajuste expresso e contratação específica, serviços de tráfego pago, impulsionamentos, produção audiovisual, deslocamentos presenciais, contratação de fornecedores terceiros e demais demandas não previstas no escopo. Alterações adicionais, refações por mudança de direcionamento ou demandas extras poderão ser tratadas como serviço complementar, com revisão de prazo e valor.',
  scopeHome: [
    'Diagnóstico inicial da presença digital',
    'Definição de objetivos e metas de comunicação',
    'Planejamento editorial e calendário mensal',
    'Definição das frentes de atuação contempladas no período contratado',
  ].join('\n'),
  scopeSobreNos: [
    'Gestão dos perfis e canais expressamente contemplados na contratação',
    'Publicação de conteúdos conforme cronograma previamente aprovado',
    'Monitoramento básico de interações e sinalização de demandas relevantes',
  ].join('\n'),
  scopeCorpoClinico: [
    'Criação de legendas, copys e roteiros curtos conforme necessidade da operação',
    'Sugestão de pautas, campanhas e linhas editoriais',
    'Apoio na organização das informações da marca e dos materiais enviados',
  ].join('\n'),
  scopeExames: [
    'Desenvolvimento de artes estáticas e peças digitais',
    'Ajustes visuais conforme identidade da marca',
    'Entrega de materiais aprovados para publicação',
    'Produção limitada aos formatos e volumes compatíveis com o plano contratado',
  ].join('\n'),
  scopeFaq: '',
  scopeNovidades: [
    'Envio de relatório trimestral com os principais indicadores das ações executadas',
    'Apresentação de resultados, aprendizados e próximos passos',
  ].join('\n'),
  scopeContato: [
    'Canal de comunicação para aprovações e alinhamentos operacionais',
    'Atendimento realizado em dias úteis, de segunda a sexta-feira, em horário comercial',
    'Prazo de resposta de até 24 (vinte e quatro) horas úteis, salvo demandas urgentes previamente justificadas e alinhadas entre as partes',
  ].join('\n'),
  scopeProvaSocial: [
    'Demandas não previstas dependerão de validação prévia da CONTRATADA',
    'Não estão incluídos, salvo contratação específica, serviços de tráfego pago, impulsionamentos, produção audiovisual, deslocamentos, contratação de influenciadores, fornecedores terceiros e outras demandas extras',
  ].join('\n'),
  scopeMobile: [
    'Ajustes de estratégia com base em dados e sazonalidades',
    'Melhorias contínuas nas ações contratadas',
  ].join('\n'),
  responsabilidadesContratante: [
    'Fornecer as características visuais e todo o material complementar, como textos, fotos, vídeos e logomarca, que sejam necessários à elaboração do projeto',
    'Assumir responsabilidade por todo conteúdo divulgado pela CONTRATADA',
    'Aprovar ou solicitar ajustes dos materiais enviados em até 2 (dois) dias úteis, a contar de cada encaminhamento',
    'Disponibilizar acessos, informações técnicas e verbas de mídia, quando aplicáveis, dentro dos prazos necessários à operação',
  ].join('\n'),
  responsabilidadesContratada: [
    'Executar as rotinas contratadas conforme o escopo, cronograma e materiais aprovados',
    'Zelar pela qualidade técnica e estratégica das entregas compatíveis com o plano contratado',
    'Realizar o atendimento em dias úteis, em horário comercial, com prazo de resposta de até 24 (vinte e quatro) horas úteis',
  ].join('\n'),
};

export const contractTemplates: readonly ContractTemplateDefinition[] = [
  {
    id: 'website',
    label: 'Website',
    description:
      'Contrato voltado para reconstrução e desenvolvimento de site.',
    annexIntro:
      'Escopo do projeto de reconstrução de website que integra este contrato:',
    scopeSections: websiteScopeSections,
    defaults: websiteDefaults,
  },
  {
    id: 'marketing-digital',
    label: 'Marketing digital',
    description:
      'Contrato recorrente para assessoria e operação de marketing digital.',
    annexIntro:
      'Escopo operacional de marketing digital que integra este contrato:',
    scopeSections: marketingDigitalScopeSections,
    defaults: marketingDigitalDefaults,
  },
];

export const defaultContratoData = websiteDefaults;

function mergeTextLines(...values: string[]) {
  const uniqueLines = new Set<string>();

  for (const value of values) {
    for (const line of value.split('\n')) {
      const normalized = line.trim();
      if (normalized) {
        uniqueLines.add(normalized);
      }
    }
  }

  return Array.from(uniqueLines).join('\n');
}

function normalizeWebsiteScopeValue(
  key: ScopeSectionDef['key'],
  value: string,
) {
  if (key !== 'scopeContato') {
    return value;
  }

  return value.replace(
    'Integração com WhatsApp com mensagem personalizada',
    'Link para WhatsApp com mensagem personalizada pré-preenchida',
  );
}

export function getContractTemplate(templateId: ContractTemplateId) {
  return (
    contractTemplates.find((template) => template.id === templateId) ??
    contractTemplates[0]
  );
}

export function getScopeFieldValue(
  data: ContratoData,
  key: ScopeSectionDef['key'],
) {
  if (data.templateId === 'website' && key === 'scopeSobreNos') {
    return mergeTextLines(data.scopeSobreNos, data.scopeCorpoClinico);
  }

  const value = data[key] as string;

  return data.templateId === 'website'
    ? normalizeWebsiteScopeValue(key, value)
    : value;
}

export function sanitizeContratoData(data: ContratoData): ContratoData {
  const nextData =
    data.templateId === 'website'
      ? {
          ...data,
          scopeSobreNos: getScopeFieldValue(data, 'scopeSobreNos'),
          scopeContato: getScopeFieldValue(data, 'scopeContato'),
          scopeCorpoClinico: '',
        }
      : data;

  return nextData.templateId === 'marketing-digital'
    ? { ...nextData, scopeFaq: '' }
    : nextData;
}

export function getScopeSectionDefs(templateId: ContractTemplateId) {
  const scopeSections = getContractTemplate(templateId).scopeSections;

  if (templateId !== 'website') {
    return scopeSections;
  }

  return scopeSections
    .filter((section) => section.key !== 'scopeCorpoClinico')
    .map((section) => {
      if (section.key === 'scopeSobreNos') {
        return {
          ...section,
          title: 'Página "Sobre Nós" e Corpo Clínico',
        };
      }

      if (section.key === 'scopeNovidades') {
        return {
          ...section,
          title: 'Seção de Notícias',
          number: '2.5',
        };
      }

      if (section.key === 'scopeExames') {
        return { ...section, number: '2.3' };
      }

      if (section.key === 'scopeFaq') {
        return { ...section, number: '2.4' };
      }

      if (section.key === 'scopeContato') {
        return { ...section, number: '2.6' };
      }

      if (section.key === 'scopeProvaSocial') {
        return { ...section, number: '2.7' };
      }

      if (section.key === 'scopeMobile') {
        return { ...section, number: '2.8' };
      }

      return section;
    });
}

export function getAnnexIntro(templateId: ContractTemplateId) {
  return getContractTemplate(templateId).annexIntro;
}

export function createContratoData(
  templateId: ContractTemplateId,
): ContratoData {
  return { ...getContractTemplate(templateId).defaults };
}
