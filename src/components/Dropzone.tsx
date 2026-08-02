import React, { useRef, useState } from 'react';
import { Upload, FileJson, AlertCircle, Code, Sparkles } from 'lucide-react';
import { AnimationInfo, LottieAnimationData } from '../types';
import { parseLottieInfo } from '../utils/lottieConverter';
import { SAMPLE_ANIMATIONS } from '../data/sampleAnimations';

interface DropzoneProps {
  onAnimationLoaded: (info: AnimationInfo) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onAnimationLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedJson, setPastedJson] = useState('');

  const processFile = (file: File) => {
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setErrorMsg('Please select a valid JSON animation file (.json)');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content) as LottieAnimationData;
        
        if (!parsed.layers && !parsed.assets && !parsed.v) {
          setErrorMsg('The uploaded JSON does not appear to be a valid Bodymovin / Lottie animation structure.');
          return;
        }

        const info = parseLottieInfo(parsed, file.name, file.size);
        onAnimationLoaded(info);
      } catch (err) {
        setErrorMsg('Failed to parse JSON file. Please make sure the JSON syntax is valid.');
      }
    };

    reader.onerror = () => {
      setErrorMsg('Error reading file from disk.');
    };

    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleSampleSelect = (sampleId: string) => {
    const sample = SAMPLE_ANIMATIONS.find((s) => s.id === sampleId);
    if (sample) {
      setErrorMsg(null);
      const info = parseLottieInfo(sample.data, `${sample.name.toLowerCase().replace(/\s+/g, '-')}.json`, 12000);
      onAnimationLoaded(info);
    }
  };

  const handlePasteSubmit = () => {
    try {
      setErrorMsg(null);
      const parsed = JSON.parse(pastedJson) as LottieAnimationData;
      if (!parsed.layers && !parsed.assets && !parsed.v) {
        setErrorMsg('Pasted content is missing Lottie structure (layers, assets, or version).');
        return;
      }
      const info = parseLottieInfo(parsed, 'pasted-animation.json', pastedJson.length);
      setShowPasteModal(false);
      onAnimationLoaded(info);
    } catch {
      setErrorMsg('Invalid JSON syntax in pasted text.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between px-4 max-w-xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-200">
            1
          </div>
          <span className="text-xs font-bold text-slate-800">Upload JSON</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-4"></div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
            2
          </div>
          <span className="text-xs font-semibold text-slate-400">Configure</span>
        </div>
        <div className="flex-1 h-px bg-slate-200 mx-4"></div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs">
            3
          </div>
          <span className="text-xs font-semibold text-slate-400">Download</span>
        </div>
      </div>

      {/* Primary Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 bg-white shadow-sm ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-indigo-500/80 hover:bg-slate-50/80'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".json,application/json"
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Upload className="w-10 h-10 text-indigo-600" />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">Drop your Lottie JSON here</h3>
            <p className="text-sm text-slate-500">
              Upload your <span className="text-indigo-600 font-semibold">.json</span> or <span className="text-indigo-600 font-semibold">Bodymovin</span> animation files to render high-quality MP4.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <FileJson className="w-4 h-4" /> Choose File
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasteModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-colors flex items-center gap-2"
            >
              <Code className="w-4 h-4 text-slate-500" /> Paste Raw JSON
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Preset Samples */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Or select a ready animation sample:
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SAMPLE_ANIMATIONS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleSelect(sample.id)}
              className="p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-left transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {sample.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">60 FPS</span>
                </div>
                <h5 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                  {sample.name}
                </h5>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{sample.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
                <span>Try Sample</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-600" /> Paste Lottie JSON
              </h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste raw JSON content from your Lottie animation file below:
            </p>
            <textarea
              value={pastedJson}
              onChange={(e) => setPastedJson(e.target.value)}
              placeholder='{"v":"5.7.4","fr":60,"ip":0,"op":60,"w":512,"h":512,"layers":[...]}'
              rows={8}
              className="w-full bg-slate-50 text-slate-800 border border-slate-200 rounded-xl p-4 font-mono text-xs focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePasteSubmit}
                disabled={!pastedJson.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 disabled:opacity-50"
              >
                Load Animation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
