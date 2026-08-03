import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Layers, 
  Sparkles, 
  Compass, 
  Eye, 
  BarChart2, 
  Sliders, 
  BrainCircuit, 
  GitBranch, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  TrendingUp
} from 'lucide-react';

import { DecisionPlanView } from './DecisionPlanView';
import { ExplainabilityView } from './ExplainabilityView';
import { BenchmarkRadarView } from './BenchmarkRadarView';
import { ScenarioExplorer } from './ScenarioExplorer';
import { CreatorTwinView } from './CreatorTwinView';
import { ModelRegistryView } from './ModelRegistryView';

export const IntelligenceOSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'decision' | 'explainability' | 'benchmark' | 'scenario' | 'twin' | 'models'>('decision');

  const subsystems = [
    { name: 'Content Understanding (CUE)', status: 'healthy' },
    { name: 'Creative Knowledge Graph (CKG)', status: 'healthy' },
    { name: 'Embedding Layer', status: 'healthy' },
    { name: 'Evidence Graph Engine', status: 'healthy' },
    { name: 'Audience Simulation (ASE)', status: 'healthy' },
    { name: 'Benchmark Intelligence', status: 'healthy' },
    { name: 'Scenario Counterfactuals', status: 'healthy' },
    { name: 'Creator Twin Engine', status: 'healthy' },
    { name: 'Calibration Registry', status: 'healthy' },
    { name: 'Decision Intelligence', status: 'healthy' },
    { name: 'Optimization Engine', status: 'healthy' },
    { name: 'Model Registry & Router', status: 'active' },
    { name: 'Continuous Learning', status: 'healthy' },
    { name: 'Explainability Engine', status: 'healthy' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Master Top Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-white shadow-xl shadow-indigo-600/30">
              <Server className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">KONTAGI AI Creative Intelligence Operating System</h1>
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 14 Core Subsystems Active
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Unified AI-CIOS Kernel powering Content Understanding, Persona Simulation, Counterfactual Scenarios & Decision Guidance.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-3 shrink-0">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-right">
              <div className="text-xs font-semibold text-slate-400">Queue Telemetry & SLAs</div>
              <div className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5 justify-end mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Worker Pool: HEALTHY (P95: 1450ms)
              </div>
            </div>

            <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60 text-right">
              <div className="text-xs font-semibold text-slate-400">Active Model Surface</div>
              <div className="text-sm font-bold text-indigo-400 font-mono">Gemini 2.0 Flash (Direct)</div>
            </div>
          </div>
        </div>

        {/* 14 Subsystem Health Status Matrix */}
        <div className="mt-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">14-Subsystem Micro-Kernel Health Status</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {subsystems.map((sub, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-lg p-2 text-[11px] flex items-center space-x-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span className="truncate text-slate-300 font-medium">{sub.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('decision')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'decision'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Decision Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('explainability')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'explainability'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>7-Pillar Explainability</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmark')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'benchmark'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Benchmark Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('scenario')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'scenario'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Scenario Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('twin')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'twin'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Creator Twin</span>
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'models'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Model Registry</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'decision' && <DecisionPlanView />}
        {activeTab === 'explainability' && <ExplainabilityView />}
        {activeTab === 'benchmark' && <BenchmarkRadarView />}
        {activeTab === 'scenario' && <ScenarioExplorer />}
        {activeTab === 'twin' && <CreatorTwinView />}
        {activeTab === 'models' && <ModelRegistryView />}
      </div>
    </div>
  );
};
