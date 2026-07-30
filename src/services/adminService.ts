import { authService } from './authService';

// ──────────────────────────────────────────────
// Admin API Service — Launch Command Center
// ──────────────────────────────────────────────

const API_BASE = '/api/admin';

function getAuthHeaders(): HeadersInit {
  const session = authService.getCurrentSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (session?.token && session.token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }
  return headers;
}

export interface OverviewMetrics {
  title: string;
  subtitle: string;
  version: string;
  environment: string;
  serverTime: string;
  uptimeSeconds: number;
  lastDeployment: string;
  totalActiveUsers: number;
  overallStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface SystemHealthMetrics {
  backend: { status: string; responseTimeMs: number; uptimeSeconds: number; lastCheck: string };
  postgres: { status: string; responseTimeMs: number; uptimeSeconds: number; lastCheck: string };
  redis: { status: string; responseTimeMs: number; uptimeSeconds: number; lastCheck: string };
  ollama: { status: string; responseTimeMs: number; model: string; lastCheck: string };
  gemini: { status: string; model: string; lastCheck: string };
}

export interface LiveUsersMetrics {
  currentActiveUsers: number;
  loggedInToday: number;
  newRegistrationsToday: number;
  concurrentSessions: number;
  returningUsers: number;
  anonymousVisitors: number;
}

export interface AiMetrics {
  requestsToday: number;
  currentQueue: number;
  avgResponseTimeMs: number;
  fastestResponseMs: number;
  slowestResponseMs: number;
  ollamaRequests: number;
  geminiRequests: number;
  fallbackCount: number;
  currentActiveModel: string;
  modelMemoryUsageMB: number;
  modelContextLength: number;
  tokensGeneratedToday: number;
  avgTokensPerRequest: number;
  successRatePct: number;
  failureRatePct: number;
}

export interface ApiMetrics {
  requestsPerMinute: number;
  totalRequestsToday: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errors500: number;
  errors404: number;
  errors401: number;
  errors429: number;
  topEndpoints: Array<{ endpoint: string; count: number; avgMs: number }>;
  slowestEndpoint: string;
  mostCalledEndpoint: string;
}

export interface DatabaseMetrics {
  currentConnections: number;
  maximumConnections: number;
  avgQueryTimeMs: number;
  slowQueries: number;
  databaseSizeMB: number;
  transactionsPerMinute: number;
  recentFailedTransactions: number;
}

export interface RedisMetrics {
  memoryUsageMB: number;
  connectedClients: number;
  cacheHitRatePct: number;
  cacheMissRatePct: number;
  sessionCount: number;
  evictions: number;
}

export interface ServerMetrics {
  cpuUsagePct: number;
  ramUsagePct: number;
  ramRssMB: number;
  diskUsagePct: number;
  networkThroughputKBps: number;
  nodeVersion: string;
  serverRestartCount: number;
  processUptimeSeconds: number;
}

export interface QuotaMetrics {
  freeUsers: number;
  proUsers: number;
  enterpriseUsers: number;
  analysesToday: number;
  remainingDailyQuota: number;
  quotaViolations: number;
  mostActiveUser: string;
}

export interface RecentErrorItem {
  id: string;
  time: string;
  endpoint: string;
  statusCode: number;
  userId: string;
  message: string;
  recoveryStatus: string;
}

export interface RecentEventItem {
  id: string;
  timestamp: string;
  type: string;
  description: string;
}

export const adminService = {
  async fetchOverview(): Promise<OverviewMetrics> {
    const res = await fetch(`${API_BASE}/overview`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchSystemHealth(): Promise<SystemHealthMetrics> {
    const res = await fetch(`${API_BASE}/system`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchLiveUsers(): Promise<LiveUsersMetrics> {
    const res = await fetch(`${API_BASE}/users`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchAiMetrics(): Promise<AiMetrics> {
    const res = await fetch(`${API_BASE}/ai`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchApiMetrics(): Promise<ApiMetrics> {
    const res = await fetch(`${API_BASE}/api`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchDatabaseMetrics(): Promise<DatabaseMetrics> {
    const res = await fetch(`${API_BASE}/database`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchRedisMetrics(): Promise<RedisMetrics> {
    const res = await fetch(`${API_BASE}/redis`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchServerMetrics(): Promise<ServerMetrics> {
    const res = await fetch(`${API_BASE}/server`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchQuotaMetrics(): Promise<QuotaMetrics> {
    const res = await fetch(`${API_BASE}/quota`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchRecentErrors(): Promise<RecentErrorItem[]> {
    const res = await fetch(`${API_BASE}/errors`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },

  async fetchRecentEvents(): Promise<RecentEventItem[]> {
    const res = await fetch(`${API_BASE}/events`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return body.data;
  },
};
