export type Language = 'en' | 'zh';
export type Theme = 'light' | 'dark';

export interface PantoneStyle {
  id: string;
  name: string;
  code: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  card: string;
  border: string;
}

export type ArtifactType = 'input' | 'summary' | 'report' | 'skill';

export interface Artifact {
  id: string;
  title: string;
  content: string;
  type: ArtifactType;
  timestamp: number;
  model: string;
  version: number;
}

export interface LogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface Telemetry {
  activeJobs: number;
  tokenUsage: number;
  avgLatency: number;
  providerHealth: 'healthy' | 'degraded' | 'offline';
}
