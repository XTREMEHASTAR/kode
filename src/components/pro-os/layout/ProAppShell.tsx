import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ProGlobalSidebar } from './ProGlobalSidebar';
import { ProTopToolbar } from './ProTopToolbar';
import { ProRightInspector } from './ProRightInspector';
import { ProBottomConsole, ProConsoleLog } from './ProBottomConsole';

interface ProAppShellProps {
  children?: React.ReactNode;
  inspectorContent?: React.ReactNode;
}

export const ProAppShell: React.FC<ProAppShellProps> = ({ children, inspectorContent }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [logs] = useState<ProConsoleLog[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), topic: 'SYSTEM', message: 'AuraCore 12-Engine Pro Cluster online. Standby for simulation jobs.' }
  ]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#090D16',
        color: '#FFFFFF',
        fontFamily: "'Satoshi', 'Inter', sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* 1. Global Left Sidebar */}
      <ProGlobalSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Center + Right Stack */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100%' }}>
        
        {/* 2. Top Toolbar */}
        <ProTopToolbar
          onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
          onToggleConsole={() => setConsoleOpen(!consoleOpen)}
          isInspectorOpen={inspectorOpen}
          isConsoleOpen={consoleOpen}
        />

        {/* Workspace Body: Main View + Right Inspector */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          
          {/* 3. Main Workspace Area */}
          <main
            style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0
            }}
          >
            {children || <Outlet />}
          </main>

          {/* 4. Right Inspector Panel */}
          <ProRightInspector open={inspectorOpen} onClose={() => setInspectorOpen(false)}>
            {inspectorContent}
          </ProRightInspector>

        </div>

        {/* 5. Bottom Event Console */}
        <ProBottomConsole
          open={consoleOpen}
          onClose={() => setConsoleOpen(false)}
          logs={logs}
        />

      </div>
    </div>
  );
};
