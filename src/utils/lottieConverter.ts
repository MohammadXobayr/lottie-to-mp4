import lottie, { AnimationItem } from 'lottie-web';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';
import { ConversionProgressData, ConversionSettings, LottieAnimationData, ResolutionOption, ResolutionPresetId } from '../types';

export const RESOLUTION_PRESETS: ResolutionOption[] = [
  { id: 'original', label: 'Original Size', width: 0, height: 0, aspectRatio: 'Auto' },
  { id: '1080p', label: '1080p HD (1920×1080)', width: 1920, height: 1080, aspectRatio: '16:9' },
  { id: '720p', label: '720p HD (1280×720)', width: 1280, height: 720, aspectRatio: '16:9' },
  { id: '4k', label: '4K Ultra HD (3840×2160)', width: 3840, height: 2160, aspectRatio: '16:9' },
  { id: 'square', label: 'Square (1080×1080)', width: 1080, height: 1080, aspectRatio: '1:1' },
  { id: 'portrait', label: 'Vertical / Story (1080×1920)', width: 1080, height: 1920, aspectRatio: '9:16' },
  { id: 'social', label: 'Social Post (1080×1350)', width: 1080, height: 1350, aspectRatio: '4:5' }
];

export function getTargetDimensions(
  resolutionId: ResolutionPresetId,
  origW: number,
  origH: number,
  customW?: number,
  customH?: number
): { width: number; height: number } {
  let w = origW || 512;
  let h = origH || 512;

  if (resolutionId === 'original') {
    w = origW || 512;
    h = origH || 512;
  } else if (resolutionId === '720p') {
    w = 1280;
    h = 720;
  } else if (resolutionId === '1080p') {
    w = 1920;
    h = 1080;
  } else if (resolutionId === '4k') {
    w = 3840;
    h = 2160;
  } else if (resolutionId === 'square') {
    w = 1080;
    h = 1080;
  } else if (resolutionId === 'portrait') {
    w = 1080;
    h = 1920;
  } else if (resolutionId === 'social') {
    w = 1080;
    h = 1350;
  } else if (customW && customH) {
    w = customW;
    h = customH;
  }

  // Ensure width and height are even integers for H.264 video encoding compatibility
  w = Math.max(2, Math.round(w));
  h = Math.max(2, Math.round(h));
  if (w % 2 !== 0) w += 1;
  if (h % 2 !== 0) h += 1;

  return { width: w, height: h };
}

export function parseLottieInfo(data: LottieAnimationData, fileName: string = 'animation.json', fileSize: number = 0) {
  const originalWidth = data.w || 512;
  const originalHeight = data.h || 512;
  const originalFps = data.fr || 30;
  const ip = typeof data.ip === 'number' ? data.ip : 0;
  const op = typeof data.op === 'number' ? data.op : 60;
  const totalFrames = Math.max(1, Math.round(op - ip));
  const durationSeconds = totalFrames / originalFps;

  return {
    fileName,
    fileSize,
    originalWidth,
    originalHeight,
    originalFps,
    totalFrames,
    durationSeconds,
    data,
  };
}

