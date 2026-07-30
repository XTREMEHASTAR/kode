import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProRoute } from './components/guards/ProRoute';
import { AdminRoute } from './components/guards/AdminRoute';
import { InternalRoute } from './components/guards/InternalRoute';
import { DevOnlyRoute } from './components/guards/DevOnlyRoute';
import { FeatureFlagRoute } from './components/guards/FeatureFlagRoute';
import { ComingSoonPage } from './launch';
import { ComingSoonAdmin } from './pages/admin/ComingSoonAdmin';
import { NotFoundPage } from './pages/NotFoundPage';

// Global Scroll-To-Top component for seamless route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import { AppShell } from './layouts/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Upload } from './pages/Upload';
import { AssetAnalysis } from './pages/AssetAnalysis';
import { LivePipelineProcessing } from './components/processing/LivePipelineProcessing';
import { GlobalSystem } from './pages/GlobalSystem';
import { ProSimulationPage } from './pages/pro/ProSimulationPage';
import { ProContentDnaPage } from './pages/pro/ProContentDnaPage';
import { ProAiViewersPage } from './pages/pro/ProAiViewersPage';
import { ProAuraWorldPage } from './pages/pro/ProAuraWorldPage';
import {
  ProRecommendationPage,
  ProTrendsPage,
  ProAudiencePage,
  ProBehaviorPage,
  ProMemoryPage,
  ProCommunityPage,
  ProKnowledgePage
} from './pages/pro/ProLabModules';
import { ProPredictionCenterPage } from './pages/pro/ProPredictionCenterPage';
import { ProCompetitionArenaPage } from './pages/pro/ProCompetitionArenaPage';
import { ProSimulationReplayPage } from './pages/pro/ProSimulationReplayPage';
import { ProCounterfactualLabPage } from './pages/pro/ProCounterfactualLabPage';
import { ProReportsCenterPage } from './pages/pro/ProReportsCenterPage';
import { ProDigitalTwinPage } from './pages/pro/ProDigitalTwinPage';
import { ProSettingsPage } from './pages/pro/ProSettingsPage';
import { ProProductionTestingPage } from './pages/pro/ProProductionTestingPage';

// Authentication Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyEmail } from './pages/VerifyEmail';
import { AuthNotFound } from './pages/AuthNotFound';

// Free Tier Pages
import { ScriptUpload } from './pages/free-tier/ScriptUpload';
import { ScriptLibrary } from './pages/free-tier/ScriptLibrary';
import { ScriptResults } from './pages/free-tier/ScriptResults';

// Support & Legal Pages
import { SupportPage } from './pages/support/SupportPage';
import { TermsPage } from './pages/support/TermsPage';
import { PrivacyPage } from './pages/support/PrivacyPage';
import { HelpCenterPage } from './pages/support/HelpCenterPage';

