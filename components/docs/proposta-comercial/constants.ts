'use client';

import { defaultPropostaComercialData } from '@/lib/schemas/proposta-comercial';
import { PropostaComercialData } from '@/types/docs';

import { SelectOption } from './types';

export const defaultData = {
  ...defaultPropostaComercialData,
  revisao: defaultPropostaComercialData.revisao || '0',
};

export const statusOptions: SelectOption<PropostaComercialData['status']>[] = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'enviada', label: 'Enviada' },
  { value: 'em_negociacao', label: 'Em negociação' },
  { value: 'aceita', label: 'Aceita' },
  { value: 'recusada', label: 'Recusada' },
  { value: 'cancelada', label: 'Cancelada' },
];

export const propostaBackgroundSrc = '/proposta-background.svg';
export const southMindlyLogoSrc = '/logo-full.png';
export const presentationParagraphs = [
  'A SouthMindly tem consolidado seu posicionamento no mercado como uma empresa especializada em Marketing Digital, Criação de Sites e Desenvolvimento de Marcas, oferecendo soluções estratégicas, criativas e orientadas a resultados, sempre com foco nas necessidades e expectativas de seus clientes.',
  'Nossa atuação é pautada pela seriedade, comprometimento e trabalho colaborativo, garantindo alto nível de qualidade em cada entrega. O elevado grau de satisfação dos nossos clientes reflete, sobretudo, a nossa capacidade de construir marcas fortes, desenvolver experiências digitais eficientes e alcançar os objetivos estratégicos propostos, tornando a SouthMindly um parceiro confiável para o crescimento e fortalecimento de negócios.',
  'Prezados,',
  'É uma grata satisfação poder participar de seu planejamento para este projeto e com isso poder apoiá-los nesta iniciativa tão importante atualmente.',
  'Pensando nisso e com o objetivo de manter-nos sempre organizados internamente para atender as demandas e expectativas de nossos clientes, emitimos esta proposta contemplando a nossa metodologia de atuação para atendimento ao escopo do projeto.',
  'Desta forma, ao enviar-lhes nossa Proposta de Prestação de Serviços, esperamos caracterizar o trabalho ofertado e os demais termos para o bom andamento de nossa parceria. Por gentileza, analisem a proposta e se surgir alguma dúvida não hesitem em nos contatar.',
];

export const objectiveMainParagraph =
  'Esta proposta tem como objetivo apresentar o planejamento orçamentário para a atuação da SouthMindly na assessoria de marketing digital, com foco estratégico em posicionamento de marca, crescimento sustentável e geração de resultados.';

export const objectiveComplementaryItems = [
  'Atuar com objetividade, estratégia e criatividade para entregar soluções de alto valor, alinhadas aos princípios de comunicação da SouthMindly.',
  'Ampliar a visibilidade da marca e potencializar os resultados comerciais e o relacionamento com clientes.',
  'Posicionar a TOIGO no mercado de forma assertiva, como uma empresa ética, inovadora, comprometida com a qualidade e com a excelência das entregas.',
  'Atrair novos clientes nas regiões de atuação, fortalecendo a presença digital.',
  'Fidelizar e reter os clientes atuais, transformando-os em promotores da marca.',
  'Consolidar uma imagem positiva e consistente junto a parceiros, stakeholders e à sociedade.',
];

export const objectiveClosingParagraph =
  'Acreditamos que marketing digital vai muito além de publicações em redes sociais: envolve estratégia, propósito, análise e a capacidade de transmitir valores, identidade e emoção ao público-alvo, gerando conexão real e resultados mensuráveis.';

export const methodologyIntroParagraph =
  'Atuamos de forma próxima aos nossos clientes, buscando compreender a essência do negócio para desenvolver estratégias de marketing alinhadas às suas necessidades e expectativas. Com base nisso, apresentamos a seguir as opções consideradas pertinentes nesta proposta.';

export const methodologyScopeDefinitions = [
  {
    id: 'gestao-digital',
    aliases: [
      'gestao digital',
      'instagram',
      'facebook',
      'linkedin',
      'redes sociais',
    ],
    title:
      'Escopo 01 - Gestão Digital: Postagens em redes sociais Instagram (replicação do conteúdo para o Facebook) e LinkedIn',
    items: [
      'Criação gráfica das postagens e campanhas.',
      'Elaboração de texto para as postagens.',
      'Posts periódicos conforme contratação.',
      'Relatório Mensal de interações no perfil.',
      'Gerenciamento de demandas a partir das publicações (direcionamento de respostas).',
    ],
  },
  {
    id: 'gravacao-videos',
    aliases: ['gravacao de videos', 'gravação de vídeos', 'videos', 'vídeos'],
    title:
      'Escopo 02 - Gravação de Vídeos: Paralelamente as postagens, podem ser realizadas gravações de vídeos mensais ou bimensais (em horários a combinar) para fortalecerem aspectos tais como:',
    items: [
      'Depoimentos dos diretores e funcionários.',
      'Apresentação de equipamentos.',
      'Esclarecimentos sobre os exames realizados.',
      'Diferenciais da instituição.',
    ],
  },
  {
    id: 'criacao-site',
    aliases: [
      'criacao de site',
      'criação de site',
      'reconstrucao de site',
      'reconstrução de site',
      'site institucional',
    ],
    title:
      'Escopo 03 – Criação / Reconstrução de Site: Desenvolvimento ou reformulação de site institucional com foco em posicionamento digital, usabilidade e conversão:',
    items: [
      'Levantamento de necessidades e definição do escopo junto ao cliente.',
      'Criação ou reformulação do layout, alinhado à identidade visual da marca.',
      'Desenvolvimento de site responsivo (desktop e mobile).',
      'Estruturação de páginas e organização da arquitetura da informação.',
      'Integração com canais de contato (WhatsApp, formulários, redes sociais).',
      'Adequações técnicas para performance, segurança e navegação intuitiva.',
    ],
  },
  {
    id: 'manutencao-site',
    aliases: ['manutencao do site', 'manutenção do site', 'site'],
    title: 'Escopo 04 - Manutenção do site:',
    items: [
      'Atualização de conteúdos institucionais, textos, imagens e informações gerais.',
      'Inclusão, alteração ou remoção de páginas conforme demandas do cliente.',
      'Correções pontuais de layout, links, formulários e elementos visuais.',
      'Atualizações técnicas básicas (plugins, temas e recursos do site, quando aplicável).',
      'Monitoramento de funcionamento e suporte para eventuais ajustes.',
      'Adequações conforme novas necessidades estratégicas ou institucionais.',
      'Execução das demandas mediante solicitação do cliente e liberação prévia de acesso.',
    ],
  },
] as const;

