export interface NodeStatus {
  name: string;
  status: 'online' | 'degraded' | 'offline' | 'ready';
  host: string;
  latency_ms?: number | null;
  details?: string | null;
  model?: string | null;
  is_active: boolean;
  capabilities?: string[];
}

export interface SystemNodesResponse {
  engine: NodeStatus;
  ollama: NodeStatus;
  merchant_server: NodeStatus;
  docling: NodeStatus;
  classifier: NodeStatus;
  timestamp: number;
  overall_health: 'healthy' | 'degraded' | 'critical';
}

export interface ConnectionTestRequest {
  component: 'engine' | 'ollama' | 'merchant';
  url: string;
  api_key?: string;
}

export interface ConnectionTestResponse {
  success: boolean;
  component: string;
  url: string;
  latency_ms: number;
  details: string;
}

export interface SystemSettings {
  // Engine Node & Offload
  engineMode: 'local' | 'remote';
  engineUrl: string;
  remoteEngineOffload: boolean;

  // Ollama LLM Inference Link
  ollamaUrl: string;
  ollamaModel: string;
  ollamaKeepAlive: string;
  useGpuAcceleration: boolean;

  // Merchant Server Link
  merchantServerUrl: string;
  merchantApiKey: string;

  // Enrichment Tiers
  enableVectorSimilarity: boolean;
  vectorThreshold: number;
  enableLlmDisambiguation: boolean;
  enableWebSearchVerification: boolean;

  // Privacy & Retention
  encryptAtRest: boolean;
  retentionDays: number;
  zeroCloudLeakage: boolean;

  // Parsing Engine
  extractionPrecision: 'high_precision' | 'fast';
  maxConcurrentPages: number;

  // Telemetry & UI
  streamNarrationTicker: boolean;
}

export const DEFAULT_SETTINGS: SystemSettings = {
  engineMode: 'local',
  engineUrl: 'http://localhost:8000/api/v1',
  remoteEngineOffload: false,

  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'payee-lora:latest',
  ollamaKeepAlive: '30m',
  useGpuAcceleration: true,

  merchantServerUrl: 'http://localhost:8001',
  merchantApiKey: '',

  enableVectorSimilarity: true,
  vectorThreshold: 0.75,
  enableLlmDisambiguation: true,
  enableWebSearchVerification: false,

  encryptAtRest: true,
  retentionDays: 30,
  zeroCloudLeakage: true,

  extractionPrecision: 'high_precision',
  maxConcurrentPages: 4,

  streamNarrationTicker: true,
};
