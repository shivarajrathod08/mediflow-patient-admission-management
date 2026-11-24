import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastMessage, ToastNotification } from './components/ToastNotification';
import { DashboardPage } from './pages/DashboardPage';
import { PatientsPage } from './pages/PatientsPage';
import { Patient } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Trigger for adding patient from Header / Sidebar while on any tab
  const [triggerAddPatient, setTriggerAddPatient] = useState(false);

  // Selected patient to view details across tabs
  const [selectedPatientForView, setSelectedPatientForView] = useState<Patient | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString().substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdmitPatientTrigger = () => {
    setActiveTab('patients');
    setTriggerAddPatient(true);
  };

  const handleViewPatientFromDashboard = (patient: Patient) => {
    setSelectedPatientForView(patient);
    setActiveTab('patients');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onQuickAddPatient={handleAdmitPatientTrigger}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onAdmitPatient={handleAdmitPatientTrigger}
        />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' ? (
            <DashboardPage
              onAdmitPatient={handleAdmitPatientTrigger}
              onNavigateToPatients={() => setActiveTab('patients')}
              onViewPatient={handleViewPatientFromDashboard}
            />
          ) : (
            <PatientsPage
              onShowToast={showToast}
              externalTriggerAdd={triggerAddPatient}
              onClearExternalTriggerAdd={() => setTriggerAddPatient(false)}
              selectedPatientForView={selectedPatientForView}
              onClearViewPatient={() => setSelectedPatientForView(null)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-500 bg-white">
          <span>MediFlow &copy; {new Date().getFullYear()} &bull; Patient Admission Management System</span>
        </footer>
      </div>

      {/* Toast Notification Container */}
      <ToastNotification toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default App;
