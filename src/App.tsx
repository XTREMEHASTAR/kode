import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Preloader, ComingSoonPage } from './launch';

/**
 * AuraCore Locked Single Route Launch Application Mode
 * ----------------------------------------------------
 * Only '/' is accessible. Every other URL path is blocked and
 * automatically redirected to '/'.
 * 
 * Zero SaaS modules, dashboard components, AI prediction engines,
 * or background services are loaded.
 * 
 * To restore the full AuraCore SaaS application after launch:
 * Option 1: Copy content from `App.full.tsx` back into `App.tsx`.
 * Option 2: Swap the export in `main.tsx` to `import App from './App.full'`.
 */
const LaunchView: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <ComingSoonPage />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LaunchView />} />
        {/* Block ALL other routes & redirect to '/' */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
