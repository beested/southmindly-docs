'use client';

import DocHome from '@/components/dashboard/docHome';
import Sidebar from '@/components/dashboard/sidebar';
import Clientes from '@/components/docs/clientes';
import PautaReuniao from '@/components/docs/pauta-reuniao';
import PropostaComercial from '@/components/docs/proposta-comercial';
import { DocType } from '@/types/docs';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openSavedPautasToken, setOpenSavedPautasToken] = useState(0);
  const [openSavedPautaId, setOpenSavedPautaId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [supabase]);

  const handleSelectDoc = (doc: DocType) => {
    setActiveDoc(doc);
  };

  const handleBack = () => {
    setActiveDoc(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleConsultSavedPautas = () => {
    setActiveDoc('pauta-reuniao');
    setOpenSavedPautaId(null);
    setOpenSavedPautasToken((t) => t + 1);
  };

  const handleOpenSavedPauta = (id: string) => {
    setActiveDoc('pauta-reuniao');
    setOpenSavedPautaId(id);
  };

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0F14' }}>
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeDoc={activeDoc}
        onSelectDoc={handleSelectDoc}
        onHome={handleBack}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onConsultSavedPautas={handleConsultSavedPautas}
      />
      <main
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '260px' : '64px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}
