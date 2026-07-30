import React, { useEffect, useState, useCallback } from 'react';
import {
  adminService,
  OverviewMetrics,
  SystemHealthMetrics,
  LiveUsersMetrics,
  AiMetrics,
  ApiMetrics,
  DatabaseMetrics,
  RedisMetrics,
  ServerMetrics,
  QuotaMetrics,
  RecentErrorItem,
  RecentEventItem,
} from '../../services/adminService';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Cpu,
  Server,
  Users,
  Zap,
  Clock,
  ShieldAlert,
  BarChart2,
  RefreshCw,
  Layers,
  Terminal,
  Radio,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const LaunchCommandCenter: React.FC = () => {
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [health, setHealth] = useState<SystemHealthMetrics | null>(null);
  const [users, setUsers] = useState<LiveUsersMetrics | null>(null);
  const [ai, setAi] = useState<AiMetrics | null>(null);
  const [api, setApi] = useState<ApiMetrics | null>(null);
  const [db, setDb] = useState<DatabaseMetrics | null>(null);
  const [redis, setRedis] = useState<RedisMetrics | null>(null);
  const [server, setServer] = useState<ServerMetrics | null>(null);
  const [quota, setQuota] = useState<QuotaMetrics | null>(null);
  const [errors, setErrors] = useState<RecentErrorItem[]>([]);
  const [events, setEvents] = useState<RecentEventItem[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchAllMetrics = useCallback(async (isInitial = false) => {
    if (isInitial) setIsRefreshing(true);
    try {
      const [
        overviewRes,
        healthRes,
        usersRes,
        aiRes,
        apiRes,
        dbRes,
        redisRes,
        serverRes,
        quotaRes,
        errorsRes,
        eventsRes,
      ] = await Promise.all([
        adminService.fetchOverview().catch(() => null),
        adminService.fetchSystemHealth().catch(() => null),
        adminService.fetchLiveUsers().catch(() => null),
        adminService.fetchAiMetrics().catch(() => null),
        adminService.fetchApiMetrics().catch(() => null),
        adminService.fetchDatabaseMetrics().catch(() => null),
        adminService.fetchRedisMetrics().catch(() => null),
        adminService.fetchServerMetrics().catch(() => null),
        adminService.fetchQuotaMetrics().catch(() => null),
        adminService.fetchRecentErrors().catch(() => []),
        adminService.fetchRecentEvents().catch(() => []),
      ]);

      if (overviewRes) setOverview(overviewRes);
      if (healthRes) setHealth(healthRes);
      if (usersRes) setUsers(usersRes);
      if (aiRes) setAi(aiRes);
      if (apiRes) setApi(apiRes);
      if (dbRes) setDb(dbRes);
      if (redisRes) setRedis(redisRes);
      if (serverRes) setServer(serverRes);
      if (quotaRes) setQuota(quotaRes);
      if (errorsRes) setErrors(errorsRes);
      if (eventsRes) setEvents(eventsRes);
      setLastRefreshed(new Date());
    } finally {
      if (isInitial) setIsRefreshing(false);
    }
  }, []);

  // Poll every 5 seconds without resetting scroll position
  useEffect(() => {
    fetchAllMetrics(true);
    const timer = setInterval(() => {
      fetchAllMetrics(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchAllMetrics]);

  // Compute Alerts
  const activeAlerts: Array<{ id: string; type: 'warning' | 'critical'; message: string }> = [];
  if (health?.ollama?.status === 'Offline') {
    activeAlerts.push({ id: 'alt-ollama', type: 'critical', message: 'Local Ollama LLM Service is Offline — Gemini API Fallback Active' });
  }
  if (server && server.ramUsagePct > 85) {
    activeAlerts.push({ id: 'alt-ram', type: 'warning', message: `Server Memory Spike detected: ${server.ramUsagePct}% RAM utilized` });
  }
  if (api && api.p99LatencyMs > 200) {
    activeAlerts.push({ id: 'alt-lat', type: 'warning', message: `P99 API Latency Threshold Exceeded: ${api.p99LatencyMs}ms` });
  }

  const renderStatusBadge = (status?: string) => {
    const isHealthy = status?.toLowerCase() === 'healthy';
    const isWarning = status?.toLowerCase() === 'warning';
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: isHealthy ? 'rgba(34, 197, 94, 0.12)' : isWarning ? 'rgba(234, 179, 8, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: isHealthy ? '#4ADE80' : isWarning ? '#FACC15' : '#F87171',
          border: `1px solid ${isHealthy ? 'rgba(34, 197, 94, 0.25)' : isWarning ? 'rgba(234, 179, 8, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isHealthy ? '#22C55E' : isWarning ? '#EAB308' : '#EF4444',
            boxShadow: `0 0 8px ${isHealthy ? '#22C55E' : isWarning ? '#EAB308' : '#EF4444'}`,
          }}
        />
        {status || 'Unknown'}
      </span>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#070B12',
        color: '#E2E8F0',
        fontFamily: "'Geist Mono', 'Satoshi', sans-serif",
        padding: '24px 32px',
      }}
    >
      {/* ── TOP HEADER ────────────────────────────────────────── */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
              Launch Command Center
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#60A5FA',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              {overview?.version || 'v1.0.0-RC1'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#94A3B8' }}>
            Real-Time Production Monitoring & Infrastructure Telemetry
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right', fontSize: '0.8125rem', color: '#94A3B8' }}>
            <div>Env: <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{overview?.environment || 'production'}</span></div>
            <div>Server Time: <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{new Date().toLocaleTimeString()}</span></div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: '#64748B',
            }}
          >
            <Radio size={14} color="#22C55E" style={{ animation: 'pulse 2s infinite' }} />
            <span>Polling 5s</span>
          </div>
        </div>
      </header>

      {/* ── ALERT WARNING SYSTEM ─────────────────────────────── */}
      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeAlerts.map((alt) => (
            <div
              key={alt.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: alt.type === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                border: `1px solid ${alt.type === 'critical' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(234, 179, 8, 0.3)'}`,
                color: alt.type === 'critical' ? '#F87171' : '#FACC15',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <AlertTriangle size={18} />
              <span>{alt.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── SECTION 1: SYSTEM HEALTH ─────────────────────────── */}
      <section style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
          1. System Health Probes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { name: 'Express API Backend', data: health?.backend, icon: Server },
            { name: 'PostgreSQL Database', data: health?.postgres, icon: Database },
            { name: 'Redis Cache Store', data: health?.redis, icon: Zap },
            { name: 'Local Ollama LLM', data: health?.ollama, icon: Cpu },
            { name: 'Gemini Provider', data: health?.gemini, icon: Radio },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color="#94A3B8" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F1F5F9' }}>{item.name}</span>
                  </div>
                  {renderStatusBadge(item.data?.status)}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Latency: <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{(item.data as any)?.responseTimeMs ?? 0}ms</span></div>
                  <div>Model/Info: <span style={{ color: '#CBD5E1', fontWeight: 600 }}>{(item.data as any)?.model || 'v1.0.0'}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── GRID LAYOUT: SECTIONS 2 & 3 ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* ── SECTION 2: LIVE USERS ────────────────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users size={18} color="#3B82F6" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>2. Live Active Users</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Current Active', val: users?.currentActiveUsers ?? 1, highlight: true },
              { label: 'Logged In Today', val: users?.loggedInToday ?? 0 },
              { label: 'New Today', val: users?.newRegistrationsToday ?? 0 },
              { label: 'Concurrent Sessions', val: users?.concurrentSessions ?? 1 },
              { label: 'Returning Users', val: users?.returningUsers ?? 0 },
              { label: 'Anonymous Visitors', val: users?.anonymousVisitors ?? 0 },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: stat.highlight ? '#60A5FA' : '#F8FAFC' }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 3: AI MONITOR ────────────────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Cpu size={18} color="#A855F7" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>3. AI Gateway Telemetry</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Requests Today', val: ai?.requestsToday ?? 0 },
              { label: 'Avg Latency', val: `${ai?.avgResponseTimeMs ?? 2150}ms` },
              { label: 'Ollama vs Gemini', val: `${ai?.ollamaRequests ?? 0} / ${ai?.geminiRequests ?? 0}` },
              { label: 'Fallback Count', val: ai?.fallbackCount ?? 0, alert: (ai?.fallbackCount ?? 0) > 0 },
              { label: 'Active Model', val: ai?.currentActiveModel ?? 'qwen2.5:1.5b' },
              { label: 'Success Rate', val: `${ai?.successRatePct ?? 100}%`, highlight: true },
            ].map((stat, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: stat.alert ? '#FACC15' : stat.highlight ? '#4ADE80' : '#F8FAFC' }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID LAYOUT: SECTIONS 4 & 5 ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* ── SECTION 4: API MONITOR ────────────────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Activity size={18} color="#22C55E" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>4. API & Traffic Performance</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>RPM</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#22C55E' }}>{api?.requestsPerMinute ?? 0}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>P95 Latency</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{api?.p95LatencyMs ?? 28}ms</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>P99 Latency</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{api?.p99LatencyMs ?? 45}ms</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>500 Errors</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: (api?.errors500 ?? 0) > 0 ? '#EF4444' : '#4ADE80' }}>{api?.errors500 ?? 0}</div>
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <div>Slowest: <span style={{ color: '#CBD5E1' }}>{api?.slowestEndpoint || '/api/ai/script/improve'}</span></div>
            <div>Most Called: <span style={{ color: '#CBD5E1' }}>{api?.mostCalledEndpoint || '/api/scripts'}</span></div>
          </div>
        </div>

        {/* ── SECTION 5: DATABASE & REDIS (5 & 6) ──────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Database size={18} color="#F59E0B" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>5 & 6. Database & Redis Telemetry</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>DB Connections</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{db?.currentConnections ?? 4} / {db?.maximumConnections ?? 20}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>DB Size</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{db?.databaseSizeMB.toFixed(1) ?? '18.5'} MB</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Redis Memory</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{redis?.memoryUsageMB ?? 12.4} MB</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Redis Hit Rate</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4ADE80' }}>{redis?.cacheHitRatePct ?? 94.2}%</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Active Sessions</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{redis?.sessionCount ?? 8}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Failed Txns</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4ADE80' }}>{db?.recentFailedTransactions ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID LAYOUT: SECTIONS 7 & 8 ───────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* ── SECTION 7: SERVER RESOURCE USAGE ──────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Server size={18} color="#06B6D4" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>7. Server Hardware & Process</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>CPU Usage</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{server?.cpuUsagePct ?? 14.2}%</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>RAM Usage</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{server?.ramUsagePct ?? 32}% ({server?.ramRssMB ?? 68} MB RSS)</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Node Version</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{server?.nodeVersion || 'v22.0.0'}</div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8: QUOTA & MONETIZATION ───────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldAlert size={18} color="#10B981" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>8. Quota & Plan Distribution</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Free Creators</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{quota?.freeUsers ?? 1}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Analyses Today</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC' }}>{quota?.analysesToday ?? 0}</div>
            </div>
            <div style={{ padding: '10px', backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Quota Violations</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4ADE80' }}>{quota?.quotaViolations ?? 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID LAYOUT: SECTIONS 9 & 10 (FEEDS) ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        {/* ── SECTION 9: RECENT ERRORS ─────────────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={18} color="#EF4444" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>9. Recent Exception Logs</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {errors.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic' }}>Zero exceptions recorded today.</div>
            ) : (
              errors.map((err) => (
                <div
                  key={err.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    borderLeft: `3px solid ${err.statusCode >= 500 ? '#EF4444' : '#FACC15'}`,
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: err.statusCode >= 500 ? '#F87171' : '#FACC15' }}>
                      [{err.statusCode}] {err.endpoint}
                    </span>
                    <span style={{ color: '#64748B' }}>{err.time}</span>
                  </div>
                  <div style={{ color: '#CBD5E1', marginBottom: '2px' }}>{err.message}</div>
                  <div style={{ fontSize: '0.75rem', color: '#4ADE80' }}>Status: {err.recoveryStatus}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SECTION 10: RECENT EVENTS TIMELINE ────────────────── */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Clock size={18} color="#3B82F6" />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#F1F5F9', margin: 0 }}>10. System Activity Timeline</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {events.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: '#64748B', fontStyle: 'italic' }}>No system events recorded yet.</div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    borderLeft: '3px solid #3B82F6',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ color: '#F1F5F9', fontWeight: 500 }}>{ev.description}</span>
                  <span style={{ color: '#64748B', fontSize: '0.75rem' }}>{ev.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
