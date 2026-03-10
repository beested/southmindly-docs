'use client';

import DocHome from '@/components/dashboard/docHome';
import Sidebar, {
  DESKTOP_SIDEBAR_CLOSED_WIDTH,
  DESKTOP_SIDEBAR_OPEN_WIDTH,
} from '@/components/dashboard/sidebar';
import Clientes from '@/components/docs/clientes';
import PautaReuniao from '@/components/docs/pauta-reuniao';
import PropostaComercial from '@/components/docs/proposta-comercial';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { DocType } from '@/types/docs';
import { PanelLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openSavedPautasToken] = useState(0);
  const [openSavedPautaId, setOpenSavedPautaId] = useState<string | null>(null);

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

  const handleSelectDoc = (doc: DocType) => {
    setActiveDoc(doc);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleBack = () => {
    setActiveDoc(null);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleOpenSavedPauta = (id: string) => {
    setActiveDoc('pauta-reuniao');
    setOpenSavedPautaId(id);
    if (isMobile) setMobileSidebarOpen(false);
  };

  const desktopSidebarWidth = desktopSidebarOpen
    ? DESKTOP_SIDEBAR_OPEN_WIDTH
    : DESKTOP_SIDEBAR_CLOSED_WIDTH;

  const renderContent = () => {
    switch (activeDoc) {
      case 'pauta-reuniao':
        return (
          <PautaReuniao
            onBack={handleBack}
            openSavedPautasToken={openSavedPautasToken}
            openSavedPautaId={openSavedPautaId ?? undefined}
          />
        );
      case 'proposta-comercial':
        return <PropostaComercial onBack={handleBack} />;
      case 'clientes':
        return <Clientes onBack={handleBack} />;
      default:
        return (
          <DocHome
            onSelectDoc={handleSelectDoc}
            onOpenSavedPauta={handleOpenSavedPauta}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D0F14]">
      {isMobile && mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-[180] bg-black/50 lg:hidden"
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
          className="fixed left-4 top-4 z-[190] flex size-11 items-center justify-center rounded-2xl border border-[#1E2130] bg-[#13161D] text-[#E8EAF0] shadow-[0_14px_30px_rgba(0,0,0,0.35)] lg:hidden"
          aria-label="Abrir menu"
        >
          <PanelLeft className="size-5" />
        </button>
      ) : null}

      <main
        className="flex min-h-screen min-w-0 flex-col transition-[margin,width] duration-300 ease-out"
        style={{
          marginLeft: isMobile ? 0 : desktopSidebarWidth,
          width: isMobile ? '100%' : `calc(100% - ${desktopSidebarWidth}px)`,
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}
