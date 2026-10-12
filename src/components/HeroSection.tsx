import React from 'react';
import { Video, Youtube, ShieldCheck, Zap, Droplets, ArrowRight } from 'lucide-react';
import { AspectRatio, Segment } from '../types';

interface HeroSectionProps {
  onSelectAudience: (aud: string) => void;
  selectedAudience: string;
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
  onExploreKits: () => void;
  onDirectGenerate: () => void;
  segments: Segment[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectAudience,
  selectedAudience,
  selectedRatio,
  onSelectRatio,
  onExploreKits,
  onDirectGenerate,
  segments,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-12 lg:py-16">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7">
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <span>Portal Multi Luz</span>
              <span aria-hidden="true">·</span>
              <span>Tecnologia Veo 3</span>
              <span aria-hidden="true">·</span>
              <span>ABNT NBR 5410 & 5626</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:leading-tight">
              Gerador de Vídeos YouTube para Kits Elétricos & Hidráulicos
            </h1>

            <p className="mt-4 text-base text-slate-300 sm:text-lg leading-relaxed max-w-2xl">
              Crie comerciais cinematográficos de alta conversão para o YouTube e Shorts (16:9 e 9:16). Automatize roteiros técnicos com Gemini 3.8 Flash e renderize cenas de engenharia com Veo 3 para condomínios, residências e indústrias.
            </p>

            {/* Ratio Selector Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-slate-400">Formato YouTube:</span>
              <div className="inline-flex rounded-lg bg-slate-900 p-1 border border-slate-800">
                <button
                  onClick={() => onSelectRatio('16:9')}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedRatio === '16:9'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Youtube className="h-4 w-4" />
                  <span>16:9 Vídeo Horizontal (Desktop / TV)</span>
                </button>
                <button
                  onClick={() => onSelectRatio('9:16')}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedRatio === '9:16'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="h-4 w-4" />
                  <span>9:16 Shorts Vertical (Mobile)</span>
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onDirectGenerate}
                className="inline-flex items-center gap-2.5 rounded-lg bg-amber-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-md transition-all hover:bg-amber-400 active:scale-95"
              >
                <Video className="h-4 w-4" />
                <span>Abrir Estúdio de Vídeo</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreKits}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <span>Ver Catálogo de Kits</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Normas Técnicas NBR</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Quadros & Cabos Cobre</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>PPR & Válvulas Bronze</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
              <div className="aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/hero_multiluz_industrial_1791112157710.jpg"
                  alt="Showroom de materiais elétricos e hidráulicos industriais em alta resolução"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                <div>
                  <div className="font-semibold text-white">Catálogo Técnico Integrado</div>
                  <div className="text-slate-400">Pronto para renderização em Veo 3</div>
                </div>
                <div className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[11px] text-amber-300">
                  {selectedRatio === '16:9' ? '1920 x 1080 FHD' : '1080 x 1920 Shorts'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Segment Filter Tabs */}
        <div className="mt-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800 pt-8">
          <div>
            <h2 className="text-sm font-semibold text-slate-400">Filtrar por Segmento de Aplicação / Nicho:</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectAudience('all')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                selectedAudience === 'all'
                  ? 'bg-white text-slate-950 font-bold shadow'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Todos os Segmentos
            </button>
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => onSelectAudience(seg.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedAudience === seg.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
