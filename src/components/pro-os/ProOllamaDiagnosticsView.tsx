import React, { useState, useEffect } from 'react';
import { ProCard } from './shared/ProCard';
import { ProBadge } from './shared/ProBadge';
import { DynamicOllamaRegistry, DiagnosticsState } from '../../engine/registry/DynamicOllamaRegistry';

interface ProOllamaDiagnosticsViewProps {
  registry?: DynamicOllamaRegistry;
}

export const ProOllamaDiagnosticsView: React.FC<ProOllamaDiagnosticsViewProps> = ({ registry }) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    installedModels: [],
    healthStatus: 'OFFLINE',
    vramMemoryMb: 0
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDiagnostics = async () => {
    setIsRefreshing(true);
    const reg = registry || new DynamicOllamaRegistry('http://127.0.0.1:11434');
    await reg.initializeAndDiscover();
    setDiagnostics(reg.getDiagnostics());
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Local Ollama Model Discovery & System Diagnostics
            </h2>
            <ProBadge
              status={diagnostics.healthStatus === 'HEALTHY' ? 'SUCCESS' : 'WARNING'}
              label={diagnostics.healthStatus === 'HEALTHY' ? 'OLLAMA ONLINE (127.0.0.1:11434)' : 'OLLAMA DISCONNECTED'}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            Startup Endpoint: GET http://127.0.0.1:11434/api/tags • Capability-based Router Active
          </span>
        </div>

        <button
          onClick={fetchDiagnostics}
          disabled={isRefreshing}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#38BDF8',
            border: 'none',
            color: '#0F172A',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            opacity: isRefreshing ? 0.6 : 1.0
          }}
        >
          {isRefreshing ? 'Discovering Models...' : 'Refresh GET /api/tags'}
        </button>
      </div>

      {/* Diagnostics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>DISCOVERED MODELS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', marginTop: '6px' }}>
            {diagnostics.installedModels.length}
          </div>
        </ProCard>

        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>CURRENTLY LOADED</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ADE80', marginTop: '10px', wordBreak: 'break-all' }}>
            {diagnostics.currentlyLoadedModel || 'None (Idle)'}
          </div>
        </ProCard>

        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>LAST INFERENCE TIME</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', marginTop: '6px' }}>
            {diagnostics.lastInferenceTimeMs ? `${diagnostics.lastInferenceTimeMs} ms` : 'N/A'}
          </div>
        </ProCard>

        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>SYSTEM HEALTH</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: diagnostics.healthStatus === 'HEALTHY' ? '#4ADE80' : '#EF4444', marginTop: '10px' }}>
            {diagnostics.healthStatus}
          </div>
        </ProCard>
      </div>

      {/* Installed Models Table */}
      <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>
          Installed Models Registry (`GET /api/tags`)
        </h3>

        {diagnostics.installedModels.length === 0 ? (
          <div style={{ padding: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid #EF4444', color: '#FCA5A5', fontSize: '13px' }}>
            {diagnostics.lastError || 'No models discovered on local Ollama server (http://127.0.0.1:11434). Ensure Ollama is running and models are pulled.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#FFFFFF', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left', color: '#94A3B8' }}>
                  <th style={{ padding: '10px' }}>Model Name</th>
                  <th style={{ padding: '10px' }}>Parameter Size</th>
                  <th style={{ padding: '10px' }}>Modified Date</th>
                  <th style={{ padding: '10px' }}>Digest</th>
                  <th style={{ padding: '10px' }}>Mapped Capabilities</th>
                </tr>
              </thead>
              <tbody>
                {diagnostics.installedModels.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '10px', fontWeight: 800, color: '#38BDF8' }}>{m.name}</td>
                    <td style={{ padding: '10px' }}>{m.parameterSize}</td>
                    <td style={{ padding: '10px', color: '#94A3B8' }}>{new Date(m.modifiedDate).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', fontFamily: 'monospace', color: '#A855F7' }}>{m.digest}</td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {m.capabilities.map((c, cIdx) => (
                          <span key={cIdx} style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ProCard>
    </div>
  );
};
