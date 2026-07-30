import React, { useState } from 'react';
import { ProCard } from './shared/ProCard';
import { ProBadge } from './shared/ProBadge';
import { UploadPipelineTraceReport } from '../../engine/telemetry/UploadTraceReportGenerator';

interface ProUploadTraceDebugViewProps {
  traceReport: UploadPipelineTraceReport;
}

export const ProUploadTraceDebugView: React.FC<ProUploadTraceDebugViewProps> = ({ traceReport }) => {
  const [activeSection, setActiveSection] = useState<'RAW' | 'DNA' | 'VECTOR' | 'MATH' | 'PREDICTION'>('RAW');

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(traceReport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraCore_Upload_Trace_${traceReport.assetId}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Pipeline Diagnostic Trace Report Inspector
            </h2>
            <ProBadge status="SUCCESS" label="TRACE LOGGED" />
          </div>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            Trace ID: {traceReport.traceId} • Asset: {traceReport.assetId}
          </span>
        </div>

        <button
          onClick={handleDownloadJson}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#38BDF8',
            border: 'none',
            color: '#0F172A',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          Download Trace JSON
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
        {(['RAW', 'DNA', 'VECTOR', 'MATH', 'PREDICTION'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              backgroundColor: activeSection === tab ? 'rgba(241, 58, 30, 0.15)' : 'transparent',
              border: activeSection === tab ? '1px solid #F13A1E' : '1px solid transparent',
              color: activeSection === tab ? '#F13A1E' : '#94A3B8',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {tab === 'RAW' ? '1. Raw Model Outputs' : tab === 'DNA' ? '2. Fused Content DNA' : tab === 'VECTOR' ? '3. Exact 1024D Feature Vector' : tab === 'MATH' ? '4. Intermediate Calculations' : '5. Final Prediction'}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      {activeSection === 'RAW' && (
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>1. Raw Multimodal Model Outputs</h3>
          <pre style={{ backgroundColor: '#090D16', padding: '16px', borderRadius: '8px', color: '#38BDF8', fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(traceReport.rawModelOutputs, null, 2)}
          </pre>
        </ProCard>
      )}

      {activeSection === 'DNA' && (
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>2. Fused Content DNA Payload</h3>
          <pre style={{ backgroundColor: '#090D16', padding: '16px', borderRadius: '8px', color: '#4ADE80', fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(traceReport.fusedContentDna, null, 2)}
          </pre>
        </ProCard>
      )}

      {activeSection === 'VECTOR' && (
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>3. Exact 1024D Feature Vector Sent to Prediction Model</h3>
          <p style={{ fontSize: '12px', color: '#94A3B8' }}>Unaltered floating point array passed into 11-model prediction suite.</p>
          <pre style={{ backgroundColor: '#090D16', padding: '16px', borderRadius: '8px', color: '#FACC15', fontSize: '11px', maxHeight: '300px', overflowY: 'auto' }}>
            {JSON.stringify(traceReport.exactPredictionFeatureVector, null, 2)}
          </pre>
        </ProCard>
      )}

      {activeSection === 'MATH' && (
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>4. Intermediate Prediction Model Calculations</h3>
          <pre style={{ backgroundColor: '#090D16', padding: '16px', borderRadius: '8px', color: '#FFFFFF', fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(traceReport.predictionIntermediateCalculations, null, 2)}
          </pre>
        </ProCard>
      )}

      {activeSection === 'PREDICTION' && (
        <ProCard style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: 0 }}>5. Final Prediction with Explanations</h3>
          <pre style={{ backgroundColor: '#090D16', padding: '16px', borderRadius: '8px', color: '#38BDF8', fontSize: '12px', overflowX: 'auto' }}>
            {JSON.stringify(traceReport.finalPrediction, null, 2)}
          </pre>
        </ProCard>
      )}
    </div>
  );
};
