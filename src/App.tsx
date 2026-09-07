import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import { RoleSelectorHome } from './components/home/RoleSelectorHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AccessControlModule } from './components/access/AccessControlModule';
import { MemberPortalModule } from './components/member/MemberPortalModule';
import { STPSComplianceModule } from './components/compliance/STPSComplianceModule';
import { usePWA } from './hooks/usePWA';

const MainAppLayout: React.FC = () => {
  const { activeRole } = useApp();
  const { isInstallable, installPWA, isStandalone } = usePWA();
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const handleInstallClick = () => {
    if (isInstallable) {
      installPWA();
    } else {
      setShowPwaModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Unified Institutional Header */}
      <Header
        onOpenInstallModal={handleInstallClick}
        onToggleSidebar={() => setSidebarOpenMobile((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Desktop Sidebar (Only active when in a role) */}
        {activeRole && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
            isOpenMobile={sidebarOpenMobile}
            onCloseMobile={() => setSidebarOpenMobile(false)}
          />
        )}

        {/* Dynamic Viewport */}
        <main
          className={`flex-1 overflow-y-auto pb-8 lg:pb-12 ${
            activeRole ? 'p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' : ''
          }`}
        >
          {!activeRole && <RoleSelectorHome />}
          {activeRole === 'admin' && <AdminDashboard />}
          {activeRole === 'instructor' && <AccessControlModule />}
          {activeRole === 'member' && <MemberPortalModule />}
          {activeRole === 'compliance' && <STPSComplianceModule />}
        </main>
      </div>

      {/* PWA Install Instructions Modal */}
      <PWAInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        onInstall={installPWA}
        isInstallable={isInstallable}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