export const budgetIntroParagraph =
  'Seguem abaixo os valores para cada opção apresentada:';

export const budgetClosingParagraphs = [
  'A instituição pode escolher o escopo que melhor lhe convier dentro do seu planejamento.',
  'Caso a instituição tenha uma necessidade diferente da apresentada nesta proposta, estamos totalmente abertos para negociação e ajustes necessários visando o fechamento desta parceria.',
];

export const paymentConditionsParagraph =
  'Pagamento por meio de boleto bancário, com vencimento no dia 15 (quinze) do mês subsequente a realização das atividades, mediante emissão e envio da nota fiscal de prestação de serviços.';

export const contractParagraphs = [
  'A SouthMindly, a fim de estabelecer as condições de aplicação desta proposta, definir responsabilidades, direitos e deveres e caracterizar o aceite das condições apresentadas, estabelecerá após o aceite desta proposta um Contrato de Prestação de Serviços, comprometendo-se com a execução do projeto apresentado.',
  'Os contratos podem ser firmados com prazos entre 06 (seis) e 12 (doze) meses a critério do contratante.',
  'OBS. As notas fiscais referentes aos serviços prestados pela SouthMindly serão emitidas por meio do remetente da empresa QualiSul, uma vez que a SouthMindly integra o Grupo QualiSul.',
];

export const generalConditionsItems = [
  'Os serviços serão executados conforme os escopos descritos nesta proposta.',
  'Alterações ou demandas fora do escopo poderão ser orçadas à parte.',
  'Os prazos de entrega estarão condicionados ao envio de informações e aprovações por parte do contratante.',
  'A comunicação entre as partes será realizada por canais previamente definidos.',
];

export const criticalAnalysisParagraphs = [
  'O aceite desta proposta pode ser enviado das seguintes formas:',
  'Mediante assinatura no campo específico da tabela abaixo (Tabela de Aceite da Proposta) e posterior envio desta página via e-mail para felipepereira.susin1@gmail.com aos cuidados de Felipe Susin.',
  'Pelo e-mail felipepereira.susin1@gmail.com da seguinte forma: "Informamos que aceitamos integralmente a proposta (citar o número da proposta que consta o campo superior esquerdo da capa deste documento), apresentada pela QualiSul. Eu, (nome da pessoa) responsabilizo-me pelo compromisso firmado através desta proposta.',
];

export const budgetScopeDefinitions = [
  {
    id: 'gestao-digital',
    label: 'Escopo 01 - Gestão Digital: Postagens em redes sociais',
    rows: [
      {
        periodicidade:
          '04 (quatro) postagens por mês (uma por semana)',
        investimento: 'R$ 600,00 por mês',
      },
      {
        periodicidade:
          '02 (duas) postagens por mês (uma por quinzena)',
        investimento: 'R$ 300,00 por mês',
      },
    ],
  },
  {
    id: 'gravacao-videos',
    label: 'Escopo 02 - Gravação de Vídeos',
    rows: [
      {
        periodicidade: 'Conforme demanda',
        investimento: 'R$ 500,00 por vídeo',
      },
    ],
  },
  {
    id: 'criacao-site',
    label: 'Escopo 03 - Criação/Reconstrução de site',
    rows: [
      {
        periodicidade: 'Conforme demanda',
        investimento: 'A combinar com o contratante.',
      },
    ],
  },
  {
    id: 'manutencao-site',
    label: 'Escopo 04 - Manutenção do site',
    rows: [
      {
        periodicidade: 'Conforme demanda do cliente',
        investimento: 'R$ 100,00 a hora técnica',
      },
    ],
  },
] as const;

export const printStyles = `
  @media print {
    @page { margin: 0; size: A4 portrait; }
    html, body {
      width: 210mm;
      margin: 0;
      padding: 0;
      overflow: visible;
    }
    body { background: #05070B; }
    body * { visibility: hidden; }
    #preview-doc, #preview-doc * { visibility: visible; }
    #preview-doc {
      position: absolute;
      top: 0;
      left: 0;
      width: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
      max-width: none !important;
      background: transparent !important;
    }
    #preview-doc .proposal-page {
      box-sizing: border-box !important;
      width: 210mm !important;
      height: 297mm !important;
      min-height: 297mm !important;
      margin: 0 !important;
      padding: 40px !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      max-width: none !important;
      overflow: hidden !important;
      page-break-after: always;
      break-after: page;
      background-color: #05070B !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    #preview-doc .proposal-page:last-child {
      page-break-after: auto;
      break-after: auto;
    }
  }
`;
