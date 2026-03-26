'use client';

import { ContratoData, ContractTemplateId, ScopeSectionDef } from './types';

export const southMindlyContractInfo = {
  nome: 'SouthMindly',
  cnpj: '19.618.599/0001-50',
  endereco: 'Rua Marcílio Machado da Silveira, 95059-790',
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
  { key: 'scopeFaq', number: '2.5', title: 'Tráfego Pago' },
  { key: 'scopeNovidades', number: '2.6', title: 'Relatórios' },
  { key: 'scopeContato', number: '2.7', title: 'Atendimento e Aprovações' },
  {
    key: 'scopeProvaSocial',
    number: '2.8',
    title: 'Escopo Extra e Demandas Pontuais',
  },
  {
    key: 'scopeMobile',
    number: '2.9',
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
    'Por se tratar de um projeto fechado de reconstrução de website, não há renovação automática. Qualquer nova etapa, manutenção ou ampliação será objeto de nova contratação.',
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
    'Estão incluídas até 2 (duas) rodadas de ajustes por etapa entregue, desde que respeitado o escopo aprovado inicialmente. Solicitações adicionais ou alterações fora do escopo poderão ser tratadas como serviço complementar, com eventual revisão de prazo e valor.',
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
    'Integração com WhatsApp com mensagem personalizada',
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
    'O contrato vigorará pelo período inicial de 6 (seis) meses, com renovação automática por iguais períodos. Em caso de cancelamento imotivado antes do término da vigência inicial, a CONTRATANTE deverá comunicar por escrito com antecedência mínima de 30 (trinta) dias e ficará sujeita ao pagamento de multa compensatória equivalente a 1 (uma) mensalidade vigente.',
  paymentDefaultClause:
    'Caso a CONTRATANTE não cumpra com qualquer das obrigações referentes aos pagamentos, a CONTRATADA poderá suspender total ou parcialmente a execução dos serviços, campanhas, publicações e atendimentos até a regularização integral dos valores em aberto, sem prejuízo da cobrança dos encargos previstos neste contrato.',
  paymentLateFeeClause:
    'O não pagamento por prazo superior a 10 (dez) dias do vencimento poderá acarretar multa moratória de 2% (dois por cento) sobre o valor devido, além de juros de 1% (um por cento) ao mês, calculados pro rata die.',
  rescisaoText:
    'O presente contrato poderá ser considerado rescindido de pleno direito pela parte prejudicada, na ocorrência de descumprimento de qualquer de suas cláusulas, sem prejuízo da cobrança dos valores já vencidos, dos serviços já executados e da multa contratual aplicável. A ausência de resposta, aprovação ou envio de materiais pela CONTRATANTE por período superior a 5 (cinco) dias úteis autoriza a suspensão dos prazos de execução até a regularização da pendência, sem caracterizar inadimplemento da CONTRATADA.',
  generalRightsClause:
    'Ficam assegurados à CONTRATANTE, após a quitação integral dos valores contratados, os direitos de uso dos materiais finais aprovados e entregues no âmbito deste contrato. Arquivos editáveis, estruturas internas de campanhas, templates, documentos estratégicos e demais materiais de trabalho da CONTRATADA não se presumem cedidos ou transferidos, salvo ajuste expresso entre as partes.',
  generalDelegationClause:
    'A CONTRATADA não poderá, em hipótese alguma, transferir ou delegar as atribuições e responsabilidades assumidas por força deste contrato, a não ser com prévia concordância da CONTRATANTE.',
  generalClosingClause:
    'E por assim estarem justos e contratados, assinam o presente instrumento em duas (02) vias de igual teor.',
  revisionDeliveryClause:
    'A CONTRATADA se obriga a desenvolver o serviço objeto do contrato dentro das especificações aprovadas, utilizando os recursos previstos no projeto anexado a este instrumento. Estão incluídas até 2 (duas) rodadas de ajustes por entrega submetida à aprovação da CONTRATANTE, desde que compatíveis com o escopo originalmente contratado. A CONTRATANTE deverá apresentar suas aprovações ou solicitações de ajuste em até 2 (dois) dias úteis após cada envio; ultrapassado esse prazo, os cronogramas poderão ser reprogramados. Alterações adicionais, refações por mudança de direcionamento ou demandas não previstas no escopo poderão ser tratadas como serviço complementar, com revisão de prazo e valor.',
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
  scopeFaq: [
    'Configuração e acompanhamento de campanhas, quando expressamente contratadas',
    'Monitoramento de orçamento, performance e execução técnica',
    'Sinalização de oportunidades de otimização, sem garantia de resultado específico',
  ].join('\n'),
  scopeNovidades: [
    'Envio de relatório mensal com os principais indicadores das ações executadas',
    'Apresentação de resultados, aprendizados e próximos passos',
  ].join('\n'),
  scopeContato: [
    'Canal de comunicação para aprovações e alinhamentos operacionais',
    'Atendimento realizado em dias úteis, de segunda a sexta-feira, em horário comercial',
    'Prazo de retorno conforme rotina operacional definida, salvo demandas urgentes previamente justificadas',
  ].join('\n'),
  scopeProvaSocial: [
    'Demandas não previstas dependerão de validação prévia da CONTRATADA',
    'Serviços extras, acréscimos de volume, novas frentes ou refações substanciais poderão ser orçados separadamente',
  ].join('\n'),
  scopeMobile: [
    'Ajustes de estratégia com base em dados e sazonalidades',
    'Melhorias contínuas nas ações contratadas',
  ].join('\n'),
  responsabilidadesContratante: [
    'Fornecer as características visuais e todo o material complementar, como textos, fotos, vídeos e logomarca, que sejam necessários à elaboração do projeto',
    'Assumir responsabilidade por todo conteúdo divulgado pela CONTRATADA',
    'Aprovar ou solicitar ajustes dos materiais enviados em até 2 (dois) dias úteis, a contar de cada encaminhamento',
    'Providenciar os dados necessários para a execução dos serviços, podendo obtê-los mediante criação de credencial na plataforma correspondente ou por contato com o gerente do banco, quando aplicável',
    'Disponibilizar acessos, informações técnicas e verbas de mídia, quando aplicáveis, dentro dos prazos necessários à operação',
  ].join('\n'),
  responsabilidadesContratada: [
    'Desenvolver o serviço objeto do contrato dentro das especificações previstas no projeto anexado',
    'Entregar o projeto em conformidade com o orçamento apresentado e aprovado pela CONTRATANTE',
    'Executar as rotinas contratadas dentro do horário operacional e dos limites do escopo aprovado',
  ].join('\n'),
};

export const contractTemplates: readonly ContractTemplateDefinition[] = [
  {
    id: 'website',
    label: 'Website',
    description: 'Contrato voltado para reconstrução e desenvolvimento de site.',
    annexIntro: 'Escopo do projeto de reconstrução de website que integra este contrato:',
    scopeSections: websiteScopeSections,
    defaults: websiteDefaults,
  },
  {
    id: 'marketing-digital',
    label: 'Marketing digital',
    description: 'Contrato recorrente para assessoria e operação de marketing digital.',
    annexIntro:
      'Escopo operacional de marketing digital que integra este contrato:',
    scopeSections: marketingDigitalScopeSections,
    defaults: marketingDigitalDefaults,
  },
];

export const defaultContratoData = websiteDefaults;

export function getContractTemplate(templateId: ContractTemplateId) {
  return (
    contractTemplates.find((template) => template.id === templateId) ??
    contractTemplates[0]
  );
}

export function getScopeSectionDefs(templateId: ContractTemplateId) {
  return getContractTemplate(templateId).scopeSections;
}

export function getAnnexIntro(templateId: ContractTemplateId) {
  return getContractTemplate(templateId).annexIntro;
}

export function createContratoData(templateId: ContractTemplateId): ContratoData {
  return { ...getContractTemplate(templateId).defaults };
}
