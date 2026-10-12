import React, { useState } from 'react';
import { X, Copy, Check, Download, Video, Sparkles, Target, Zap, ShieldAlert, TrendingUp } from 'lucide-react';
import { Kit } from '../types';
import { RAW_GOOGLE_ADS_PROMPT_TEMPLATE, GOOGLE_ADS_STRATEGY_INFO } from '../data/googleAdsPromptTemplate';

interface GoogleAdsPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeKit: Kit;
  onApplyForGoogleAds: (kit: Kit) => void;
}

export const GoogleAdsPromptModal: React.FC<GoogleAdsPromptModalProps> = ({
  isOpen,
  onClose,
  activeKit,
  onApplyForGoogleAds,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Customize prompt template with current kit info
  const customizedPrompt = RAW_GOOGLE_ADS_PROMPT_TEMPLATE
    .replace('{NOME_DO_KIT}', activeKit.title)
    .replace('{PUBLICO_ALVO}', activeKit.targetAudienceLabel || activeKit.targetAudience)
    .replace(
      '{LISTA_DE_ITENS_E_MARCAS}',
      activeKit.items.slice(0, 5).map((i) => `${i.quantity}x ${i.name} (${i.supplier || 'ABNT'})`).join(', ')
    )
    .replace('{FORMATO_16x9_OU_9x16_SHORTS}', 'YouTube Video Ads (16:9) e YouTube Shorts Ads (9:16)');

  const handleCopy = () => {
    navigator.clipboard.writeText(customizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([customizedPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-google-ads-${activeKit.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Criativo de Alta Conversão para Google Ads</h2>
                <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  YouTube Ads & Shorts
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Estratégia de 30 segundos com gancho anti-pular anúncio e CTA comercial para o Portal Multi Luz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar Prompt'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              title="Baixar arquivo .md"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Baixar Prompt</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Strategy Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-1">
                <span>1. Gancho (0s - 5s)</span>
                <ShieldAlert className="h-4 w-4" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Antes do botão <em>"Pular Anúncio"</em>: fisgar com a dor do síndico que perde horas cotando ou corre risco no laudo do bombeiro.
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                <span>2. A Dor (5s - 12s)</span>
                <Zap className="h-4 w-4" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Mostrar o perigo de disjuntores que desarmam sem DR, luzes de emergência fracas e peças paralelas fora da NBR 5410.
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                <span>3. Solução (12s - 22s)</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                O <strong>{activeKit.title}</strong>: marcas consolidadas (GE, Segurimax, Intelbras), custo fechado em planilha e entrega rápida.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                <span>4. CTA (22s - 30s)</span>
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Chamada direta para ação: <em>"Clique no link do anúncio para receber a tabela de preços no WhatsApp do Portal Multi Luz."</em>
              </p>
            </div>
          </div>

          {/* Prompt Content View */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="text-xs font-bold text-slate-200">
                Modelo de Prompt Customizado para o Kit Atual:
              </div>
              <span className="font-mono text-[10px] text-amber-400">
                Pronto para uso no Gemini 3.8 Flash e Veo 3
              </span>
            </div>

            <pre className="whitespace-pre-wrap font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-80 select-all">
              {customizedPrompt}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4">
          <div className="text-xs text-slate-400">
            Deseja renderizar este anúncio comercial agora no estúdio com IA?
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>

            <button
              onClick={() => {
                onClose();
                onApplyForGoogleAds(activeKit);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-bold text-slate-950 shadow hover:from-amber-400 hover:to-amber-300 transition-all active:scale-95"
            >
              <Video className="h-4 w-4" />
              <span>Gerar Anúncio no Estúdio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
