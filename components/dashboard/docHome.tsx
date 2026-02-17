'use client';

import { DocMenuItem, DocType } from '@/types/docs';

const DOC_CARDS: DocMenuItem[] = [
  {
    id: 'pauta-reuniao',
    label: 'Pauta de Reunião',
    description:
      'Estruture pontos, responsáveis e horários da sua reunião com clareza.',
    icon: '📋',
    available: true,
    color: '#4F7EFF',
  },
  {
    id: 'ata-reuniao',
    label: 'Ata de Reunião',
    description: 'Registre decisões, encaminhamentos e ações pós-reunião.',
    icon: '📝',
    available: false,
    badge: 'Em breve',
    color: '#A78BFA',
  },
  {
    id: 'proposta-comercial',
    label: 'Proposta Comercial',
    description:
      'Crie propostas profissionais personalizadas para cada cliente.',
    icon: '💼',
    available: false,
    badge: 'Em breve',
    color: '#34D399',
  },
  {
    id: 'clausula-contratual',
    label: 'Cláusula Contratual',
    description: 'Gere cláusulas padronizadas e revisadas para seus contratos.',
    icon: '⚖️',
    available: false,
    badge: 'Em breve',
    color: '#F59E0B',
  },
  {
    id: 'contrato',
    label: 'Contrato',
    description:
      'Monte contratos completos com variáveis dinâmicas e templates.',
    icon: '📜',
    available: false,
    badge: 'Em breve',
    color: '#F87171',
  },
];

interface DocHomeProps {
  onSelectDoc: (doc: DocType) => void;
}

export default function DocHome({ onSelectDoc }: DocHomeProps) {
  const stats = [
    { label: 'Documentos gerados', value: '0', icon: '📄' },
    { label: 'Templates ativos', value: '1', icon: '✅' },
    { label: 'Em breve', value: '4', icon: '🚀' },
  ];

  return (
    <div className="p-[40px_48px] max-w-[960px] w-full text-[#E8EAF0] font-sans">
      {/* Hero */}
      <div className="mb-12">
        <div className="text-[11px] text-[#4F7EFF] tracking-[0.2em] uppercase mb-3 font-mono">
          Sistema de Documentos
        </div>

        <h1 className="text-4xl font-normal text-[#E8EAF0] mb-3 leading-tight">
          Bem-vindo ao <br />
          <img
            src="/logo-full.png"
            alt="SouthMindly Docs"
            className="h-[42px] mt-2 block"
          />
        </h1>

        <p className="text-[15px] text-[#6B7280] m-0 max-w-[520px] leading-relaxed">
          Crie, padronize e automatize seus documentos empresariais. Escolha um
          template abaixo para começar.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#13161D] border border-[#1E2130] rounded-xl p-5 flex items-center gap-4 transition-colors duration-200 hover:bg-[#191C25]"
          >
            <div className="text-2xl">{stat.icon}</div>
            <div>
              <div className="text-[26px] font-medium text-[#E8EAF0] leading-none mb-1 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-[#6B7280] font-sans">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="text-[11px] text-[#4B5563] tracking-[0.15em] uppercase mb-5 flex items-center gap-3 font-mono">
        Templates disponíveis
        <div className="flex-1 h-px bg-[#1E2130]" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {DOC_CARDS.map((card) => (
          <div
            key={card.id}
            className={`group ${
              card.available ? 'cursor-pointer' : 'cursor-default opacity-55'
            }`}
            style={
              {
                '--card-color': card.color,
              } as React.CSSProperties
            }
            onClick={() => card.available && onSelectDoc(card.id)}
          >
            <div
              className={`bg-[#13161D] border border-[#1E2130] rounded-[14px] p-6 h-full relative overflow-hidden transition-all duration-[220ms] ease-out 
              ${
                card.available
                  ? 'group-hover:-translate-y-[3px] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] group-hover:border-[var(--card-color)]'
                  : ''
              }`}
            >
              {/* Top accent line */}
              {card.available && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[14px]"
                  style={{
                    background: `linear-gradient(90deg, ${card.color}, ${card.color}00)`,
                  }}
                />
              )}

              <div className="flex justify-between items-start mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px]"
                  style={{
                    background: card.available ? `${card.color}18` : '#1E2130',
                    border: `1px solid ${
                      card.available ? card.color + '33' : '#252A3A'
                    }`,
                  }}
                >
                  {card.icon}
                </div>

                {card.badge && (
                  <span className="text-[10px] bg-[#1E2130] text-[#4B5563] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono">
                    {card.badge}
                  </span>
                )}

                {card.available && (
                  <span
                    className="text-[10px] px-2 py-[3px] rounded-full tracking-[0.05em] font-mono"
                    style={{
                      background: `${card.color}22`,
                      color: card.color,
                    }}
                  >
                    Disponível
                  </span>
                )}
              </div>

              <h3 className="text-[15px] font-semibold text-[#E8EAF0] m-0 mb-2 font-sans">
                {card.label}
              </h3>

              <p className="text-[13px] text-[#6B7280] m-0 mb-5 leading-relaxed">
                {card.description}
              </p>

              {card.available ? (
                <div
                  className="flex items-center gap-1.5 text-xs font-medium font-mono"
                  style={{ color: card.color }}
                >
                  Criar documento →
                </div>
              ) : (
                <div className="text-xs text-[#374151] font-mono">
                  Em desenvolvimento
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
