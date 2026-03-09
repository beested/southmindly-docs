'use client';

import { DOC_DEFINITIONS } from '@/lib/docs/registry';
import { DocType } from '@/types/docs';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeDoc: DocType | null;
  onSelectDoc: (doc: DocType) => void;
  onHome: () => void;
  userEmail?: string | null;
  onSignOut?: () => void;
  onConsultSavedPautas?: () => void;
}

export default function Sidebar({
  open,
  onToggle,
  activeDoc,
  onSelectDoc,
  onHome,
  userEmail,
  onSignOut,
  onConsultSavedPautas,
}: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#13161D] border-r border-[#1E2130] z-[200] flex flex-col overflow-hidden transition-[width] duration-300 ease-out ${
        open ? 'w-[260px]' : 'w-[64px]'
      }`}
    >
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center justify-between border-b border-[#1E2130] shrink-0">
        {open && (
          <button
            onClick={onHome}
            className="bg-transparent border-none cursor-pointer p-0"
          >
            <img src="/logo-full.png" alt="SouthMindly" className="h-8" />
          </button>
        )}

        {!open && (
          <div
            className="flex items-center justify-center cursor-pointer mx-auto"
            onClick={onHome}
          >
            <img src="/logo-icon.png" alt="SouthMindly" className="w-8 h-8" />
          </div>
        )}

        {open && (
          <button
            onClick={onToggle}
            className="bg-transparent border-none text-[#6B7280] cursor-pointer p-1.5 rounded-md text-base flex items-center justify-center hover:bg-[#1E2130]"
          >
            ‹
          </button>
        )}
      </div>

      {!open && (
        <button
          onClick={onToggle}
          className="bg-transparent border-none text-[#6B7280] cursor-pointer p-2.5 text-base flex items-center justify-center mt-1 hover:bg-[#1E2130]"
        >
          ›
        </button>
      )}

      {/* Section label */}
      {open && (
        <div className="px-5 pt-5 pb-2 text-[10px] text-[#4B5563] tracking-[0.15em] uppercase shrink-0 font-mono">
          Documentos
        </div>
      )}

      {/* Menu items */}
      <nav
        className={`flex-1 overflow-y-auto ${
          open ? 'p-[4px_12px]' : 'p-[4px_8px]'
        }`}
      >
        {onConsultSavedPautas && (
          <button
            onClick={onConsultSavedPautas}
            title={!open ? 'Pautas salvas' : undefined}
            className={`w-full flex ${
              open ? 'items-start' : 'items-center'
            } gap-2.5 ${
              open ? 'p-3' : 'p-3'
            } rounded-[10px] border mb-1 text-left flex-col transition-all duration-[180ms] ease-out hover:bg-[#1E2130] bg-transparent border-transparent cursor-pointer opacity-100`}
          >
            <div className="flex items-center gap-2.5 w-full">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 transition-all duration-200 bg-[#1E2130] border border-[#252A3A]">
                📂
              </div>
              {open && (
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5 font-sans">
                    <span className="text-[#9CA3AF]">Pautas salvas</span>
                  </div>
                </div>
              )}
            </div>

            {open && (
              <div className="text-[11px] text-[#4B5563] pl-[42px] leading-[1.4] mt-0.5 whitespace-normal font-sans">
                Consultar e abrir pautas cadastradas
              </div>
            )}
          </button>
        )}

        {DOC_DEFINITIONS.map((item) => {
          const isActive = activeDoc === item.id;
          return (
            <button
              key={item.id}
              onClick={() => item.available && onSelectDoc(item.id)}
              title={!open ? item.label : undefined}
              className={`w-full flex ${
                open ? 'items-start' : 'items-center'
              } gap-2.5 ${
                open ? 'p-3' : 'p-3'
              } rounded-[10px] border mb-0.5 text-left flex-col transition-all duration-[180ms] ease-out hover:bg-[#1E2130] ${
                isActive
                  ? 'bg-[#1a2340] border-[#4F7EFF44]'
                  : 'bg-transparent border-transparent'
              } ${item.available ? 'cursor-pointer opacity-100' : 'cursor-default opacity-50'}`}
            >
              <div className="flex items-center gap-2.5 w-full">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 transition-all duration-200 ${
                    isActive ? '' : 'bg-[#1E2130] border border-[#252A3A]'
                  }`}
                  style={
                    isActive
                      ? {
                          background: `${item.color}22`,
                          borderColor: `${item.color}44`,
                        }
                      : {}
                  }
                >
                  {item.icon}
                </div>

                {open && (
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-1.5 font-sans">
                      <span
                        className={
                          isActive ? 'text-[#E8EAF0]' : 'text-[#9CA3AF]'
                        }
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="text-[9px] bg-[#252A3A] text-[#6B7280] px-1.5 py-px rounded-full tracking-[0.05em] font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {open && (
                <div className="text-[11px] text-[#4B5563] pl-[42px] leading-[1.4] mt-0.5 whitespace-normal font-sans">
                  {item.description}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="px-5 py-4 border-t border-[#1E2130] shrink-0">
          {(userEmail || onSignOut) && (
            <div className="mb-3">
              {userEmail && (
                <div className="text-[11px] text-[#6B7280] font-sans truncate">
                  {userEmail}
                </div>
              )}

              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="mt-2 w-full h-9 rounded-lg border border-[#252A3A] bg-transparent text-[#F87171] text-[12px] font-medium hover:border-[#F8717133]"
                >
                  Sair
                </button>
              )}
            </div>
          )}

          <div className="text-[10px] text-[#374151] leading-[1.6] font-mono">
            <div className="text-[#4B5563]">v1.0.0 · SouthMindly Docs</div>
            <div>Sistema de Geração de Documentos</div>
          </div>
        </div>
      )}
    </aside>
  );
}
