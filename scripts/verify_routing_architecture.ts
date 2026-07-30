import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('=== RUNNING APPLICATION ARCHITECTURE & ROUTING VERIFICATION ===\n');

  const appTsxPath = path.join(process.cwd(), 'src', 'App.tsx');
  const appShellPath = path.join(process.cwd(), 'src', 'layouts', 'AppShell.tsx');
  const sidebarPath = path.join(process.cwd(), 'src', 'components', 'pro-os', 'layout', 'ProGlobalSidebar.tsx');
  const predViewPath = path.join(process.cwd(), 'src', 'components', 'pro-os', 'ProPredictionCenterView.tsx');

  const appTsxContent = fs.readFileSync(appTsxPath, 'utf-8');
  const appShellContent = fs.readFileSync(appShellPath, 'utf-8');
  const sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
  const predViewContent = fs.readFileSync(predViewPath, 'utf-8');

  // Audit 1: Default Landing Redirects in App.tsx
  const indexRedirectToPrediction = appTsxContent.includes('<Route index element={<Navigate to="/pro/prediction" replace />} />');
  const dashboardRedirectToPrediction = appTsxContent.includes('<Route path="dashboard" element={<Navigate to="/pro/prediction" replace />} />');
  const proRedirectToPrediction = appTsxContent.includes('<Route path="pro" element={<Navigate to="/pro/prediction" replace />} />');

  console.log(`• Index Redirect to /pro/prediction: ${indexRedirectToPrediction ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`• Dashboard Redirect to /pro/prediction: ${dashboardRedirectToPrediction ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`• Pro Redirect to /pro/prediction: ${proRedirectToPrediction ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // Audit 2: Sidebar Main Entry
  const sidebarMainIsPrediction = sidebarContent.includes("path: '/pro/prediction', label: 'Prediction Report'");
  const appShellHasPredictionReport = appShellContent.includes('<span className="sidebar-text-label">Prediction Report</span>');

  console.log(`• ProGlobalSidebar Main Entry is Prediction Report: ${sidebarMainIsPrediction ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`• AppShell Navigation lists Prediction Report: ${appShellHasPredictionReport ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // Audit 3: Scenario Simulator Button in Prediction View
  const hasScenarioButton = predViewContent.includes('Enter Scenario Simulator (Optional)');
  console.log(`• Prediction Report Has Optional Scenario Simulator Button: ${hasScenarioButton ? 'YES (PASS)' : 'NO (FAIL)'}`);

  const allPass = indexRedirectToPrediction && dashboardRedirectToPrediction && proRedirectToPrediction && sidebarMainIsPrediction && appShellHasPredictionReport && hasScenarioButton;

  const status = allPass ? 'PASS' : 'FAIL';

  console.log(`\n=== ROUTING ARCHITECTURE VERDICT: ${status} ===\n`);

  if (!allPass) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Routing Architecture Verification Error:', err);
  process.exit(1);
});
