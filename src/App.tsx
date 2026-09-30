import React from 'react';
import { DualDevProvider, useDualDev } from './context/DualDevContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AcademiaPage } from './pages/AcademiaPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ConquistasPage } from './pages/ConquistasPage';
import { SobrePage } from './pages/SobrePage';

function AppContent() {
  const { activeTab, theme } = useDualDev();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage />;
      case 'academia':
        return <AcademiaPage />;
      case 'playground':
        return <PlaygroundPage />;
      case 'conquistas':
        return <ConquistasPage />;
      case 'sobre':
        return <SobrePage />;
      default:
        return <AcademiaPage />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark'
          ? 'dark bg-[#0b0813] text-purple-100 selection:bg-purple-600/30 selection:text-purple-200'
          : 'light bg-[#faf8fd] text-slate-900 selection:bg-purple-500/20 selection:text-purple-900'
      }`}
    >
      <Navbar />
      <main className="flex-1 flex flex-col">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DualDevProvider>
      <AppContent />
    </DualDevProvider>
  );
}
