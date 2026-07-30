import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ComingSoonPage } from './launch';

/**
 * KONTAGI.Simulate Locked Main Landing Page
 * ------------------------------------------
 * Only '/' is accessible, rendering the KONTAGI.Simulate Coming Soon page.
 * Every other URL path is blocked and automatically redirected to '/'.
 * 
 * To restore the full SaaS application after launch:
 * Option 1: Copy content from `App.full.tsx` back into `App.tsx`.
 * Option 2: Swap the export in `main.tsx` to `import App from './App.full'`.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComingSoonPage />} />
        {/* Block ALL other routes & redirect to '/' */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
