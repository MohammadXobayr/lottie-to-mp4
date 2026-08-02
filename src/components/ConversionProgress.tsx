import React from 'react';
import { Loader2, Film, Clock, XCircle, Sparkles } from 'lucide-react';
import { ConversionProgressData } from '../types';

interface ConversionProgressProps {
  progress: ConversionProgressData | null;
  onCancel: () => void;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({ progress, onCancel }) => {
  const percentage = progress?.percentage ?? 0;
  const currentFrame = progress?.currentFrame ?? 0;
  const totalFrames = progress?.totalFrames ?? 1;
  const elapsedSec = ((progress?.elapsedMs ?? 0) / 1000).toFixed(1);
  const remainingSec = ((progress?.estimatedRemainingMs ?? 0) / 1000).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm max-w-xl mx-auto space-y-6 text-center">
      {/* Icon badge */}
      <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          Converting Animation to MP4 <Sparkles className="w-4 h-4 text-indigo-600" />
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Encoding vector frames with browser WebCodecs... Please wait a moment.
        </p>
      </div>

      {/* Frame Preview Thumbnail if available */}
      {progress?.previewCanvasDataUrl && (
        <div className="w-40 h-40 mx-auto rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-xs p-2 flex items-center justify-center">
          <img
            src={progress.previewCanvasDataUrl}
            alt="Frame preview"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      )}

      {/* Progress Bar & Percentage */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-600 flex items-center gap-1 font-sans font-semibold">
            <Film className="w-3.5 h-3.5 text-indigo-600" /> Frame {currentFrame} / {totalFrames}
          </span>
          <span className="text-indigo-600 font-bold text-sm font-sans">{percentage}%</span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(100, Math.max(2, percentage))}%` }}
          />
        </div>
      </div>

      {/* Time stats */}
      <div className="flex items-center justify-center gap-6 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 max-w-md mx-auto">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" /> Elapsed: <span className="text-slate-800 font-bold">{elapsedSec}s</span>
        </div>
        <div className="h-3 w-px bg-slate-200" />
        <div className="font-medium">
          Est. Remaining: <span className="text-slate-800 font-bold">{remainingSec}s</span>
        </div>
      </div>

      {/* Cancel button */}
      <div>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4 text-rose-500" /> Cancel Conversion
        </button>
      </div>
    </div>
  );
};
