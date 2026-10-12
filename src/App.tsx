import React, { useState, useRef } from 'react';
import { Kit, AspectRatio, TargetAudience, Segment } from './types';
import { INITIAL_KITS, INITIAL_SEGMENTS } from './data/kitsData';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { KitCard } from './components/KitCard';
import { KitCustomizerModal } from './components/KitCustomizerModal';
import { VideoStudio } from './components/VideoStudio';
import { NormasSection } from './components/NormasSection';
import { Footer } from './components/Footer';
import { ImportKitModal } from './components/ImportKitModal';
import { KitPrintModal } from './components/KitPrintModal';
import { GoogleAdsPromptModal } from './components/GoogleAdsPromptModal';
import { PlusCircle, FileSpreadsheet, Sparkles, Printer, Target } from 'lucide-react';

export default function App() {
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [kits, setKits] = useState<Kit[]>(INITIAL_KITS);
  const [selectedKitId, setSelectedKitId] = useState<string>(INITIAL_KITS[0].id);
  const [selectedAudience, setSelectedAudience] = useState<'all' | TargetAudience>('all');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('16:9');
  const [activeView, setActiveView] = useState<'catalog' | 'studio'>('catalog');
  const [modalKit, setModalKit] = useState<Kit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [printKit, setPrintKit] = useState<Kit | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isGoogleAdsModalOpen, setIsGoogleAdsModalOpen] = useState(false);

  const studioRef = useRef<HTMLDivElement>(null);
  const kitsRef = useRef<HTMLDivElement>(null);

  const activeKit = kits.find((k) => k.id === selectedKitId) || kits[0];

  const filteredKits = kits.filter((k) => {
    if (selectedAudience === 'all') return true;
    return k.targetAudience === selectedAudience;
  });

  const handleAddNewSegment = (newSegment: Segment) => {
    setSegments((prev) => {
      if (prev.some((s) => s.id === newSegment.id)) return prev;
      return [...prev, newSegment];
    });
    setSelectedAudience(newSegment.id);
  };

  const handleSelectForVideo = (kit: Kit) => {
    setSelectedKitId(kit.id);
    setActiveView('studio');
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEditKit = (kit: Kit) => {
    setModalKit(kit);
    setIsModalOpen(true);
  };

  const handlePrintKit = (kit: Kit) => {
    setPrintKit(kit);
    setIsPrintModalOpen(true);
  };

  const handleCreateNewKit = () => {
    const targetAud = selectedAudience !== 'all' ? selectedAudience : 'condominio';
    const foundSegment = segments.find((s) => s.id === targetAud);

    const newKit: Kit = {
      id: `custom-kit-${Date.now()}`,
      title: 'Novo Kit Personalizado MultiLuz',
      targetAudience: targetAud,
      targetAudienceLabel: foundSegment?.label || targetAud,
      category: 'eletrico',
      description: 'Kit personalizado de alta performance técnica para obras e reformas prediais.',
      highlight: 'Materiais com certificação ABNT e garantia de procedência.',
      image: '/src/assets/images/hero_multiluz_industrial_1791112157710.jpg',
      estimatedPrice: 2500,
      recommendedAspectRatios: ['16:9', '9:16'],
      items: [
        {
          id: `item-init-1`,
          name: 'Quadro de Distribuição DIN com Barramento',
          category: 'eletrico',
          spec: 'Termoplástico antichama classe 2',
          norma: 'NBR 5410',
          unit: 'peça',
          quantity: 1,
          unitPrice: 350,
        },
        {
          id: `item-init-2`,
          name: 'Disjuntor Bipolar 40A Curva C',
          category: 'eletrico',
          spec: 'Proteção magnetotérmica 5kA',
          norma: 'NBR NM 60898',
          unit: 'peças',
          quantity: 2,
          unitPrice: 45,
        },
      ],
    };

    setModalKit(newKit);
    setIsModalOpen(true);
  };

  const handleSaveModalKit = (updatedKit: Kit) => {
    const exists = kits.some((k) => k.id === updatedKit.id);
    if (exists) {
      setKits(kits.map((k) => (k.id === updatedKit.id ? updatedKit : k)));
    } else {
      setKits([updatedKit, ...kits]);
      setSelectedKitId(updatedKit.id);
    }
  };

  const handleImportKit = (newKit: Kit, action?: 'video' | 'pdf' | 'save') => {
    setKits([newKit, ...kits]);
    setSelectedKitId(newKit.id);

    if (action === 'video') {
      setActiveView('studio');
      setTimeout(() => {
        studioRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (action === 'pdf') {
      setPrintKit(newKit);
      setIsPrintModalOpen(true);
    } else {
      // save
      setSelectedAudience(newKit.targetAudience);
    }
  };

  const activeSegmentObj = segments.find((s) => s.id === selectedAudience);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <TopBar
        onOpenCreateKit={handleCreateNewKit}
        onOpenImportKit={() => setIsImportModalOpen(true)}
        onScrollToStudio={() => studioRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onScrollToKits={() => kitsRef.current?.scrollIntoView({ behavior: 'smooth' })}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Dynamic Segments */}
        <HeroSection
          segments={segments}
          onSelectAudience={(aud) => setSelectedAudience(aud)}
          selectedAudience={selectedAudience}
          selectedRatio={selectedRatio}
          onSelectRatio={(ratio) => setSelectedRatio(ratio)}
          onExploreKits={() => kitsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          onDirectGenerate={() => {
            setActiveView('studio');
            studioRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Video Studio Section */}
        <div ref={studioRef} id="estudio-video" className="border-b border-slate-800 bg-slate-950 py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <VideoStudio
              selectedKit={activeKit}
              aspectRatio={selectedRatio}
              onSelectRatio={(ratio) => setSelectedRatio(ratio)}
              onSwitchKit={(kitId) => setSelectedKitId(kitId)}
              allKits={kits}
              onPrintKit={handlePrintKit}
              onOpenGoogleAdsPrompt={() => setIsGoogleAdsModalOpen(true)}
            />
          </div>
        </div>

        {/* Kits Catalog Showcase */}
        <div ref={kitsRef} id="catalogo-kits" className="py-12 lg:py-16 bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  <span>Catálogo de Produtos</span>
                  <span aria-hidden="true">·</span>
                  <span>Pronto para YouTube & Shorts</span>
                  {activeSegmentObj && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-cyan-400 font-bold">{activeSegmentObj.label}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-white">
                  Kits de Materiais Elétricos & Hidráulicos
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Selecione qualquer kit para gerar o vídeo e o roteiro correspondente no estúdio ou exportar PDF
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                  <span>Importar Planilha (CSV)</span>
                </button>

                <button
                  onClick={handleCreateNewKit}
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow transition-colors"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Novo Kit Personalizado</span>
                </button>
              </div>
            </div>

            {/* Grid of Kits */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredKits.map((kit) => (
                <KitCard
                  key={kit.id}
                  kit={kit}
                  onSelectForVideo={handleSelectForVideo}
                  onEditKit={handleEditKit}
                  onPrintKit={handlePrintKit}
                />
              ))}
            </div>

            {filteredKits.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                <p className="text-sm font-semibold text-slate-300">
                  Nenhum kit cadastrado ainda para este nicho.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Importe uma planilha Excel / CSV ou monte o primeiro kit comercial para este segmento.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>Importar Planilha CSV</span>
                  </button>
                  <button
                    onClick={handleCreateNewKit}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Criar Kit para {activeSegmentObj?.label || 'este Nicho'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical ABNT Norms Section */}
        <NormasSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Kit Customizer Modal */}
      <KitCustomizerModal
        kit={modalKit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveKit={handleSaveModalKit}
        segments={segments}
        onAddSegment={handleAddNewSegment}
      />

      {/* Excel / CSV Import Modal */}
      <ImportKitModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportKit={handleImportKit}
        segments={segments}
        onAddSegment={handleAddNewSegment}
      />

      {/* Printable PDF Sheet Modal */}
      <KitPrintModal
        kit={printKit}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onGenerateVideoFromKit={(k) => handleSelectForVideo(k)}
      />

      {/* Google Ads Prompt & Strategy Modal */}
      <GoogleAdsPromptModal
        isOpen={isGoogleAdsModalOpen}
        onClose={() => setIsGoogleAdsModalOpen(false)}
        activeKit={activeKit}
        onApplyForGoogleAds={(k) => {
          setSelectedKitId(k.id);
          setActiveView('studio');
          studioRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
