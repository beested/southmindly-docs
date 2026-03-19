'use client';

import { ContratoData } from './types';

export const southMindlyContractInfo = {
  nome: 'SouthMindly',
  cnpj: '[CNPJ da SouthMindly]',
  endereco: '[Endereço ou cidade/UF]',
} as const;

export const contractPrintStyles = `
  @media print {
    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
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
      padding: 10mm 9mm !important;
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

export const scopeSectionDefs = [
  { key: 'scopeHome', number: '2.1', title: 'Página Inicial (Home)' },
  { key: 'scopeSobreNos', number: '2.2', title: 'Página “Sobre Nós”' },
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
] as const satisfies ReadonlyArray<{
  key: keyof ContratoData;
  number: string;
  title: string;
}>;

export const defaultContratoData: ContratoData = {
  clienteId: '',
  contractTitle: 'CONTRATO PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS',
  projectTitle: 'RECONSTRUÇÃO DE WEBSITE',
  proposalReference: 'Março de 2026',
  contratanteNome: southMindlyContractInfo.nome,
  contratanteCnpj: southMindlyContractInfo.cnpj,
  contratanteEndereco: southMindlyContractInfo.endereco,
  contratadaNome: '[Nome da Clínica]',
  contratadaCnpj: '[CNPJ da Clínica]',
  contratadaEndereco: '[Endereço completo]',
  objectText:
    'O presente contrato tem como objeto a prestação de serviços de reconstrução, modernização e otimização do website da CONTRATADA, conforme proposta apresentada em Março de 2026.',
  objectAnnexClause:
    'O projeto contendo os serviços a serem desenvolvidos integra este instrumento como anexo, passando a fazer parte deste contrato para todos os efeitos.',
  objectStartClause:
    'A prestação de serviços inicia com o briefing inicial, alinhamento dos materiais e definição das datas de entrega.',
  dataInicioExecucao: '',
  paymentSummary:
    'O preço ajustado neste contrato será pago conforme a condição comercial definida entre as partes, respeitando os vencimentos acordados no momento da contratação.',
  paymentInstallmentClause:
    'Obriga-se a CONTRATADA a pagar o valor total de R$ 2.200,00 (dois mil e duzentos reais), podendo realizar o pagamento à vista via PIX ou boleto, ou de forma parcelada com entrada de 30% e 3 parcelas mensais.',
  paymentRenewalClause:
    'Por se tratar de um projeto fechado de reconstrução de website, não há renovação automática. Qualquer nova etapa, manutenção ou ampliação será objeto de nova contratação.',
  paymentDefaultClause:
    'Caso a CONTRATADA não cumpra com as obrigações de pagamento, a CONTRATANTE poderá suspender a continuidade do projeto até a regularização dos valores em aberto.',
  rescisaoText:
    'O presente contrato poderá ser considerado rescindido de pleno direito pela parte prejudicada na ocorrência de descumprimento de qualquer de suas cláusulas, sem prejuízo da cobrança dos valores já vencidos e dos serviços efetivamente executados até a data da rescisão.',
  generalRightsClause:
    'Ficam assegurados à CONTRATADA os direitos de uso do projeto após a quitação integral dos valores contratados, sem prejuízo do direito da CONTRATANTE de utilizar o trabalho em portfólio, apresentação comercial e divulgação de seus serviços.',
  generalDelegationClause:
    'A CONTRATANTE não poderá, sem prévia concordância da CONTRATADA, transferir ou delegar integralmente as atribuições e responsabilidades assumidas por força deste contrato.',
  generalClosingClause:
    'E por assim estarem justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.',
  cidadeAssinatura: 'Caxias do Sul',
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
  prazoTotal: 'até 4 (quatro) semanas',
  cronogramaPlanejamento: '1 dia',
  cronogramaDesign: '1 semana',
  cronogramaDesenvolvimento: '1 semana',
  cronogramaTestes: '1 semana',
  prazoCondicoes: [
    'Atraso no envio de conteúdos por parte da CONTRATADA',
    'Demora na aprovação de etapas',
    'Solicitações adicionais fora do escopo',
  ].join('\n'),
  investimentoValor: 'R$ 2.200,00',
  investimentoValorExtenso: 'dois mil e duzentos reais',
  formasPagamento: [
    'À vista via PIX ou boleto',
    'Parcelado: entrada de 30% + 3 parcelas mensais',
  ].join('\n'),
  manutencaoValorHora: 'R$ 100,00 por hora trabalhada',
  responsabilidadesContratante: [
    'Executar o projeto conforme escopo definido',
    'Garantir qualidade técnica e visual',
    'Manter comunicação clara durante o desenvolvimento',
  ].join('\n'),
  responsabilidadesContratada: [
    'Fornecer textos, imagens e informações necessárias',
    'Aprovar etapas dentro dos prazos acordados',
    'Indicar responsável pelo acompanhamento do projeto',
  ].join('\n'),
  alteracoesServicosAdicionais:
    'Qualquer solicitação fora do escopo definido neste contrato será considerada como serviço adicional, podendo gerar custos extras e impacto no prazo.',
  cancelamento: [
    'Não haverá devolução dos valores já pagos',
    'A CONTRATADA terá direito ao material já desenvolvido até o momento',
  ].join('\n'),
  entregaProjeto: ['Publicação do site', 'Validação final da CONTRATADA'].join(
    '\n',
  ),
  direitosUsoPortfolio:
    'A CONTRATANTE poderá utilizar o projeto desenvolvido para fins de portfólio, apresentação comercial e divulgação de seus serviços.',
  disposicoesGerais: [
    'Este contrato não gera vínculo empregatício entre as partes',
    'Ambas as partes concordam com os termos descritos neste documento',
  ].join('\n'),
  foroCidadeUf: 'Caxias do Sul - RS',
  assinaturaContratanteLabel: 'SouthMindly Soluções Digitais LTDA',
  assinaturaContratadaLabel: 'CONTRATADA',
  dataAssinatura: '',
};
