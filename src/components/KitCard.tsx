import React from 'react';
import { Video, Sliders, CheckCircle2, Zap, Droplets, Printer } from 'lucide-react';
import { Kit } from '../types';

interface KitCardProps {
  kit: Kit;
  onSelectForVideo: (kit: Kit) => void;
  onEditKit: (kit: Kit) => void;
  onPrintKit?: (kit: Kit) => void;
}

export const KitCard: React.FC<KitCardProps> = ({
  kit,
  onSelectForVideo,
  onEditKit,
  onPrintKit,
}) => {
  const isEletrico = kit.category === 'eletrico';
  const audienceLabel =
    kit.targetAudienceLabel ||
    (kit.targetAudience === 'condominio'
      ? 'Condomínios'
      : kit.targetAudience === 'residencia'
      ? 'Residências'
      : kit.targetAudience === 'empresa'
      ? 'Empresas & Indústria'
      : kit.targetAudience);

  const categoryLabel = isEletrico ? 'Material Elétrico' : 'Material Hidráulico';

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-slate-700 hover:shadow-xl">
      <div>
        {/* Image Container with Fallback */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
          <img
            src={kit.image}
            alt={kit.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLElement;
              target.style.display = 'none';
            }}
          />

          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-slate-950 text-slate-700">
            {isEletrico ? <Zap className="h-12 w-12" /> : <Droplets className="h-12 w-12" />}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Category marker */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded bg-slate-950/80 px-2 py-1 text-[11px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-800">
            {isEletrico ? (
              <Zap className="h-3 w-3 text-amber-400" />
            ) : (
              <Droplets className="h-3 w-3 text-cyan-400" />
            )}
            <span>{categoryLabel}</span>
          </div>

          {/* Audience marker */}
          <div className="absolute top-3 right-3 rounded bg-slate-950/80 px-2 py-1 font-mono text-[11px] text-slate-400 backdrop-blur-sm border border-slate-800">
            {audienceLabel}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span>{kit.items.length} itens inclusos</span>
            <span aria-hidden="true">·</span>
            <span>ABNT Certificado</span>
            <span aria-hidden="true">·</span>
            <span>YouTube 16:9 & 9:16</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
            {kit.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-300">
            {kit.description}
          </p>

          <div className="mt-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 text-xs text-slate-400">
            <span className="font-semibold text-amber-400">Destaque: </span>
            {kit.highlight}
          </div>

          {/* Key items list */}
          <div className="mt-4 space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Itens do Kit no Roteiro:
            </div>
            {kit.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-white font-medium">{item.quantity}x</strong> {item.name}
                </span>
              </div>
            ))}
            {kit.items.length > 3 && (
              <div className="text-[11px] text-slate-400 pl-5">
                + {kit.items.length - 3} outros materiais técnicos
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="border-t border-slate-800/80 bg-slate-950/40 p-5 pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-slate-400">Valor Estimado do Kit:</span>
          <span className="font-mono text-base font-bold text-white tabular-nums">
            R$ {kit.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onPrintKit && (
            <button
              onClick={() => onPrintKit(kit)}
              className="flex items-center justify-center p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Visualizar Impressão & Salvar PDF"
            >
              <Printer className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={() => onEditKit(kit)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 py-2 px-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Editar</span>
          </button>

          <button
            onClick={() => onSelectForVideo(kit)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 py-2 px-2 text-xs font-bold text-slate-950 shadow transition-all hover:bg-amber-400 active:scale-95"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Gerar Vídeo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
