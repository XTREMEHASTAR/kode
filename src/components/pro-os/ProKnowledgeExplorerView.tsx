import React, { useState } from 'react';
import { ProCard } from './shared/ProCard';
import { ProMetric } from './shared/ProMetric';
import { ProBadge } from './shared/ProBadge';

export const ProKnowledgeExplorerView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const graphNodes = [
    { id: 'node-1', type: 'content_feature', label: 'Question-Based Hook framing (<2.5s)', category: 'Hook Velocity', sampleSize: 1420 },
    { id: 'node-2', type: 'segment', label: 'US 18–24 Tech & Startup Creators', category: 'Demographic Cluster', sampleSize: 8500 },
    { id: 'node-3', type: 'outcome', label: '+0.68σ Save Rate Lift', category: 'Algorithmic Boost', sampleSize: 1420 },
    { id: 'node-4', type: 'content_feature', label: 'Numeric Pricing Anchor (₹499 / $49)', category: 'Trust & Fact', sampleSize: 920 },
    { id: 'node-5', type: 'outcome', label: '+0.54σ Comment Depth Increase', category: 'Engagement', sampleSize: 920 }
  ];

  const graphEdges = [
    { from: 'Question-Based Hook framing (<2.5s)', to: '+0.68σ Save Rate Lift', relation: 'improved_by', confidence: '94%', weight: '1.45x' },
    { from: 'Numeric Pricing Anchor (₹499 / $49)', to: '+0.54σ Comment Depth Increase', relation: 'influences', confidence: '91%', weight: '1.28x' }
  ];

  const filteredNodes = graphNodes.filter(n =>
    n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🌐 CREATIVE KNOWLEDGE GRAPH EXPLORER (CKG)
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Nodes Persisted: <strong style={{ color: '#4ADE80' }}>14,280 PRECEDENT PATTERNS</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Creative Knowledge Graph & Precedent Query Engine
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Query persistent semantic rules and typed relationship edges extracted from thousands of evaluated video campaigns.
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Knowledge Graph (e.g. hook, pricing, retention)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#FFFFFF',
            fontSize: '13px',
            width: '320px'
          }}
        />
      </div>

      {/* 3 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <ProMetric label="Graph Nodes Persisted" value="14,280" subtitle="Content Features & Outcomes" accentColor="#38BDF8" />
        <ProMetric label="Typed Relationship Edges" value="38,420" subtitle="Verified Causal Edges" accentColor="#4ADE80" />
        <ProMetric label="Pattern Mining Accuracy" value="94.2%" subtitle="Statistical Significance Gated" accentColor="#FACC15" />
      </div>

      {/* Nodes & Edges Inspection Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Nodes */}
        <ProCard>
          <ProBadge status="SUCCESS" label="GRAPH ENTITY NODES" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '8px 0 16px 0', color: '#FFFFFF' }}>
            Persistent Knowledge Nodes ({filteredNodes.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredNodes.map(node => (
              <div key={node.id} style={{ padding: '12px 16px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{node.label}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{node.category} • Sample Size: {node.sampleSize} jobs</div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {node.type}
                </span>
              </div>
            ))}
          </div>
        </ProCard>

        {/* Typed Edges */}
        <ProCard>
          <ProBadge status="RUNNING" label="TYPED CAUSAL EDGES" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '8px 0 16px 0', color: '#FFFFFF' }}>
            Precedent Rule Edges
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {graphEdges.map((edge, idx) => (
              <div key={idx} style={{ padding: '14px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#4ADE80' }}>
                  {edge.from}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#F13A1E', fontWeight: 800, textTransform: 'uppercase' }}>─── {edge.relation} ───►</span>
                  <span>Confidence: <strong style={{ color: '#FFFFFF' }}>{edge.confidence}</strong></span>
                  <span>• Weight: <strong style={{ color: '#FFFFFF' }}>{edge.weight}</strong></span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#38BDF8' }}>
                  {edge.to}
                </div>
              </div>
            ))}
          </div>
        </ProCard>
      </div>
    </div>
  );
};