// Monetization & Billing Pages
import { Pricing } from './pages/monetization/Pricing';
import { Checkout } from './pages/monetization/Checkout';
import { CheckoutSuccess } from './pages/monetization/CheckoutSuccess';
import { CheckoutFailed } from './pages/monetization/CheckoutFailed';
import { BillingSettings } from './pages/settings/BillingSettings';
import { LaunchCommandCenter } from './pages/admin/LaunchCommandCenter';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ── PUBLIC ROUTES ────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth-404" element={<AuthNotFound />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/coming-soon" element={<ComingSoonPage />} />

        {/* ── ADMIN ROUTES (Enforced Admin Security) ─────────────── */}
        <Route path="/admin/coming-soon" element={<AdminRoute><ComingSoonAdmin /></AdminRoute>} />
        <Route path="/admin/launch-center" element={<AdminRoute><LaunchCommandCenter /></AdminRoute>} />
        <Route path="/admin/*" element={<AdminRoute><LaunchCommandCenter /></AdminRoute>} />
        <Route path="/dashboard/admin" element={<AdminRoute><LaunchCommandCenter /></AdminRoute>} />

        {/* ── INTERNAL ROUTES ─────────────────────────────────────── */}
        <Route path="/internal/*" element={<InternalRoute><LaunchCommandCenter /></InternalRoute>} />

        {/* ── MONETIZATION & BILLING ROUTES ──────────────────────── */}
        <Route path="/checkout" element={<ProtectedRoute><ProRoute><Checkout /></ProRoute></ProtectedRoute>} />
        <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
        <Route path="/checkout/failed" element={<ProtectedRoute><CheckoutFailed /></ProtectedRoute>} />
        <Route path="/settings/billing" element={<ProtectedRoute><BillingSettings /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><ProSettingsPage /></ProtectedRoute>} />
        <Route path="/pro/settings" element={<ProtectedRoute><ProSettingsPage /></ProtectedRoute>} />
        <Route path="/settings/advanced" element={<ProtectedRoute><ProRoute><ProSettingsPage /></ProRoute></ProtectedRoute>} />

        {/* ── SUPPORT & LEGAL ROUTES ──────────────────────────────── */}
        <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
        <Route path="/help" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
        <Route path="/help-center" element={<ProtectedRoute><HelpCenterPage /></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute><TermsPage /></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />

        {/* ── SCRIPT INTELLIGENCE (Protected + Feature Flag) ─────── */}
        <Route
          path="/script-intelligence"
          element={
            <ProtectedRoute>
              <FeatureFlagRoute flag="FEATURE_SCRIPT_LIBRARY">
                <ScriptUpload />
              </FeatureFlagRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/script-library"
          element={
            <ProtectedRoute>
              <FeatureFlagRoute flag="FEATURE_SCRIPT_LIBRARY">
                <ScriptLibrary />
              </FeatureFlagRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/script-intelligence/:analysisId/results"
          element={
            <ProtectedRoute>
              <FeatureFlagRoute flag="FEATURE_SCRIPT_LIBRARY">
                <ScriptResults />
              </FeatureFlagRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/script-intelligence/:analysisId/review"
          element={
            <ProtectedRoute>
              <FeatureFlagRoute flag="FEATURE_SCRIPT_LIBRARY">
                <ScriptResults />
              </FeatureFlagRoute>
            </ProtectedRoute>
          }
        />

        {/* ── DEVELOPMENT ONLY ROUTES (Disabled in Production) ───── */}
        <Route path="/dev/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
        <Route path="/debug/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
        <Route path="/storybook/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
        <Route path="/test/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
        <Route path="/playground/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
        <Route path="/mock/*" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />

        {/* ── MAIN WORKSPACE SHELL ────────────────────────────────── */}
        <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          {/* Default landing redirects to Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dedicated Pro Laboratory Routes */}
          <Route path="pro/simulation" element={<ProSimulationPage />} />
          <Route path="pro/replay" element={<ProSimulationReplayPage />} />
          <Route path="pro/devtools" element={<ProSimulationReplayPage />} />
          <Route path="pro/counterfactual" element={<ProCounterfactualLabPage />} />
          <Route path="pro/what-if" element={<ProCounterfactualLabPage />} />
          <Route path="pro/content-dna" element={<ProContentDnaPage />} />
          <Route path="pro/prediction" element={<ProPredictionCenterPage />} />
          <Route path="pro/forecast" element={<ProPredictionCenterPage />} />
          <Route path="pro/competition" element={<ProCompetitionArenaPage />} />
          <Route path="pro/arena" element={<ProCompetitionArenaPage />} />
          <Route path="pro/ai-viewers" element={<ProAiViewersPage />} />
          <Route path="pro/world" element={<ProAuraWorldPage />} />
          <Route path="pro/recommendation" element={<ProRecommendationPage />} />
          <Route path="pro/trends" element={<ProTrendsPage />} />
          <Route path="pro/audience" element={<ProAudiencePage />} />
          <Route path="pro/creator" element={<ProDigitalTwinPage />} />
          <Route path="pro/twin" element={<ProDigitalTwinPage />} />
          <Route path="pro/behavior" element={<ProBehaviorPage />} />
          <Route path="pro/memory" element={<ProMemoryPage />} />
          <Route path="pro/community" element={<ProCommunityPage />} />
          <Route path="pro/reports" element={<ProReportsCenterPage />} />
          <Route path="pro/viewer-swarm" element={<ProAiViewersPage />} />
          <Route path="pro/trend" element={<ProTrendsPage />} />
          <Route path="pro/benchmarks" element={<ProCompetitionArenaPage />} />
          <Route path="pro/knowledge" element={<ProKnowledgePage />} />
          <Route path="pro/production-testing" element={<ProProductionTestingPage />} />

          {/* Core workspace modules */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pro-os" element={<ProPredictionCenterPage />} />
          <Route path="studio" element={<ProPredictionCenterPage />} />
          <Route path="dna" element={<ProContentDnaPage />} />
          <Route path="population" element={<ProAiViewersPage />} />
          <Route path="simulation" element={<ProSimulationPage />} />
          <Route path="auracore" element={<ProPredictionCenterPage />} />
          <Route path="world" element={<ProAuraWorldPage />} />
          <Route path="auraworld" element={<ProAuraWorldPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="pro/projects" element={<Projects />} />
          <Route path="upload" element={<Upload />} />
          <Route path="processing/:videoId" element={<LivePipelineProcessing />} />
          <Route path="analytics" element={<ProRoute><Navigate to="/pro/prediction" replace /></ProRoute>} />
          <Route path="pro" element={<Navigate to="/dashboard" replace />} />
          
          {/* Video-specific analysis & scenario simulation routes */}
          <Route path="assets/:videoId/simulate" element={<ProSimulationPage />} />
          <Route path="assets/:videoId/:subPath" element={<FeatureFlagRoute flag="FEATURE_HOOK_INTEL"><AssetAnalysis /></FeatureFlagRoute>} />
          
          {/* Feature Flagged & Coming Soon Modules */}
          <Route path="library" element={<FeatureFlagRoute flag="FEATURE_CREATIVE_LIBRARY"><ScriptLibrary /></FeatureFlagRoute>} />
          <Route path="creators" element={<FeatureFlagRoute flag="FEATURE_WORKSPACES"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="brand" element={<FeatureFlagRoute flag="FEATURE_WORKSPACES"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="coach" element={<FeatureFlagRoute flag="FEATURE_ANALYTICS_V2"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="trend" element={<FeatureFlagRoute flag="FEATURE_ANALYTICS_V2"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="client" element={<FeatureFlagRoute flag="FEATURE_ENTERPRISE"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="team" element={<FeatureFlagRoute flag="FEATURE_ENTERPRISE"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="notifications" element={<FeatureFlagRoute flag="FEATURE_ENTERPRISE"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="mobile" element={<FeatureFlagRoute flag="FEATURE_MOBILE_PAIRING"><GlobalSystem /></FeatureFlagRoute>} />
          <Route path="design-system" element={<DevOnlyRoute><GlobalSystem /></DevOnlyRoute>} />
          
          {/* Catch-all fallback inside AppShell */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── GLOBAL 404 CATCH-ALL ───────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
