const fs = require('fs');
const path = require('path');
const p = 'c:/Users/jaiveer/Downloads/insaas/src/components/free-tier/AICopilotView.tsx';
let content = fs.readFileSync(p, 'utf8');

// Replace hardcoded colors with CSS variables
const replacements = [
  // Top Banner
  [/backgroundColor: '#EFF6FF'/g, "backgroundColor: 'var(--bg-secondary)'"],
  [/border: '1px solid #BFDBFE'/g, "border: '1px solid var(--border-strong)'"],
  [/color: '#1E40AF'/g, "color: 'var(--text-primary)'"],
  [/color: '#2563EB'/g, "color: 'var(--brand-primary)'"],
  
  // Tabs
  [/backgroundColor: copilotMode === 'hook' \? '#2563EB' : '#FFFFFF'/g, "backgroundColor: copilotMode === 'hook' ? 'var(--brand-primary)' : 'var(--bg-primary)'"],
  [/color: copilotMode === 'hook' \? '#FFFFFF' : '#4B5563'/g, "color: copilotMode === 'hook' ? '#FFFFFF' : 'var(--text-secondary)'"],
  [/backgroundColor: copilotMode === 'script' \? '#2563EB' : '#FFFFFF'/g, "backgroundColor: copilotMode === 'script' ? 'var(--brand-primary)' : 'var(--bg-primary)'"],
  [/color: copilotMode === 'script' \? '#FFFFFF' : '#4B5563'/g, "color: copilotMode === 'script' ? '#FFFFFF' : 'var(--text-secondary)'"],
  
  // Containers
  [/backgroundColor: '#F8FAFC'/g, "backgroundColor: 'var(--bg-secondary)'"],
  [/border: '1px solid #E2E8F0'/g, "border: '1px solid var(--border-subtle)'"],
  [/border: '1px solid #CBD5E1'/g, "border: '1px solid var(--border-subtle)'"],
  [/borderTop: '1px solid #E2E8F0'/g, "borderTop: '1px solid var(--border-subtle)'"],
  
  // Colors
  [/color: '#FFFFFF'/g, "color: '#FFFFFF'"],
  [/color: '#4B5563'/g, "color: 'var(--text-secondary)'"],
  [/backgroundColor: '#FFFFFF'/g, "backgroundColor: 'var(--bg-primary)'"],
  
  // Multi-step Loading
  [/borderTopColor: '#2563EB'/g, "borderTopColor: 'var(--brand-primary)'"],
  
  // Side-by-side
  [/backgroundColor: '#F0FDF4'/g, "backgroundColor: 'var(--bg-secondary)'"],
  [/borderLeft: '4px solid #10B981'/g, "borderLeft: '4px solid var(--brand-primary)'"],
  [/borderLeft: '4px solid var\(--text-muted\)'/g, "borderLeft: '4px solid var(--border-strong)'"],
  [/color: '#15803D'/g, "color: 'var(--text-primary)'"],
  [/color: '#14532D'/g, "color: 'var(--text-primary)'"],
  [/color: '#1E3A8A'/g, "color: 'var(--text-secondary)'"],
  
  // Fix button borders
  [/border: '1px solid #A7F3D0'/g, "border: '1px solid var(--border-strong)'"],
  
  // Fact Warnings
  [/backgroundColor: hookData.warningType === 'CHANGED_FACT' \? '#FEF2F2' : '#FFFBEB'/g, "backgroundColor: 'var(--bg-secondary)'"],
  
  // Badges
  [/backgroundColor: '#F1F5F9'/g, "backgroundColor: 'var(--bg-secondary)'"],
  [/backgroundColor: '#DCFCE7'/g, "backgroundColor: 'var(--bg-secondary)'"],
  [/backgroundColor: '#FEF3C7'/g, "backgroundColor: 'var(--bg-secondary)'"],
  
  // Replace active tab color
  [/backgroundColor: scriptData === scriptHistory\[idx\] \? '#2563EB' : '#FFFFFF'/g, "backgroundColor: scriptData === scriptHistory[idx] ? 'var(--brand-primary)' : 'var(--bg-primary)'"],
  [/backgroundColor: hookData === hookHistory\[idx\] \? '#2563EB' : '#FFFFFF'/g, "backgroundColor: hookData === hookHistory[idx] ? 'var(--brand-primary)' : 'var(--bg-primary)'"],

  // Replace ft-card with aura-card
  [/ft-card/g, "aura-card"],

  // Replace ft-btn with aura-btn
  // We can just keep it ft-btn if they are mostly globally styled, wait, let's keep it ft-btn for now.
];

replacements.forEach(([regex, replacement]) => {
  content = content.replace(regex, replacement);
});

fs.writeFileSync(p, content);
console.log("Colors replaced in AICopilotView.tsx");
