import React, { useState, useEffect } from 'react';
import { Video, Youtube, Sparkles, Download, RefreshCw, FileText, Check, AlertCircle, Printer, Target } from 'lucide-react';
import { Kit, AspectRatio, GeneratedScript } from '../types';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { ScriptDisplay } from './ScriptDisplay';

interface VideoStudioProps {
  selectedKit: Kit;
  aspectRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
  onSwitchKit: (kitId: string) => void;
  allKits: Kit[];
  onPrintKit?: (kit: Kit) => void;
  onOpenGoogleAdsPrompt?: () => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  selectedKit,
  aspectRatio,
  onSelectRatio,
  onSwitchKit,
  allKits,
  onPrintKit,
  onOpenGoogleAdsPrompt,
}) => {
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [operationName, setOperationName] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [phaseText, setPhaseText] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [customVeoPrompt, setCustomVeoPrompt] = useState<string>('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [customNotes, setCustomNotes] = useState('');
  const [studioMessage, setStudioMessage] = useState<string | null>(null);
  const [videoGoal, setVideoGoal] = useState<'organic' | 'google_ads'>('organic');
  const [downloadingVideo, setDownloadingVideo] = useState(false);

  // Automatically trigger initial script generation when selectedKit or videoGoal changes
  useEffect(() => {
    handleGenerateScript(videoGoal);
  }, [selectedKit.id, videoGoal]);

  // Generate Script using Gemini 3.8 Flash
  const handleGenerateScript = async (goalOverride?: 'organic' | 'google_ads') => {
    setIsGeneratingScript(true);
    setStudioMessage(null);
    const activeGoal = goalOverride || videoGoal;
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kit: selectedKit,
          targetAudience: selectedKit.targetAudience,
          aspectRatio,
          customNotes,
          videoGoal: activeGoal,
        }),
      });

      if (!res.ok) {
        throw new Error(`Falha ao gerar roteiro (${res.status})`);
      }

      const data: GeneratedScript = await res.json();
      setScript(data);
      if (data.veoPrompt) {
        setCustomVeoPrompt(data.veoPrompt);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback robust default script if network fails
      const fallbackScript: GeneratedScript = {
        youtubeTitle: `${selectedKit.title} | Solução Completa NBR Portal Multi Luz`,
        youtubeDescription: `Confira o kit completo de ${selectedKit.category === 'eletrico' ? 'material elétrico' : 'material hidráulico'} ideal para ${selectedKit.targetAudience}. Atende com rigor as normas ABNT NBR 5410 e 5626.\n\nItens Inclusos:\n${selectedKit.items.map((i) => `* ${i.quantity}x ${i.name} - ${i.spec}`).join('\n')}\n\nEntre em contato com a equipe comercial Multi Luz para orçamentos e pronta entrega.`,
        tags: ['material eletrico', 'material hidraulico', 'reforma', 'condominio', 'obra', 'multiluz'],
        hashtags: ['#Eletrica', '#Hidraulica', '#MultiLuz', '#ConstrucaoCivil'],
        spokenScript: `Atenção síndicos, eletricistas e instaladores. Para garantir a segurança e a conformidade técnica da sua obra, apresentamos o ${selectedKit.title}. Produtos certificados de acordo com as normas ABNT para máxima durabilidade. Fale com o Portal Multi Luz e garanta seu kit com condições exclusivas.`,
        veoPrompt: `Photorealistic studio product commercial of ${selectedKit.title}, showing neat arrangement of electrical switchboards, copper wiring, and brass valves on a clean graphite surface, 8k resolution, cinematic lighting, slow camera dolly in.`,
        scenes: [
          {
            time: '0:00 - 0:05',
            title: 'Abertura do Kit',
            visualDescription: 'Visão geral dos materiais com iluminação técnica em estúdio',
            narration: `Apresentamos o ${selectedKit.title}, a solução definitiva com garantia técnica.`,
          },
          {
            time: '0:05 - 0:10',
            title: 'Normas e Detalhes',
            visualDescription: 'Close-up nos disjuntores, conexões e cabos antichama',
            narration: `Conformidade rigorosa com normas técnicas ABNT para proteção de vidas e patrimônio.`,
          },
          {
            time: '0:10 - 0:15',
            title: 'Chamada Comercial',
            visualDescription: 'Logo Portal Multi Luz e dados para cotação rápida',
            narration: `Peça agora o seu kit pelo WhatsApp do Portal Multi Luz com entrega rápida.`,
          },
        ],
      };
      setScript(fallbackScript);
      setCustomVeoPrompt(fallbackScript.veoPrompt);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Trigger Veo 3 Video Generation
  const handleStartVeoVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoProgress(5);
    setPhaseText('Enviando prompt cinemático para Veo 3 (veo-3.1-fast-generate-preview)...');
    setStudioMessage(null);
    setVideoUrl(undefined);

    const promptToSend =
      customVeoPrompt ||
      `Cinematic commercial of ${selectedKit.title}, displaying electrical circuit breakers, copper spools, brass valves, 8k studio photography, slow motion tracking shot.`;

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          aspectRatio,
          resolution,
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro na API de vídeo (${res.status})`);
      }

      const data = await res.json();
      setOperationName(data.operationName);

      if (data.warning) {
        setStudioMessage(data.warning);
      }

      // Start Polling loop
      pollVideoStatus(data.operationName);
    } catch (err: any) {
      console.error(err);
      setIsGeneratingVideo(false);
      setStudioMessage('Aviso: Ativando visualização interativa do estúdio.');
    }
  };

  // Polling loop
  const pollVideoStatus = async (opName: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: opName }),
        });

        if (!res.ok) {
          throw new Error('Falha ao checar status');
        }

        const data = await res.json();

        if (data.progress) {
          setVideoProgress(data.progress);
        } else {
          setVideoProgress((prev) => Math.min(95, prev + 5));
        }

        if (data.phase) {
          setPhaseText(data.phase);
        }

        if (data.done) {
          clearInterval(interval);
          setVideoProgress(100);
          setPhaseText('Renderização concluída com sucesso!');
          setIsGeneratingVideo(false);

          // If real Veo generated, fetch video download URL
          if (!data.isMock) {
            handleDownloadVideo(opName, true);
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setIsGeneratingVideo(false);
          setPhaseText('Tempo limite atingido. Você pode visualizar o preview direto no player.');
        }
      } catch (err) {
        console.error('Erro de polling:', err);
      }
    }, 2500);
  };

  // Download video file
  const handleDownloadVideo = async (opName?: string, onlySetUrl = false) => {
    const targetOp = opName || operationName;
    if (!targetOp) return;

    setDownloadingVideo(true);
    try {
      const res = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName: targetOp }),
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('video/mp4')) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);

        if (!onlySetUrl) {
          const a = document.createElement('a');
          a.href = url;
          a.download = `multiluz-${selectedKit.id}-${aspectRatio.replace(':', '_')}.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        const json = await res.json();
        setStudioMessage(json.message || 'Vídeo pronto para visualização!');
      }
    } catch (err) {
      console.error('Erro ao baixar vídeo:', err);
    } finally {
      setDownloadingVideo(false);
    }
  };

  // Export YouTube Studio Package (ZIP or text file)
  const handleExportYouTubePackage = () => {
    if (!script) return;

    const content = `=======================================================
PORTAL MULTI LUZ - PACOTE DE PUBLICAÇÃO YOUTUBE
=======================================================
Kit Selecionado: ${selectedKit.title}
Público-Alvo: ${selectedKit.targetAudience}
Formato de Vídeo: ${aspectRatio === '9:16' ? 'YouTube Shorts (9:16)' : 'Vídeo Regular (16:9)'}
Data de Geração: ${new Date().toLocaleDateString('pt-BR')}
=======================================================

1. TÍTULO PARA O YOUTUBE:
${script.youtubeTitle}

2. DESCRIÇÃO FORMATADA PARA O YOUTUBE:
${script.youtubeDescription}

3. HASHTAGS:
${script.hashtags.join(' ')}

4. TAGS DE BUSCA:
${script.tags.join(', ')}

5. ROTEIRO DE LOCUÇÃO (VOICE-OVER):
${script.spokenScript}

6. PROMPT VEO 3 UTILIZADO NA CENA:
${customVeoPrompt || script.veoPrompt}

7. PRODUTOS DO KIT:
${selectedKit.items.map((i) => `- ${i.quantity}x ${i.name} (${i.spec}) [${i.norma}]`).join('\n')}

=======================================================
Portal Multi Luz - Distribuidora de Materiais Elétricos e Hidráulicos
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `youtube-pack-${selectedKit.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header & Kit Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <span>Estúdio de Produção</span>
            <span aria-hidden="true">·</span>
            <span>Veo 3 & Gemini 3.8 Flash</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Produção de Vídeo para o YouTube
          </h2>
        </div>

        {/* Quick Kit Switcher Select */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 whitespace-nowrap">Kit Ativo:</label>
          <select
            value={selectedKit.id}
            onChange={(e) => onSwitchKit(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white focus:border-amber-500 focus:outline-none max-w-[260px] truncate"
          >
            {allKits.map((k) => (
              <option key={k.id} value={k.id}>
                {k.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Studio Grid: Video Player on Left, Controls & SEO on Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Video Viewport Player & Controls */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <InteractiveVideoPlayer
            kit={selectedKit}
            script={script || undefined}
            aspectRatio={aspectRatio}
            videoUrl={videoUrl}
            isGenerating={isGeneratingVideo}
            progress={videoProgress}
            phaseText={phaseText}
          />

          {/* Campaign Objective Switcher: Organic YouTube vs Google Ads Creative */}
          <div className="mt-4 flex flex-col sm:flex-row w-full max-w-[680px] items-start sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs gap-2">
            <div className="flex items-center gap-1.5 pl-2">
              <Target className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-slate-300">Objetivo do Roteiro:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setVideoGoal('organic')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  videoGoal === 'organic'
                    ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Youtube className="h-3.5 w-3.5 text-red-500" />
                <span>Vídeo Catálogo (YouTube)</span>
              </button>

              <button
                onClick={() => setVideoGoal('google_ads')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  videoGoal === 'google_ads'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Target className="h-3.5 w-3.5" />
                <span>Anúncio Google Ads (Conversão)</span>
              </button>
            </div>
          </div>

          {/* Aspect Ratio Switcher Bar */}
          <div className="mt-2.5 flex w-full max-w-[680px] items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs">
            <span className="font-semibold text-slate-300 pl-2">Formato do Vídeo:</span>
            <div className="flex gap-2">
              <button
                onClick={() => onSelectRatio('16:9')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  aspectRatio === '16:9'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Youtube className="h-4 w-4" />
                <span>16:9 Landscape (YouTube)</span>
              </button>
              <button
                onClick={() => onSelectRatio('9:16')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  aspectRatio === '9:16'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="h-4 w-4" />
                <span>9:16 Portrait (Shorts)</span>
              </button>
            </div>
          </div>

          {/* Video Actions: Render Veo 3 & Download */}
          <div className="mt-4 flex flex-wrap w-full max-w-[680px] gap-3">
            <button
              onClick={handleStartVeoVideo}
              disabled={isGeneratingVideo}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 py-3 px-4 text-xs font-bold text-slate-950 shadow-lg hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {isGeneratingVideo
                  ? `Renderizando Veo 3 (${videoProgress}%)`
                  : 'Renderizar com Veo 3 (Fast)'}
              </span>
            </button>

            <button
              onClick={() => handleDownloadVideo()}
              disabled={downloadingVideo || isGeneratingVideo}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-3 px-4 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-50 transition-colors"
              title="Baixar vídeo em MP4"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>{downloadingVideo ? 'Baixando...' : 'Baixar MP4'}</span>
            </button>

            <button
              onClick={handleExportYouTubePackage}
              disabled={!script}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-3 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-50 transition-colors"
              title="Baixar pacote completo de títulos, tags e roteiro"
            >
              <FileText className="h-4 w-4 text-cyan-400" />
              <span>Pacote YouTube</span>
            </button>

            {onPrintKit && (
              <button
                onClick={() => onPrintKit(selectedKit)}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-3 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                title="Visualizar Impressão & Salvar em PDF"
              >
                <Printer className="h-4 w-4 text-emerald-400" />
                <span>Imprimir / PDF</span>
              </button>
            )}
          </div>

          {studioMessage && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300 max-w-[680px] w-full">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{studioMessage}</span>
            </div>
          )}
        </div>

        {/* Right Column: AI Script Generator & YouTube SEO Panel */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Script Controls */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div>
              <div className="text-xs font-bold text-white">
                Roteiro & SEO Automático (Gemini 3.8 Flash)
              </div>
              <div className="text-[11px] text-slate-400">
                Sincronizado com os itens técnicos e normas ABNT
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenGoogleAdsPrompt && (
                <button
                  onClick={onOpenGoogleAdsPrompt}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                  title="Ver modelo de prompt e anatomia para anúncios do Google Ads"
                >
                  <Target className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Modelo Google Ads</span>
                  <span className="sm:hidden">Google Ads</span>
                </button>
              )}

              <button
                onClick={() => handleGenerateScript()}
                disabled={isGeneratingScript}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingScript ? 'animate-spin' : ''}`} />
                <span>{isGeneratingScript ? 'Gerando...' : 'Regerar'}</span>
              </button>
            </div>
          </div>

          {/* Script Display Tabs */}
          {script ? (
            <ScriptDisplay
              script={script}
              onUpdateVeoPrompt={(newPrompt) => setCustomVeoPrompt(newPrompt)}
            />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 p-6 text-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin text-amber-400 mb-2" />
              <p className="text-xs">Elaborando roteiro de alta conversão para o YouTube...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
