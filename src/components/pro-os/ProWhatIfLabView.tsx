import { useState } from 'react';
import { ProCard } from './shared/ProCard';
import { ProMetric } from './shared/ProMetric';
import { ProBadge } from './shared/ProBadge';

interface CounterfactualScenarioResult {
  scenarioId: string;
  component: string;
  changeName: string;
  originalText: string;
  newText: string;
  predictedLiftPct: number;
  newOverallScore: number;
  confidenceBand: string;
  isValidated: boolean;
  reasoning: string;
}

export const ProWhatIfLabView: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<'hook' | 'thumbnail' | 'caption' | 'pacing' | 'audio'>('hook');
  const [isSimulating, setIsSimulating] = useState(false);

  const [scenarios, setScenarios] = useState<CounterfactualScenarioResult[]>([
    {
      scenarioId: 'sc-1',
      component: 'hook',
      changeName: 'Question-Based Pattern Interrupt Hook',
      originalText: 'Stop wasting time on manual outreach! If your content keeps dying at 200 views...',
      newText: 'Why do 90% of AI startups fail at 200 views? Here is the 1-second hook fix!',
      predictedLiftPct: 14.8,
      newOverallScore: 92,
      confidenceBand: '95% CI (12.2% – 17.4%)',
      isValidated: true,
      reasoning: 'Trimming first 2.0s and introducing an explicit counter-intuitive question increases 0-3s scroll-stop probability from 68% to 84%.'
    },
    {
      scenarioId: 'sc-2',
      component: 'caption',
      changeName: 'Explicit Save & Bookmark Trigger CTA',
      originalText: 'Scaling software startups is hard. Here is how top founders optimize organic distribution.',
      newText: 'Save this post right now for your next video campaign launch strategy! 📌',
      predictedLiftPct: 8.2,
      newOverallScore: 89,
      confidenceBand: '95% CI (6.1% – 10.4%)',
      isValidated: true,
      reasoning: 'Adding an explicit call-to-action ("Save this for your next post!") increases estimated save rate by +24%.'
    }
  ]);

  const handleTestCandidateEdit = async () => {
    setIsSimulating(true);

    try {
      const res = await fetch('/api/v2/simulations/counterfactual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseScore: 86,
          component: selectedComponent,
          changeName: `Candidate ${selectedComponent.toUpperCase()} Optimization`,
          originalText: 'Original post formulation...',
          newText: `Optimized ${selectedComponent} formulation variant...`
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        setScenarios(prev => [json.data, ...prev]);
      }
    } catch (e) {
      console.error('[WHAT IF LAB] Counterfactual error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      {/* Header */}
      <div
        className="pro-glass-card pro-glow-card"
        style={{
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', border: '1px solid rgba(241, 58, 30, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🧪 COUNTERFACTUAL WHAT-IF LAB
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Engine Mode: <strong style={{ color: '#4ADE80' }}>PARTIAL RE-SIMULATION ACTIVE</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            What-If Counterfactual Lab & Candidate Edit Prototyper
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Test proposed edits (hooks, captions, thumbnails, pacing) and re-simulate affected specialist agents to validate predicted lift guarantees before publishing.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleTestCandidateEdit}
          disabled={isSimulating}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#F13A1E',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(241, 58, 30, 0.3)'
          }}
        >
          {isSimulating ? 'RE-SIMULATING EDIT...' : `⚡ TEST ${selectedComponent.toUpperCase()} EDIT`}
        </button>
      </div>

      {/* Component Selector */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
        {(['hook', 'thumbnail', 'caption', 'pacing', 'audio'] as const).map(comp => (
          <button
            key={comp}
            onClick={() => setSelectedComponent(comp)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedComponent === comp ? 'rgba(241, 58, 30, 0.2)' : 'transparent',
              color: selectedComponent === comp ? '#FFFFFF' : '#94A3B8',
              fontWeight: selectedComponent === comp ? 800 : 600,
              fontSize: '12px',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {comp} Edit
          </button>
        ))}
      </div>

      {/* 3 Overview Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <ProMetric label="Max Validated Lift" value="+14.8%" subtitle="Hook Pattern Interrupt" accentColor="#4ADE80" />
        <ProMetric label="Re-simulation Latency" value="42ms" subtitle="Partial Specialist Fan-Out" accentColor="#38BDF8" />
        <ProMetric label="Falsification Rate" value="100%" subtitle="Unvalidated Edges Rejected" accentColor="#FACC15" />
      </div>

      {/* Scenarios List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {scenarios.map(sc => (
          <ProCard key={sc.scenarioId}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ProBadge status="SUCCESS" label={sc.changeName} />
                <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Component: {sc.component}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>
                  +{sc.predictedLiftPct}% LIFT
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '4px' }}>
                  {sc.confidenceBand}
                </span>
              </div>
            </div>

            {/* Original vs Modified Text Box */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '10px 0' }}>
              <div style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#F13A1E', textTransform: 'uppercase' }}>Original formulation</span>
                <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '4px' }}>{sc.originalText}</div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'rgba(74, 222, 128, 0.08)', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase' }}>Candidate edit formulation</span>
                <div style={{ fontSize: '12.5px', color: '#FFFFFF', marginTop: '4px' }}>{sc.newText}</div>
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
              <strong>AI Specialist Reasoning:</strong> {sc.reasoning}
            </div>
          </ProCard>
        ))}
      </div>
    </div>
  );
};
