import React from 'react';
import { Video, Sparkles, FileJson, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                LottieFlow <span className="text-indigo-600">MP4</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                <Sparkles className="w-3 h-3 text-indigo-600" /> GPU Accelerated
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Render Lottie JSON animations into high-quality MP4 video</p>
          </div>
        </div>

        {/* Workflow steps badge */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <FileJson className="w-3.5 h-3.5 text-indigo-600" /> 1. Upload JSON
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <Video className="w-3.5 h-3.5 text-indigo-600" /> 2. Convert
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <span className="text-emerald-600 font-semibold">3. Download</span>
        </div>
      </div>
    </header>
  );
};

