import React from 'react';
import { FreeTierHeader } from './FreeTierHeader';
import { FreeTierSidebar } from './FreeTierSidebar';
import { AuraAmbientGlow, AuraDotPattern, AuraGradientOrb } from './AuraBackground';

interface FreeTierLayoutProps {
  children: React.ReactNode;
}

export const FreeTierLayout: React.FC<FreeTierLayoutProps> = ({ children }) => {
  React.useEffect(() => {
    // Force Signature Light Mode Warm Off White Background
    const root = document.documentElement;
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    localStorage.setItem('kontagi_theme', 'light');
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#FAF8F3] text-[#162A3B] font-sans antialiased flex">
      {/* Ambient background glows */}
      <AuraAmbientGlow />
      <AuraDotPattern opacity={0.15} />
      
      {/* Soft Ambient Orbs */}
      <AuraGradientOrb className="-top-12 -right-12" size={400} variant="vermilion" opacity={0.12} />
      <AuraGradientOrb className="bottom-10 -left-20" size={450} variant="navy" opacity={0.12} />

      {/* Fullscreen Workspace Shell */}
      <div className="relative z-10 w-full flex-1 flex min-h-screen">
        <FreeTierSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <FreeTierHeader />
          <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[#FAF8F3]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