export async function convertLottieToMp4(
  animData: LottieAnimationData,
  settings: ConversionSettings,
  onProgress: (progress: ConversionProgressData) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const origW = animData.w || 512;
  const origH = animData.h || 512;
  const sourceFps = animData.fr || 30;
  const ip = typeof animData.ip === 'number' ? animData.ip : 0;
  const op = typeof animData.op === 'number' ? animData.op : 60;
  const animFrameCount = Math.max(1, op - ip);

  const { width: targetWidth, height: targetHeight } = getTargetDimensions(
    settings.resolutionId,
    origW,
    origH,
    settings.customWidth,
    settings.customHeight
  );

  const targetFps = settings.fps || 30;
  const loops = Math.max(1, settings.loops || 1);
  const totalSourceDurationSec = (animFrameCount / sourceFps) * loops;
  const totalVideoFrames = Math.max(1, Math.round(totalSourceDurationSec * targetFps));

  // Create temporary container element strictly for lottie player canvas
  const lottieContainer = document.createElement('div');
  lottieContainer.style.position = 'fixed';
  lottieContainer.style.left = '-9999px';
  lottieContainer.style.top = '-9999px';
  lottieContainer.style.width = `${targetWidth}px`;
  lottieContainer.style.height = `${targetHeight}px`;
  document.body.appendChild(lottieContainer);

  // Standalone output canvas for background compositing and video encoding
  const renderCanvas = document.createElement('canvas');
  renderCanvas.width = targetWidth;
  renderCanvas.height = targetHeight;
  const ctx = renderCanvas.getContext('2d', { alpha: true, willReadFrequently: true })!;

  let animItem: AnimationItem | null = null;

  try {
    // Load Lottie with canvas renderer inside lottieContainer
    animItem = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      animationData: JSON.parse(JSON.stringify(animData)), // clone object
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true,
      },
    });

    // Wait for DOM / Lottie ready
    await new Promise<void>((resolve, reject) => {
      if (!animItem) return reject(new Error('Failed to initialize Lottie player'));
      const timeout = setTimeout(() => resolve(), 3000);
      animItem.addEventListener('DOMLoaded', () => {
        clearTimeout(timeout);
        try {
          animItem?.resize(targetWidth, targetHeight);
          animItem?.goToAndStop(ip, true);
        } catch {
          // ignore
        }
        resolve();
      });
      animItem.addEventListener('data_failed', () => {
        clearTimeout(timeout);
        reject(new Error('Invalid Lottie animation data'));
      });
    });

    // Check WebCodecs VideoEncoder support
    const hasWebCodecs = typeof window !== 'undefined' && typeof window.VideoEncoder !== 'undefined';

    if (hasWebCodecs) {
      try {
        return await convertWithWebCodecs(
          animItem,
          lottieContainer,
          renderCanvas,
          ctx,
          targetWidth,
          targetHeight,
          targetFps,
          totalVideoFrames,
          ip,
          op,
          sourceFps,
          settings,
          onProgress,
          signal
        );
      } catch (webCodecsErr) {
        console.warn('WebCodecs conversion failed, falling back to MediaRecorder:', webCodecsErr);
        return await convertWithMediaRecorder(
          animItem,
          lottieContainer,
          renderCanvas,
          ctx,
          targetWidth,
          targetHeight,
          targetFps,
          totalVideoFrames,
          ip,
          op,
          sourceFps,
          settings,
          onProgress,
          signal
        );
      }
    } else {
      return await convertWithMediaRecorder(
        animItem,
        lottieContainer,
        renderCanvas,
        ctx,
        targetWidth,
        targetHeight,
        targetFps,
        totalVideoFrames,
        ip,
        op,
        sourceFps,
        settings,
        onProgress,
        signal
      );
    }
  } finally {
    if (animItem) {
      animItem.destroy();
    }
    if (lottieContainer.parentNode) {
      lottieContainer.parentNode.removeChild(lottieContainer);
    }
  }
}

async function convertWithWebCodecs(
  animItem: AnimationItem,
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fps: number,
  totalFrames: number,
  ip: number,
  op: number,
  sourceFps: number,
  settings: ConversionSettings,
  onProgress: (progress: ConversionProgressData) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const startTime = Date.now();

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width: width,
      height: height,
    },
    fastStart: 'in-memory',
  });

  let encoderError: Error | null = null;

  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
    },
    error: (err) => {
      console.error('VideoEncoder error:', err);
      encoderError = err;
    },
  });

  // Pick widely-supported H.264 codec profiles appropriate for the target resolution
  const is4K = width > 1920 || height > 1080;
  const codecCandidates = is4K
    ? [
        'avc1.4d4033', // Main Profile Level 5.1 (4K @ 60fps)
        'avc1.640033', // High Profile Level 5.1
        'avc1.4d402a', // Main Profile Level 4.2
        'avc1.64002a', // High Profile Level 4.2
      ]
    : [
        'avc1.4d4028', // Main Profile Level 4.0 (1080p standard, widely supported across all players)
        'avc1.42e028', // Constrained Baseline Level 4.0
        'avc1.420028', // Baseline Level 4.0
        'avc1.4d401f', // Main Profile Level 3.1
        'avc1.42001f', // Baseline Profile Level 3.1
        'avc1.640028', // High Profile Level 4.0
      ];

  let selectedCodec: string | null = null;

  for (const codec of codecCandidates) {
    try {
      const support = await VideoEncoder.isConfigSupported({
        codec,
        width,
        height,
        bitrate: (settings.bitrateKbps || 8000) * 1000,
        framerate: fps,
      });
      if (support.supported) {
        selectedCodec = codec;
        break;
      }
    } catch {
      // ignore
    }
  }

  if (!selectedCodec) {
    throw new Error(`WebCodecs H.264 profile not supported for resolution ${width}x${height}`);
  }

  videoEncoder.configure({
    codec: selectedCodec,
    width: width,
    height: height,
    bitrate: (settings.bitrateKbps || 8000) * 1000,
    framerate: fps,
  });

  const frameDurationUs = Math.round(1_000_000 / fps);
  const animSpan = Math.max(1, op - ip);
  const bgColor = settings.bgColor || '#ffffff';

  try {
    for (let f = 0; f < totalFrames; f++) {
      if (signal?.aborted) {
        throw new Error('Conversion cancelled by user');
      }
      if (encoderError || (videoEncoder.state as string) === 'closed') {
        throw encoderError || new Error('VideoEncoder closed unexpectedly during encoding');
      }

      // Time in seconds from start of video
      const currentVideoTimeSec = f / fps;
      // Map time to Lottie frame
      const sourceFrameOffset = (currentVideoTimeSec * sourceFps) % animSpan;
      const currentSourceFrame = ip + sourceFrameOffset;

      // Render Lottie frame onto its internal canvas
      animItem.goToAndStop(currentSourceFrame, true);

      // Clear and draw background color on target canvas
      ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw Lottie's rendered canvas onto target output canvas
      const lottieCanvas = container.querySelector('canvas');
      if (lottieCanvas) {
        ctx.drawImage(lottieCanvas, 0, 0, width, height);
      }

      // Yield macro-task so browser updates canvas render tree
      await new Promise((r) => setTimeout(r, 0));

      const timestampUs = Math.round(f * frameDurationUs);

      const videoFrame = new VideoFrame(canvas, {
        timestamp: timestampUs,
        duration: frameDurationUs,
      });

      const isKeyFrame = f % Math.max(1, Math.round(fps * 2)) === 0;

      if ((videoEncoder.state as string) === 'closed' || encoderError) {
        videoFrame.close();
        throw encoderError || new Error('VideoEncoder closed before frame encode');
      }

      videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();

      // Calculate progress & ETA
      const elapsedMs = Date.now() - startTime;
      const progressFrac = (f + 1) / totalFrames;
      const estimatedTotalMs = elapsedMs / progressFrac;
      const estimatedRemainingMs = Math.max(0, estimatedTotalMs - elapsedMs);

      let previewUrl: string | undefined = undefined;
      // Capture periodic preview thumbnail for UI feedback
      if (f % Math.max(1, Math.round(totalFrames / 30)) === 0 || f === totalFrames - 1) {
        try {
          previewUrl = canvas.toDataURL('image/jpeg', 0.5);
        } catch {
          // ignore data URL error
        }
      }

      onProgress({
        currentFrame: f + 1,
        totalFrames,
        percentage: Math.round(progressFrac * 100),
        elapsedMs,
        estimatedRemainingMs,
        previewCanvasDataUrl: previewUrl,
      });
    }

    if ((videoEncoder.state as string) !== 'closed' && !encoderError) {
      await videoEncoder.flush();
    } else if (encoderError) {
      throw encoderError;
    }

    muxer.finalize();
    const buffer = muxer.target.buffer;
    return new Blob([buffer], { type: 'video/mp4' });
  } finally {
    if ((videoEncoder.state as string) !== 'closed') {
      try {
        videoEncoder.close();
      } catch {
        // ignore
      }
    }
  }
}

