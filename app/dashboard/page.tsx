'use client';

import DocHome from '@/components/dashboard/docHome';
import Sidebar from '@/components/dashboard/sidebar';
import PautaReuniao from '@/components/docs/pauta-reuniao';
import { DocType } from '@/types/docs';
import { useState } from 'react';

export default function DashboardPage() {
  const [activeDoc, setActiveDoc] = useState<DocType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSelectDoc = (doc: DocType) => {
    setActiveDoc(doc);
  };

  const handleBack = () => {
    setActiveDoc(null);
  };

  const renderContent = () => {
    switch (activeDoc) {
      case 'pauta-reuniao':
        return <PautaReuniao onBack={handleBack} />;
      default:
        return <DocHome onSelectDoc={handleSelectDoc} />;
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
