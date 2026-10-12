import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Youtube, Check } from 'lucide-react';
import { AspectRatio, Kit, GeneratedScript } from '../types';

interface InteractiveVideoPlayerProps {
  kit: Kit;
  script?: GeneratedScript;
  aspectRatio: AspectRatio;
  videoUrl?: string;
  isGenerating?: boolean;
  progress?: number;
  phaseText?: string;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  kit,
  script,
  aspectRatio,
  videoUrl,
  isGenerating = false,
  progress = 0,
  phaseText = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(15); // 15-second showcase loop
  const [copiedLink, setCopiedLink] = useState(false);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Active scene calculation
  const activeSceneIndex = script?.scenes
    ? Math.min(
        script.scenes.length - 1,
        Math.floor((currentTime / duration) * script.scenes.length)
      )
    : 0;

  const currentScene = script?.scenes?.[activeSceneIndex];

  // Playback timer loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0; // loop
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Audio Voice-Over simulation using Web Speech API
  useEffect(() => {
    if (isPlaying && !isMuted && script?.spokenScript && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script.spokenScript);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 0.95; // deeper commercial tone
      synthUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else if ((!isPlaying || isMuted) && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, isMuted, script]);

  const togglePlay = () => {
    if (videoUrl && videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
      } else {
        videoElementRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = 0;
    }
    setIsPlaying(true);
  };

  // Zoom and pan motion phase based on currentTime
  const motionScale = 1 + (currentTime % 5) * 0.03;
  const panX = Math.sin((currentTime / duration) * Math.PI * 2) * 8;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Container with dynamic aspect ratio */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-500 ${
          aspectRatio === '9:16'
            ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
            : 'w-full max-w-[680px] aspect-[16/9]'
        }`}
      >
        {/* Real Video Mode if URL present */}
        {videoUrl ? (
          <video
            ref={videoElementRef}
            src={videoUrl}
            className="h-full w-full object-cover"
            playsInline
            loop
            muted={isMuted}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          /* High-Fidelity Animated Studio Preview Engine */
          <div className="relative h-full w-full overflow-hidden select-none bg-slate-950">
            {/* Background Studio Visual with Smooth Cinematic Zoom & Pan */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${motionScale}) translateX(${panX}px)`,
              }}
            >
              <img
                src={kit.image}
                alt={kit.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover brightness-95 contrast-105"
              />
            </div>

            {/* Cinematic Lighting Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            {/* Studio Watermark & YouTube Format Tag */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-slate-700/50">
                <Youtube className="h-3 w-3 text-red-500" />
                <span>{aspectRatio === '16:9' ? 'YouTube 16:9' : 'YouTube Shorts 9:16'}</span>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 border border-amber-500/30">
                <span>Veo 3 Engine</span>
              </div>
            </div>

            {/* Overlaid Technical Lower Thirds & Scene Display */}
            <div className="absolute bottom-14 left-4 right-4 pointer-events-none space-y-2">
              {/* Product Badge & Compliance */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-400 border border-amber-500/30 backdrop-blur-sm">
                  {kit.category === 'eletrico' ? 'ABNT NBR 5410' : 'ABNT NBR 5626'}
                </span>
                <span className="rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50 backdrop-blur-sm">
                  {kit.targetAudienceLabel ||
                    (kit.targetAudience === 'condominio'
                      ? 'Manutenção Predial'
                      : kit.targetAudience === 'residencia'
                      ? 'Padrão Residencial'
                      : kit.targetAudience === 'empresa'
                      ? 'Uso Comercial / Industrial'
                      : kit.targetAudience)}
                </span>
              </div>

              {/* Title & Scene narration snippet */}
              <div className="rounded-lg bg-slate-950/80 p-2.5 backdrop-blur-md border border-slate-800/80">
                <h4 className="text-xs font-bold text-white leading-tight line-clamp-1">
                  {kit.title}
                </h4>
                {currentScene ? (
                  <p className="mt-1 text-[11px] font-medium text-amber-200/90 leading-tight line-clamp-2">
                    "{currentScene.narration}"
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">
                    {kit.highlight}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Generating Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md p-6 text-center z-20">
            <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
              <div className="h-12 w-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <Sparkles className="h-5 w-5 text-amber-400 absolute" />
            </div>

            <h4 className="text-sm font-bold text-white">Renderizando com Veo 3</h4>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">{phaseText}</p>

            {/* Progress Bar */}
            <div className="mt-4 w-48 overflow-hidden rounded-full bg-slate-800 h-1.5">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>
            <span className="mt-2 font-mono text-[11px] text-amber-400 tabular-nums">
              {progress}% concluído
            </span>
          </div>
        )}

        {/* Floating Play Button when Paused */}
        {!isPlaying && !isGenerating && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] transition-all hover:bg-black/20 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
              <Play className="h-6 w-6 ml-0.5 fill-current" />
            </div>
          </button>
        )}

        {/* Bottom Playback HUD Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex h-10 items-center justify-between bg-slate-950/80 px-3 backdrop-blur-md border-t border-slate-800/80 text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-amber-400 transition-colors"
              title={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-1 hover:text-amber-400 transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 hover:text-amber-400 transition-colors"
              title={isMuted ? 'Ativar Locução' : 'Mudo'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-slate-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-amber-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 tabular-nums">
            <span>0:{Math.floor(currentTime).toString().padStart(2, '0')}</span>
            <span>/</span>
            <span>0:{duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
