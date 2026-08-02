import React from 'react';
import { Settings2, Film, Palette, Repeat, Gauge } from 'lucide-react';
import { ConversionSettings, ResolutionPresetId } from '../types';
import { RESOLUTION_PRESETS } from '../utils/lottieConverter';

interface ConversionSettingsProps {
  settings: ConversionSettings;
  onChange: (newSettings: ConversionSettings) => void;
  originalWidth: number;
  originalHeight: number;
  onConvertClick: () => void;
}

const BG_COLOR_PRESETS = [
  { label: 'White', value: '#ffffff', preview: '#ffffff' },
  { label: 'Black', value: '#000000', preview: '#000000' },
  { label: 'Dark Navy', value: '#0f172a', preview: '#0f172a' },
  { label: 'Transparent', value: 'transparent', preview: 'checker' },
];

export const ConversionSettingsPanel: React.FC<ConversionSettingsProps> = ({
  settings,
  onChange,
  originalWidth,
  originalHeight,
  onConvertClick,
}) => {
  const handleResolutionChange = (id: ResolutionPresetId) => {
    onChange({ ...settings, resolutionId: id });
  };

  const handleFpsChange = (fps: number) => {
    onChange({ ...settings, fps });
  };

  const handleBgColorChange = (bgColor: string) => {
    onChange({ ...settings, bgColor });
  };

  const handleLoopsChange = (loops: number) => {
    onChange({ ...settings, loops });
  };

  const handleQualityChange = (quality: 'standard' | 'high' | 'ultra') => {
    let bitrateKbps = 8000;
    if (quality === 'standard') bitrateKbps = 5000;
    if (quality === 'high') bitrateKbps = 8000;
    if (quality === 'ultra') bitrateKbps = 16000;

    onChange({ ...settings, quality, bitrateKbps });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
          <Settings2 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Conversion Settings</h3>
          <p className="text-xs text-slate-500">Configure resolution, frame rate & video quality</p>
        </div>
      </div>

      {/* Resolution Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-600" /> Output Resolution
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {RESOLUTION_PRESETS.map((res) => {
            const isSelected = settings.resolutionId === res.id;
            let displayDimensions = `${res.width} × ${res.height}`;
            if (res.id === 'original') {
              displayDimensions = `${originalWidth} × ${originalHeight}`;
            }

            return (
              <button
                key={res.id}
                type="button"
                onClick={() => handleResolutionChange(res.id)}
                className={`p-3 rounded-xl border text-left transition-all text-xs font-semibold ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                <div className="font-bold">{res.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{displayDimensions}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* FPS & Quality Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Frame Rate */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-indigo-600" /> Frame Rate (FPS)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[24, 30, 60].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFpsChange(f)}
                className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                  settings.fps === f
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {f} FPS
              </button>
            ))}
          </div>
        </div>

        {/* Video Quality */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-indigo-600" /> Bitrate / Quality
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['standard', 'high', 'ultra'] as const).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQualityChange(q)}
                className={`py-2 rounded-xl border text-xs capitalize font-bold transition-all ${
                  settings.quality === q
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background Color Picker */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-600" /> Background Color
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {BG_COLOR_PRESETS.map((bg) => {
            const isSelected = settings.bgColor === bg.value;
            return (
              <button
                key={bg.value}
                type="button"
                onClick={() => handleBgColorChange(bg.value)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0"
                  style={{
                    backgroundColor: bg.value === 'transparent' ? '#ffffff' : bg.value,
                    backgroundImage:
                      bg.value === 'transparent'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                    backgroundSize: '8px 8px',
                  }}
                />
                {bg.label}
              </button>
            );
          })}

          {/* Custom Hex input */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700">
            <input
              type="color"
              value={settings.bgColor === 'transparent' ? '#ffffff' : settings.bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-5 h-5 bg-transparent border-0 rounded cursor-pointer p-0"
            />
            <input
              type="text"
              value={settings.bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              placeholder="#ffffff"
              className="w-16 bg-transparent text-xs text-slate-700 font-mono font-medium focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loop count multiplier */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Repeat className="w-3.5 h-3.5 text-indigo-600" /> Animation Loops
          </span>
          <span className="text-xs text-indigo-600 font-mono font-bold">{settings.loops}x Loop</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 5].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleLoopsChange(l)}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                settings.loops === l
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {l} {l === 1 ? 'Time' : 'Loops'}
            </button>
          ))}
        </div>
      </div>

      {/* Convert Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onConvertClick}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Convert to MP4 Video</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
