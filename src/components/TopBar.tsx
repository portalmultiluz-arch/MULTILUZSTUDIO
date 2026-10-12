import React from 'react';
import { Video, PlusCircle, Sparkles, FileSpreadsheet } from 'lucide-react';

interface TopBarProps {
  onOpenCreateKit: () => void;
  onOpenImportKit: () => void;
  onScrollToStudio: () => void;
  onScrollToKits: () => void;
  activeView: 'catalog' | 'studio';
  setActiveView: (view: 'catalog' | 'studio') => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCreateKit,
  onOpenImportKit,
  onScrollToStudio,
  onScrollToKits,
  activeView,
  setActiveView,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 font-mono text-sm font-extrabold text-slate-950">
              ML
            </span>
            <span>MultiLuz Studio</span>
          </a>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              setActiveView('catalog');
              onScrollToKits();
            }}
            className={`transition-colors hover:text-white ${
              activeView === 'catalog' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Catálogo de Kits
          </button>
          <button
            onClick={() => {
              setActiveView('studio');
              onScrollToStudio();
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-white ${
              activeView === 'studio' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Estúdio Veo 3 & YouTube
          </button>
          <a
            href="#normas-abnt"
            className="transition-colors hover:text-white text-slate-400"
          >
            Normas ABNT (5410 & 5626)
          </a>
          <a
            href="#sobre-portal"
            className="transition-colors hover:text-white text-slate-400"
          >
            Portal Multi Luz
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenImportKit}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white whitespace-nowrap"
            title="Importar Kit via Planilha Excel / CSV"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Importar Planilha</span>
            <span className="sm:hidden">Importar</span>
          </button>

          <button
            onClick={onOpenCreateKit}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white whitespace-nowrap"
          >
            <PlusCircle className="h-4 w-4 text-amber-400" />
            <span>Novo Kit</span>
          </button>

          <button
            onClick={() => {
              setActiveView('studio');
              onScrollToStudio();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-sm transition-all hover:bg-amber-400 active:scale-95 whitespace-nowrap"
          >
            <Video className="h-4 w-4" />
            <span>Gerar Vídeo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
