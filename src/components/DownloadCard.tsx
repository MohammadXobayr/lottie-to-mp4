import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2, RotateCcw, Video, HardDrive, Sparkles } from 'lucide-react';
import { AnimationInfo, ConversionSettings } from '../types';

interface DownloadCardProps {
  mp4Blob: Blob;
  info: AnimationInfo;
  settings: ConversionSettings;
  onReset: () => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({ mp4Blob, info, settings, onReset }) => {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(mp4Blob);
    setVideoUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [mp4Blob]);

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    const baseName = info.fileName.replace(/\.json$/i, '');
    const isWebM = mp4Blob.type.includes('webm');
    const ext = isWebM ? 'webm' : 'mp4';
    a.download = `${baseName}_converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fileSizeMb = (mp4Blob.size / (1024 * 1024)).toFixed(2);
  const isWebM = mp4Blob.type.includes('webm');
  const formatLabel = isWebM ? 'WebM (VP9)' : 'MP4 (H.264)';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
      {/* Success banner */}
      <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-lg">
        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        <span>Conversion Ready!</span>
      </div>

      <p className="text-xs text-slate-500 -mt-2">
        Your animation has been encoded into a high-quality video file.
      </p>

      {/* Video Preview */}
      <div className="relative w-full aspect-square max-h-[360px] rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs">
        {videoUrl ? (
          <video
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-slate-400 text-xs font-medium">Loading video preview...</div>
        )}
      </div>

      {/* Video File Metadata */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
            <Video className="w-3 h-3 text-indigo-600" /> Format
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{formatLabel}</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
            <HardDrive className="w-3 h-3 text-indigo-600" /> File Size
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{fileSizeMb} MB</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" /> Frame Rate
          </div>
          <div className="text-xs font-bold text-slate-800 mt-0.5">{settings.fps} FPS</div>
        </div>
      </div>

      {/* Primary Download Action */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-5 h-5" /> Download MP4 File
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Convert Another Animation
        </button>
      </div>
    </div>
  );
};
