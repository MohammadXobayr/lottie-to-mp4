import React, { useEffect, useRef, useState } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { Play, Pause, RotateCcw, Clock, Layers, Maximize2, Repeat } from 'lucide-react';
import { AnimationInfo } from '../types';

interface AnimationPreviewProps {
  info: AnimationInfo;
  bgColor: string;
}

export const AnimationPreview: React.FC<AnimationPreviewProps> = ({ info, bgColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isLooping, setIsLooping] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous animation
    if (animRef.current) {
      animRef.current.destroy();
    }

    containerRef.current.innerHTML = '';

    const anim = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'canvas',
      loop: isLooping,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(info.data)),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true,
      },
    });

    animRef.current = anim;
    setIsPlaying(true);

    const handleEnterFrame = (e: { currentTime: number }) => {
      setCurrentFrame(Math.round(e.currentTime));
    };

    anim.addEventListener('enterFrame', handleEnterFrame);

    return () => {
      anim.removeEventListener('enterFrame', handleEnterFrame);
      anim.destroy();
    };
  }, [info, isLooping]);

  const togglePlay = () => {
    if (!animRef.current) return;
    if (isPlaying) {
      animRef.current.pause();
    } else {
      animRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    if (!animRef.current) return;
    animRef.current.goToAndPlay(0, true);
    setIsPlaying(true);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value, 10);
    setCurrentFrame(frame);
    if (animRef.current) {
      animRef.current.goToAndStop(frame, true);
      setIsPlaying(false);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const displayBgColor = bgColor === 'transparent' ? 'transparent' : bgColor;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Preview</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={toggleLoop}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
              isLooping
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" /> Loop
          </button>
        </div>
      </div>

      {/* Canvas viewport container */}
      <div
        className="relative w-full aspect-square max-h-[380px] rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center transition-colors shadow-xs"
        style={{
          backgroundColor: displayBgColor,
          backgroundImage:
            bgColor === 'transparent'
              ? 'radial-gradient(#cbd5e1 1px, transparent 1px)'
              : 'none',
          backgroundSize: '16px 16px',
        }}
      >
        <div ref={containerRef} className="w-full h-full max-w-full max-h-full flex items-center justify-center p-4" />
      </div>

      {/* Scrub & Playback Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-md shadow-indigo-200 shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={handleRestart}
            className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center transition-colors shrink-0 font-bold"
            title="Restart Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex-1 space-y-1">
            <input
              type="range"
              min={0}
              max={Math.max(1, info.totalFrames - 1)}
              value={currentFrame}
              onChange={handleScrub}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono font-medium">
              <span>
                Frame {currentFrame} / {info.totalFrames}
              </span>
              <span>
                {((currentFrame / info.originalFps) || 0).toFixed(2)}s / {info.durationSeconds.toFixed(2)}s
              </span>
            </div>
          </div>
        </div>

        {/* Animation Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
              <Maximize2 className="w-3 h-3 text-indigo-600" /> Size
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {info.originalWidth} × {info.originalHeight}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-indigo-600" /> FPS / Dur
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {info.originalFps} FPS ({info.durationSeconds.toFixed(1)}s)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
              <Layers className="w-3 h-3 text-indigo-600" /> Layers
            </div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {info.data.layers ? info.data.layers.length : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
