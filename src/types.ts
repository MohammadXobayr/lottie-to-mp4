export interface LottieAnimationData {
  v?: string;
  fr?: number;
  ip?: number;
  op?: number;
  w?: number;
  h?: number;
  nm?: string;
  assets?: unknown[];
  layers?: unknown[];
  [key: string]: unknown;
}

export type ResolutionPresetId = 'original' | '720p' | '1080p' | '4k' | 'square' | 'portrait' | 'social';

export interface ResolutionOption {
  id: ResolutionPresetId;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ConversionSettings {
  resolutionId: ResolutionPresetId;
  customWidth: number;
  customHeight: number;
  fps: number; // 24, 30, 60
  bgColor: string; // hex string, e.g. '#ffffff' or 'transparent'
  loops: number; // 1, 2, 3, etc.
  bitrateKbps: number; // e.g. 8000
  quality: 'standard' | 'high' | 'ultra';
}

export interface AnimationInfo {
  fileName: string;
  fileSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFps: number;
  totalFrames: number;
  durationSeconds: number;
  data: LottieAnimationData;
}

export type ConversionStatus = 'idle' | 'rendering' | 'completed' | 'error';

export interface ConversionProgressData {
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  elapsedMs: number;
  estimatedRemainingMs: number;
  previewCanvasDataUrl?: string;
}

export interface SampleAnimation {
  id: string;
  name: string;
  description: string;
  category: string;
  data: LottieAnimationData;
}