async function convertWithMediaRecorder(
  animItem: AnimationItem,
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fps: number,
  totalFrames: number,
  ip: number,
  op: number,
  sourceFps: number,
  settings: ConversionSettings,
  onProgress: (progress: ConversionProgressData) => void,
  signal?: AbortSignal
): Promise<Blob> {
  const startTime = Date.now();
  const stream = canvas.captureStream(fps);
  
  // Preferred mimeTypes for recorded output
  const mimeTypes = [
    'video/mp4',
    'video/mp4;codecs=avc1',
    'video/webm;codecs=vp9',
    'video/webm',
  ];

  let selectedMime = 'video/mp4';
  for (const m of mimeTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      selectedMime = m;
      break;
    }
  }

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: selectedMime,
    videoBitsPerSecond: (settings.bitrateKbps || 8000) * 1000,
  });

  const chunks: Blob[] = [];
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  mediaRecorder.start();

  const animSpan = Math.max(1, op - ip);
  const bgColor = settings.bgColor || '#ffffff';
  const frameIntervalMs = 1000 / fps;

  for (let f = 0; f < totalFrames; f++) {
    if (signal?.aborted) {
      mediaRecorder.stop();
      throw new Error('Conversion cancelled by user');
    }

    const currentVideoTimeSec = f / fps;
    const sourceFrameOffset = (currentVideoTimeSec * sourceFps) % animSpan;
    const currentSourceFrame = ip + sourceFrameOffset;

    // Render Lottie frame
    animItem.goToAndStop(currentSourceFrame, true);

    // Clear and draw background
    ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
    ctx.fillRect(0, 0, width, height);

    // Draw Lottie canvas on output canvas
    const lottieCanvas = container.querySelector('canvas');
    if (lottieCanvas) {
      ctx.drawImage(lottieCanvas, 0, 0, width, height);
    }

    await new Promise((r) => setTimeout(r, frameIntervalMs));

    const elapsedMs = Date.now() - startTime;
    const progressFrac = (f + 1) / totalFrames;

    onProgress({
      currentFrame: f + 1,
      totalFrames,
      percentage: Math.round(progressFrac * 100),
      elapsedMs,
      estimatedRemainingMs: Math.max(0, (elapsedMs / progressFrac) - elapsedMs),
    });
  }

  return new Promise((resolve, reject) => {
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedMime.includes('mp4') ? 'video/mp4' : 'video/webm' });
      resolve(blob);
    };
    mediaRecorder.onerror = (e) => reject(e);
    mediaRecorder.stop();
  });
}
