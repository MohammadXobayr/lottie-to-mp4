import React, { useRef, useState } from 'react';
import { Header } from './components/Header';
import { Dropzone } from './components/Dropzone';
import { AnimationPreview } from './components/AnimationPreview';
import { ConversionSettingsPanel } from './components/ConversionSettings';
import { ConversionProgress } from './components/ConversionProgress';
import { DownloadCard } from './components/DownloadCard';
import { AnimationInfo, ConversionProgressData, ConversionSettings, ConversionStatus } from './types';
import { convertLottieToMp4 } from './utils/lottieConverter';
import { ArrowLeft, AlertCircle, FileJson } from 'lucide-react';

export default function App() {
  const [info, setInfo] = useState<AnimationInfo | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [progress, setProgress] = useState<ConversionProgressData | null>(null);
  const [mp4Blob, setMp4Blob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [settings, setSettings] = useState<ConversionSettings>({
    resolutionId: 'original',
    customWidth: 512,
    customHeight: 512,
    fps: 30,
    bgColor: '#ffffff',
    loops: 1,
    bitrateKbps: 8000,
    quality: 'high',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAnimationLoaded = (newInfo: AnimationInfo) => {
    setInfo(newInfo);
    setStatus('idle');
    setMp4Blob(null);
    setErrorMsg(null);
    // Default fps to original fps if valid
    setSettings((prev) => ({
      ...prev,
      fps: newInfo.originalFps > 0 ? newInfo.originalFps : 30,
      customWidth: newInfo.originalWidth,
      customHeight: newInfo.originalHeight,
    }));
  };

  const handleStartConversion = async () => {
    if (!info) return;

    setStatus('rendering');
    setProgress(null);
    setErrorMsg(null);

    abortControllerRef.current = new AbortController();

    try {
      const blob = await convertLottieToMp4(
        info.data,
        settings,
        (progressData) => {
          setProgress(progressData);
        },
        abortControllerRef.current.signal
      );

      setMp4Blob(blob);
      setStatus('completed');
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('cancelled')) {
        setStatus('idle');
        setProgress(null);
        return;
      }
      console.error('Conversion error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred during MP4 conversion.');
      setStatus('error');
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
    setProgress(null);
  };

  const handleReset = () => {
    setInfo(null);
    setStatus('idle');
    setMp4Blob(null);
    setProgress(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Step 1: Upload JSON Animation */}
        {!info && <Dropzone onAnimationLoaded={handleAnimationLoaded} />}

        {/* Step 2: Live Preview & Settings (idle mode) */}
        {info && status === 'idle' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileJson className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                    {info.fileName}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {(info.fileSize / 1024).toFixed(1)} KB • {info.originalWidth}×{info.originalHeight}px • {info.totalFrames} frames
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Choose Other JSON
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <AnimationPreview info={info} bgColor={settings.bgColor} />
              <ConversionSettingsPanel
                settings={settings}
                onChange={setSettings}
                originalWidth={info.originalWidth}
                originalHeight={info.originalHeight}
                onConvertClick={handleStartConversion}
              />
            </div>
          </div>
        )}

        {/* Step 3: Conversion in progress */}
        {status === 'rendering' && (
          <ConversionProgress progress={progress} onCancel={handleCancelConversion} />
        )}

        {/* Step 4: Download MP4 result */}
        {status === 'completed' && mp4Blob && info && (
          <DownloadCard
            mp4Blob={mp4Blob}
            info={info}
            settings={settings}
            onReset={handleReset}
          />
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-xl mx-auto text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Conversion Failed</h3>
            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200 font-mono">
              {errorMsg || 'An unexpected error occurred while generating video frames.'}
            </p>
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-indigo-200"
            >
              Back to Settings
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>JSON Animation to MP4 Converter • Powered by Client-Side WebCodecs & Lottie Engine</p>
      </footer>
    </div>
  );
}
