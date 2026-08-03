import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  GitPullRequest, 
  ShieldAlert, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  BarChart, 
  Clock, 
  DollarSign, 
  Award,
  RefreshCw,
  Server
} from 'lucide-react';

export interface ModelData {
  id: string;
  modelName: string;
  provider: 'openai' | 'claude' | 'gemini' | 'whisper' | 'local' | 'fine-tuned';
  capabilities: string[];
  avgLatencyMs: number;
  costPer1kTokens: number;
  version: string;
  fallbackModelId?: string;
  qualityScore: number;
  isActive: boolean;
}

export interface PolicyData {
  capability: string;
  routingStrategy: 'direct' | 'ab_test' | 'canary' | 'fallback_chain';
  primaryModelId: string;
  secondaryModelId?: string;
  trafficSplitPct: number;
}

interface ModelRegistryViewProps {
  models?: ModelData[];
  policies?: PolicyData[];
}

export const ModelRegistryView: React.FC<ModelRegistryViewProps> = ({ models, policies }) => {
  const defaultModels: ModelData[] = [
    {
      id: 'gemini-2-flash',
      modelName: 'Gemini 2.0 Flash',
      provider: 'gemini',
      capabilities: ['text-generation', 'vision', 'embedding'],
      avgLatencyMs: 180,
      costPer1kTokens: 0.0005,
      version: 'v2.0-flash',
      fallbackModelId: 'gpt-4o-mini',
      qualityScore: 92.5,
      isActive: true
    },
    {
      id: 'claude-3-5-sonnet',
      modelName: 'Claude 3.5 Sonnet',
      provider: 'claude',
      capabilities: ['text-generation', 'vision'],
      avgLatencyMs: 240,
      costPer1kTokens: 0.003,
      version: 'v3.5-sonnet',
      fallbackModelId: 'gemini-2-flash',
      qualityScore: 96.0,
      isActive: true
    },
    {
      id: 'gpt-4o',
      modelName: 'OpenAI GPT-4o',
      provider: 'openai',
      capabilities: ['text-generation', 'vision'],
      avgLatencyMs: 220,
      costPer1kTokens: 0.0025,
      version: 'v4o-2024-08-06',
      fallbackModelId: 'gemini-2-flash',
      qualityScore: 95.0,
      isActive: true
    },
    {
      id: 'whisper-v3',
      modelName: 'OpenAI Whisper Large v3',
      provider: 'whisper',
      capabilities: ['audio-transcription'],
      avgLatencyMs: 350,
      costPer1kTokens: 0.006,
      version: 'v3-large',
      fallbackModelId: 'whisper-local',
      qualityScore: 94.0,
      isActive: true
    }
  ];

  const defaultPolicies: PolicyData[] = [
    { capability: 'text-generation', routingStrategy: 'ab_test', primaryModelId: 'gemini-2-flash', secondaryModelId: 'claude-3-5-sonnet', trafficSplitPct: 50.0 },
    { capability: 'vision', routingStrategy: 'direct', primaryModelId: 'claude-3-5-sonnet', trafficSplitPct: 100.0 },
    { capability: 'audio-transcription', routingStrategy: 'direct', primaryModelId: 'whisper-v3', trafficSplitPct: 100.0 }
  ];

  const activeModels = models || defaultModels;
  const activePolicies = policies || defaultPolicies;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Unified Model Registry & Dynamic Routing Engine
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <RefreshCw className="w-3 h-3" /> Runtime Swappable
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Abstract all AI models (Gemini, Claude, OpenAI, Whisper, Local) with dynamic A/B testing & Canary deployments.
            </p>
          </div>
        </div>

        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 shrink-0">
          <Server className="w-4 h-4" />
          <span>Register New Model</span>
        </button>
      </div>

      {/* Dynamic Routing Policies */}
      <div className="mt-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <GitPullRequest className="w-4 h-4 text-sky-400" />
          Active Capability Routing Policies (A/B & Canary)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePolicies.map((pol) => (
            <div key={pol.capability} className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">{pol.capability}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/30 rounded">
                  {pol.routingStrategy.toUpperCase()}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Primary Model:</span>
                  <span className="font-mono font-bold text-white">{pol.primaryModelId}</span>
                </div>
                {pol.secondaryModelId && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Secondary / Canary:</span>
                    <span className="font-mono font-bold text-purple-300">{pol.secondaryModelId}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Traffic Split:</span>
                  <span className="font-mono font-bold text-emerald-400">{pol.trafficSplitPct}% / {100 - pol.trafficSplitPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registered Model Inventory Table */}
      <div className="mt-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Registered AI Model Inventory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Model Surface</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Avg Latency</th>
                <th className="py-3 px-4">Cost / 1k Tokens</th>
                <th className="py-3 px-4">Quality Score</th>
                <th className="py-3 px-4">Fallback Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeModels.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{m.modelName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded uppercase">
                      {m.provider}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">{m.version}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{m.avgLatencyMs} ms</td>
                  <td className="py-3 px-4 font-mono text-amber-400">${m.costPer1kTokens}</td>
                  <td className="py-3 px-4 font-mono text-indigo-300 font-bold">{m.qualityScore}/100</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{m.fallbackModelId || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
