'use client';

import { Button } from '@/components/ui/button';
import { DOC_DEFINITIONS, PEOPLE_DEFINITIONS } from '@/lib/docs/registry';
import { DocType } from '@/types/docs';
import { LogOut } from 'lucide-react';
import Image from 'next/image';

export const DESKTOP_SIDEBAR_OPEN_WIDTH = 284;
export const DESKTOP_SIDEBAR_CLOSED_WIDTH = 64;
export const MOBILE_SIDEBAR_WIDTH = 300;

interface SidebarProps {
  open: boolean;
  isMobile?: boolean;
  onToggle: () => void;
  activeDoc: DocType | null;
  onSelectDoc: (doc: DocType) => void;
  onHome: () => void;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export default function Sidebar({
  open,
  isMobile = false,
  onToggle,
  activeDoc,
  onSelectDoc,
  onHome,
  userEmail,
  onSignOut,
}: SidebarProps) {
  return (
    <aside
      className={`fixed top-0 left-0 z-[200] flex h-screen flex-col overflow-hidden border-r border-[#1E2130] bg-[#13161D] transition-all duration-300 ease-out ${
        isMobile
          ? `${open ? 'translate-x-0' : '-translate-x-full'} shadow-[0_24px_80px_rgba(0,0,0,0.45)]`
          : ''
      }`}
      style={
        isMobile
          ? { width: `${MOBILE_SIDEBAR_WIDTH}px`, maxWidth: '88vw' }
          : {
              width: `${
                open
                  ? DESKTOP_SIDEBAR_OPEN_WIDTH
                  : DESKTOP_SIDEBAR_CLOSED_WIDTH
              }px`,
            }
      }
    >
      {/* Header */}
      <div
        className={`relative flex items-center border-b border-[#1E2130] shrink-0 ${
          open ? 'h-[76px] px-3.5' : 'h-[76px] px-2.5'
        }`}
      >
        {open && (
          <Button
            type="button"
            variant="ghost"
            onClick={onHome}
            className="group relative h-auto min-w-0 flex-1 justify-start overflow-hidden rounded-[18px] border border-[#2A3145] bg-[linear-gradient(135deg,rgba(79,126,255,0.16),rgba(19,22,29,0.98)_58%)] px-3 py-2.5 text-left shadow-[0_14px_30px_rgba(0,0,0,0.28)] transition-all duration-200 hover:border-[#3B4764] hover:bg-[linear-gradient(135deg,rgba(79,126,255,0.22),rgba(19,22,29,1)_62%)]"
            aria-label="Voltar para a home"
          >
            <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-[radial-gradient(circle_at_center,rgba(79,126,255,0.22),transparent_72%)] opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
            <span className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] border border-[#FFFFFF14] bg-[#11141C]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                <Image
                  src="/logo-icon.png"
                  alt=""
                  width={22}
                  height={27}
                  className="h-[27px] w-auto"
                />
              </span>
              <span className="min-w-0">
                <Image
                  src="/logo-full.png"
                  alt="SouthMindly"
                  width={665}
                  height={138}
                  className="h-[26px] w-auto max-w-[146px]"
                  priority
                />
                <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[#7E879B] font-mono">
                  Docs Workspace
                </span>
              </span>
            </span>
          </Button>
        )}

        {!open && !isMobile && (
          <Button
            type="button"
            variant="ghost"
            onClick={onHome}
            className="group relative mx-auto flex h-12 w-12 items-center justify-center rounded-[18px] border border-[#2A3145] bg-[linear-gradient(180deg,rgba(79,126,255,0.18),rgba(19,22,29,1))] p-0 shadow-[0_14px_28px_rgba(0,0,0,0.26)] transition-all duration-200 hover:border-[#3B4764] hover:scale-[1.03]"
            aria-label="Voltar para a home"
          >
            <span className="absolute inset-[1px] rounded-[17px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_52%)] opacity-70" />
            <Image
              src="/logo-icon.png"
              alt="SouthMindly"
              width={24}
              height={30}
              className="relative h-[30px] w-auto drop-shadow-[0_6px_14px_rgba(79,126,255,0.28)]"
            />
          </Button>
        )}

        {open && (
          <Button
            type="button"
            variant="ghost"
            onClick={onToggle}
            className="ml-2 h-10 w-10 shrink-0 rounded-xl border border-transparent bg-transparent p-0 text-base text-[#6B7280] transition-colors hover:border-[#252A3A] hover:bg-[#1E2130] hover:text-[#CDD5E1]"
          >
            {isMobile ? '✕' : '‹'}
          </Button>
        )}
      </div>

      {!open && !isMobile && (
        <Button
          type="button"
          variant="ghost"
          onClick={onToggle}
          className="mx-auto mt-2 flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-transparent p-0 text-base text-[#6B7280] transition-colors hover:border-[#252A3A] hover:bg-[#1E2130] hover:text-[#CDD5E1]"
        >
          ›
        </Button>
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
        {DOC_DEFINITIONS.map((item) => {
          const isActive = activeDoc === item.id;
          const Icon = item.icon;
          return (
            <Button
              type="button"
              variant="ghost"
              key={item.id}
              onClick={() => item.available && onSelectDoc(item.id)}
              title={!open ? item.label : undefined}
              className={`mb-0.5 flex w-full rounded-[10px] border transition-all duration-[180ms] ease-out hover:bg-[#1E2130] ${
                isActive
                  ? 'bg-[#1a2340] border-[#4F7EFF44]'
                  : 'bg-transparent border-transparent'
              } ${
                item.available
                  ? 'cursor-pointer opacity-100'
                  : 'cursor-default opacity-50'
              } ${
                open
                  ? 'h-auto flex-col items-start justify-start gap-2.5 p-3 text-left'
                  : 'h-[52px] items-center justify-center p-0 text-center'
              }`}
            >
              <div
                className={`flex items-center gap-2.5 ${
                  open ? 'w-full justify-start' : 'w-full justify-center'
                }`}
              >
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
                  <Icon
                    className="size-4"
                    style={{ color: isActive ? item.color : '#9CA3AF' }}
                  />
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
            </Button>
          );
        })}

        {PEOPLE_DEFINITIONS.length > 0 && (
          <div className={open ? 'pt-3' : 'pt-2'}>
            {open && (
              <div className="px-1 pb-2 text-[10px] text-[#4B5563] tracking-[0.15em] uppercase shrink-0 font-mono">
                Pessoas
              </div>
            )}

            {!open && (
              <div className="my-1 h-px bg-[#1E2130]" aria-hidden="true" />
            )}

            {PEOPLE_DEFINITIONS.map((item) => {
              const isActive = activeDoc === item.id;
              const Icon = item.icon;
              return (
                <Button
                  type="button"
                  variant="ghost"
                  key={item.id}
                  onClick={() => item.available && onSelectDoc(item.id)}
                  title={!open ? item.label : undefined}
                  className={`mb-0.5 flex w-full rounded-[10px] border transition-all duration-[180ms] ease-out hover:bg-[#1E2130] ${
                    isActive
                      ? 'bg-[#1a2340] border-[#4F7EFF44]'
                      : 'bg-transparent border-transparent'
                  } ${
                    item.available
                      ? 'cursor-pointer opacity-100'
                      : 'cursor-default opacity-50'
                  } ${
                    open
                      ? 'h-auto flex-col items-start justify-start gap-2.5 p-3 text-left'
                      : 'h-[52px] items-center justify-center p-0 text-center'
                  }`}
                >
                  <div
                    className={`flex items-center gap-2.5 ${
                      open ? 'w-full justify-start' : 'w-full justify-center'
                    }`}
                  >
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
                      <Icon
                        className="size-4"
                        style={{ color: isActive ? item.color : '#9CA3AF' }}
                      />
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
                </Button>
              );
            })}
          </div>
        )}
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
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onSignOut}
                  className="w-full"
                >
                  <LogOut className="size-4" />
                  Sair
                </Button>
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
