'use client';

import { usePageTransition } from '@/components/system/page-transition-provider';
import DocHome from '@/components/dashboard/docHome';
import AlinhamentoReuniao from '@/components/docs/alinhamento-reuniao';
import Contrato from '@/components/docs/contrato';
import Sidebar, {
  DESKTOP_SIDEBAR_CLOSED_WIDTH,
  DESKTOP_SIDEBAR_OPEN_WIDTH,
} from '@/components/dashboard/sidebar';
import Clientes from '@/components/docs/clientes';
import PropostaComercial from '@/components/docs/proposta-comercial';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { DocType } from '@/types/docs';
import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const DASHBOARD_VIEW_EXIT_MS = 140;
const DASHBOARD_VIEW_ENTER_MS = 220;

export default function DashboardPage() {
  const router = useRouter();
  const { startPageTransition } = usePageTransition();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [contentPhase, setContentPhase] = useState<'idle' | 'exit' | 'enter'>(
    'enter',
  );
  const contentExitTimeoutRef = useRef<number | null>(null);
  const contentEnterTimeoutRef = useRef<number | null>(null);
  const initialHtmlOverflowRef = useRef<string | null>(null);
  const initialBodyOverflowRef = useRef<string | null>(null);
  const initialHtmlOverscrollRef = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [supabase]);

  useEffect(() => {
    const syncViewport = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    syncViewport();
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, []);

  const clearContentTransitionTimeouts = useCallback(() => {
    if (contentExitTimeoutRef.current !== null) {
      window.clearTimeout(contentExitTimeoutRef.current);
      contentExitTimeoutRef.current = null;
    }

    if (contentEnterTimeoutRef.current !== null) {
      window.clearTimeout(contentEnterTimeoutRef.current);
      contentEnterTimeoutRef.current = null;
    }
  }, []);

  const scheduleContentEnterReset = useCallback(() => {
    if (contentEnterTimeoutRef.current !== null) {
      window.clearTimeout(contentEnterTimeoutRef.current);
    }

    contentEnterTimeoutRef.current = window.setTimeout(() => {
      setContentPhase('idle');
      contentEnterTimeoutRef.current = null;
    }, DASHBOARD_VIEW_ENTER_MS);
  }, []);

  useEffect(() => {
    scheduleContentEnterReset();

    return () => {
      clearContentTransitionTimeouts();
    };
  }, [clearContentTransitionTimeouts, scheduleContentEnterReset]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (initialHtmlOverflowRef.current === null) {
      initialHtmlOverflowRef.current = html.style.overflow;
    }

    if (initialBodyOverflowRef.current === null) {
      initialBodyOverflowRef.current = body.style.overflow;
    }

    if (initialHtmlOverscrollRef.current === null) {
      initialHtmlOverscrollRef.current = html.style.overscrollBehavior;
    }

    if (contentPhase !== 'idle') {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      return;
    }

    html.style.overflow = initialHtmlOverflowRef.current ?? '';
    body.style.overflow = initialBodyOverflowRef.current ?? '';
    html.style.overscrollBehavior = initialHtmlOverscrollRef.current ?? '';
  }, [contentPhase]);

  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = initialHtmlOverflowRef.current ?? '';
      document.body.style.overflow = initialBodyOverflowRef.current ?? '';
      document.documentElement.style.overscrollBehavior =
        initialHtmlOverscrollRef.current ?? '';
    };
  }, []);

  const transitionDashboardView = useCallback(
    (nextDoc: DocType | null) => {
      if (nextDoc === activeDoc) {
        if (isMobile) setMobileSidebarOpen(false);
        return;
      }

      if (isMobile) setMobileSidebarOpen(false);

      clearContentTransitionTimeouts();
      setContentPhase('exit');

      contentExitTimeoutRef.current = window.setTimeout(() => {
        setActiveDoc(nextDoc);
        contentExitTimeoutRef.current = null;

        window.requestAnimationFrame(() => {
          setContentPhase('enter');
          scheduleContentEnterReset();
        });
      }, DASHBOARD_VIEW_EXIT_MS);
    },
    [
      activeDoc,
      clearContentTransitionTimeouts,
      isMobile,
      scheduleContentEnterReset,
    ],
  );

  const handleSelectDoc = (doc: DocType) => {
    transitionDashboardView(doc);
  };

  const handleBack = () => {
    transitionDashboardView(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    startPageTransition(() => {
      router.push('/login');
      router.refresh();
    });
  };

  const desktopSidebarWidth = desktopSidebarOpen
    ? DESKTOP_SIDEBAR_OPEN_WIDTH
    : DESKTOP_SIDEBAR_CLOSED_WIDTH;

  const renderContent = () => {
    switch (activeDoc) {
      case 'alinhamento-reuniao':
        return <AlinhamentoReuniao onBack={handleBack} />;
      case 'contrato':
        return <Contrato onBack={handleBack} />;
      case 'proposta-comercial':
        return <PropostaComercial onBack={handleBack} />;
      case 'clientes':
        return <Clientes onBack={handleBack} />;
      default:
        return <DocHome onSelectDoc={handleSelectDoc} />;
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#0D0F14] print:block print:min-h-0 print:bg-transparent">
      {isMobile && mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-[180] bg-black/50 print:hidden lg:hidden"
        />
      ) : null}

      <Sidebar
        open={isMobile ? mobileSidebarOpen : desktopSidebarOpen}
        isMobile={isMobile}
        onToggle={() => {
          if (isMobile) {
            setMobileSidebarOpen((current) => !current);
            return;
          }

          setDesktopSidebarOpen((current) => !current);
        }}
        activeDoc={activeDoc}
        onSelectDoc={handleSelectDoc}
        onHome={handleBack}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      {isMobile ? (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(true)}
          className="fixed left-4 top-4 z-[190] flex size-11 items-center justify-center rounded-2xl border border-[#1E2130] bg-[#13161D] text-[#E8EAF0] shadow-[0_14px_30px_rgba(0,0,0,0.35)] print:hidden lg:hidden"
          aria-label="Abrir menu"
        >
          <PanelLeft className="size-5" />
        </button>
      ) : null}

      <main
        className="ml-[var(--dashboard-main-margin)] w-[var(--dashboard-main-width)] flex min-h-screen min-w-0 flex-col overflow-x-hidden transition-[margin,width] duration-300 ease-out print:ml-0 print:w-full print:min-h-0 print:overflow-visible"
        style={
          {
            '--dashboard-main-margin': isMobile
              ? '0px'
              : `${desktopSidebarWidth}px`,
            '--dashboard-main-width': isMobile
              ? '100%'
              : `calc(100% - ${desktopSidebarWidth}px)`,
          } as CSSProperties
        }
      >
        <div
          className={`min-h-screen overflow-x-hidden print:min-h-0 print:overflow-visible ${
            contentPhase === 'exit'
              ? 'sm-page-transition-exit'
              : contentPhase === 'enter'
                ? 'sm-page-transition-enter'
                : ''
          }`}
        >
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
