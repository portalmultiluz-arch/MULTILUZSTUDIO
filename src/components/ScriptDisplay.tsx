import React, { useState } from 'react';
import { Copy, Check, Youtube, Hash, Volume2, Sparkles, Film, ChevronRight } from 'lucide-react';
import { GeneratedScript } from '../types';

interface ScriptDisplayProps {
  script: GeneratedScript;
  onUpdateVeoPrompt?: (newPrompt: string) => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({
  script,
  onUpdateVeoPrompt,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'youtube' | 'spoken' | 'scenes' | 'veo'>('youtube');
  const [veoPromptText, setVeoPromptText] = useState(script.veoPrompt || '');

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-3 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'youtube'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Youtube className="h-4 w-4" />
          <span>Metadados YouTube & SEO</span>
        </button>

        <button
          onClick={() => setActiveTab('spoken')}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'spoken'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Volume2 className="h-4 w-4" />
          <span>Roteiro de Locução (Voice-over)</span>
        </button>

        <button
          onClick={() => setActiveTab('scenes')}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'scenes'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="h-4 w-4" />
          <span>Storyboard por Cenas ({script.scenes?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('veo')}
          className={`flex items-center gap-1.5 pb-3 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'veo'
              ? 'border-amber-400 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Prompt Veo 3 (Cinematográfico)</span>
        </button>
      </div>

      <div className="p-6">
        {/* Tab 1: YouTube SEO & Metadata */}
        {activeTab === 'youtube' && (
          <div className="space-y-5">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  Título Otimizado para YouTube (CTR)
                </span>
                <button
                  onClick={() => copyToClipboard(script.youtubeTitle, 'title')}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300"
                >
                  {copiedField === 'title' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Título</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-medium text-sm text-white">
                {script.youtubeTitle}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300">
                  Descrição Completa Formatada (com Timestamps e Links)
                </span>
                <button
                  onClick={() => copyToClipboard(script.youtubeDescription, 'desc')}
                  className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300"
                >
                  {copiedField === 'desc' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Descrição</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
                {script.youtubeDescription}
              </div>
            </div>

            {/* Tags & Hashtags */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Hashtags</span>
                  <button
                    onClick={() => copyToClipboard(script.hashtags.join(' '), 'hash')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    {copiedField === 'hash' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-2.5">
                  {script.hashtags.map((h, i) => (
                    <span key={i} className="text-xs font-mono text-cyan-400">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Tags de Busca</span>
                  <button
                    onClick={() => copyToClipboard(script.tags.join(', '), 'tags')}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                  >
                    {copiedField === 'tags' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-400 font-mono line-clamp-3">
                  {script.tags.join(', ')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spoken Voice-Over Script */}
        {activeTab === 'spoken' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Texto de Locução Profissional</h4>
                <p className="text-[11px] text-slate-400">
                  Pronto para gravação humana ou locução sintética sincronizada com o Veo 3
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeak(script.spokenScript)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition-colors"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Ouvir Locução</span>
                </button>

                <button
                  onClick={() => copyToClipboard(script.spokenScript, 'spoken')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  {copiedField === 'spoken' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copiar Roteiro</span>
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-relaxed text-slate-200 font-sans">
              "{script.spokenScript}"
            </div>
          </div>
        )}

        {/* Tab 3: Scenes Breakdown */}
        {activeTab === 'scenes' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 mb-2">
              Estrutura temporal da cena para corte de vídeo e animação dos materiais:
            </div>
            {script.scenes.map((scene, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-amber-400 rounded bg-slate-900 border border-slate-800 px-2 py-1 shrink-0">
                    {scene.time}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">{scene.title}</div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {scene.visualDescription}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-amber-200/80 sm:w-1/3 italic border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-3">
                  "{scene.narration}"
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Veo 3 Video Prompt */}
        {activeTab === 'veo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Prompt Cinematográfico do Veo 3</h4>
                <p className="text-[11px] text-slate-400">
                  Instruções em inglês enviadas diretamente para a API do modelo Veo 3
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(veoPromptText, 'veo')}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                {copiedField === 'veo' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copiar Prompt</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={veoPromptText}
              onChange={(e) => {
                setVeoPromptText(e.target.value);
                if (onUpdateVeoPrompt) {
                  onUpdateVeoPrompt(e.target.value);
                }
              }}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-300 focus:border-amber-500 focus:outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
