export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export type StylePreset =
  | 'professional'
  | 'casual'
  | 'fantasy'
  | 'cyberpunk'
  | 'watercolor'
  | 'anime'
  | 'oil-painting';

export interface SelfieJob {
  jobId: string;
  status: JobStatus;
  originalFile: string;
  currentFile: string;
  resultFile?: string;
  mimeType: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StylePresetConfig {
  id: StylePreset;
  label: string;
  description: string;
  icon: string;
  prompt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResult {
  jobId: string;
}

export interface StatusResult {
  jobId: string;
  status: JobStatus;
  resultUrl?: string;
  error?: string;
}
