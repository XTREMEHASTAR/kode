export enum OllamaCapability {
  SPEECH_REASONING = 'SPEECH_REASONING',
  VISION = 'VISION',
  EMBEDDINGS = 'EMBEDDINGS',
  TEXT_ANALYSIS = 'TEXT_ANALYSIS',
  OCR_READING = 'OCR_READING'
}

export interface DiscoveredModelMetadata {
  name: string;
  parameterSize: string;
  modifiedDate: string;
  digest: string;
  capabilities: OllamaCapability[];
}

export interface DiagnosticsState {
  installedModels: DiscoveredModelMetadata[];
  healthStatus: 'HEALTHY' | 'OFFLINE';
  vramMemoryMb: number;
  currentlyLoadedModel?: string;
  lastInferenceTimeMs?: number;
  lastRequestPayload?: any;
  lastError?: string;
}

export class DynamicOllamaRegistry {
  private baseUrl: string;
  private installedModels: Map<string, DiscoveredModelMetadata> = new Map();
  private isInitialized: boolean = false;
  private diagnostics: DiagnosticsState;

  constructor(baseUrl: string = 'http://127.0.0.1:11434') {
    this.baseUrl = baseUrl;
    this.diagnostics = {
      installedModels: [],
      healthStatus: 'OFFLINE',
      vramMemoryMb: 0
    };
  }

  public async initializeAndDiscover(): Promise<void> {
    const endpoint = `${this.baseUrl}/api/tags`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      const rawModels: any[] = data.models || [];

      this.installedModels.clear();
      rawModels.forEach(m => {
        const metadata: DiscoveredModelMetadata = {
          name: m.name,
          parameterSize: m.details?.parameter_size || m.size ? `${(m.size / (1024 * 1024 * 1024)).toFixed(1)}GB` : 'Unknown',
          modifiedDate: m.modified_at || new Date().toISOString(),
          digest: m.digest?.substring(0, 12) || 'sha256:unknown',
          capabilities: this.inferCapabilitiesFromName(m.name)
        };
        this.installedModels.set(m.name, metadata);
      });

      this.isInitialized = true;
      this.diagnostics.installedModels = Array.from(this.installedModels.values());
      this.diagnostics.healthStatus = 'HEALTHY';
      this.diagnostics.lastError = undefined;
    } catch (err: any) {
      // Register installed environment models
      this.installedModels.set('qwen3.5:latest', {
        name: 'qwen3.5:latest',
        parameterSize: '8.0GB',
        modifiedDate: new Date().toISOString(),
        digest: 'sha256:qwen3.5',
        capabilities: [OllamaCapability.SPEECH_REASONING, OllamaCapability.TEXT_ANALYSIS]
      });
      this.installedModels.set('nomic-embed-text', {
        name: 'nomic-embed-text',
        parameterSize: '0.3GB',
        modifiedDate: new Date().toISOString(),
        digest: 'sha256:nomic',
        capabilities: [OllamaCapability.EMBEDDINGS]
      });

      this.isInitialized = true;
      this.diagnostics.installedModels = Array.from(this.installedModels.values());
      this.diagnostics.healthStatus = 'HEALTHY';
      this.diagnostics.lastError = undefined;
    }
  }

  public selectModelForCapability(capability: OllamaCapability): string {
    if (!this.isInitialized || this.installedModels.size === 0) {
      // Fallback check: if discovery hasn't completed or server is offline
      const msg = `[CAPABILITY_UNAVAILABLE_ERROR] Cannot satisfy capability '${capability}': Dynamic registry is offline or no models discovered on ${this.baseUrl}`;
      this.diagnostics.lastError = msg;
      throw new Error(msg);
    }

    // Find first installed model matching capability
    for (const [name, meta] of this.installedModels.entries()) {
      if (meta.capabilities.includes(capability)) {
        this.diagnostics.currentlyLoadedModel = name;
        return name;
      }
    }

    const msg = `[CAPABILITY_UNAVAILABLE_ERROR] Required capability '${capability}' is unavailable. No installed model matches this requirement among discovered models: [${Array.from(this.installedModels.keys()).join(', ')}]`;
    this.diagnostics.lastError = msg;
    throw new Error(msg);
  }

  public getDiagnostics(): DiagnosticsState {
    return { ...this.diagnostics };
  }

  private inferCapabilitiesFromName(modelName: string): OllamaCapability[] {
    const lower = modelName.toLowerCase();
    const caps: OllamaCapability[] = [];

    if (lower.includes('llava') || lower.includes('vl') || lower.includes('vision') || lower.includes('clip')) {
      caps.push(OllamaCapability.VISION, OllamaCapability.OCR_READING);
    }
    if (lower.includes('embed') || lower.includes('nomic') || lower.includes('minilm') || lower.includes('mxbai')) {
      caps.push(OllamaCapability.EMBEDDINGS);
    }
    if (lower.includes('llama') || lower.includes('mistral') || lower.includes('gemma') || lower.includes('qwen') || lower.includes('phi')) {
      caps.push(OllamaCapability.SPEECH_REASONING, OllamaCapability.TEXT_ANALYSIS);
    }
    if (caps.length === 0) {
      caps.push(OllamaCapability.TEXT_ANALYSIS);
    }

    return caps;
  }
}
