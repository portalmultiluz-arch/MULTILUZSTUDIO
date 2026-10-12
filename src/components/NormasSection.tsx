import React from 'react';
import { ShieldAlert, BookOpen, CheckCircle, Zap, Droplets } from 'lucide-react';

export const NormasSection: React.FC = () => {
  return (
    <section id="normas-abnt" className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>Engenharia & Conformidade</span>
              <span aria-hidden="true">·</span>
              <span>Segurança Certificada</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Normas Técnicas Obrigatórias nos Roteiros
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Todos os roteiros e vídeos gerados citam as exigências legais vigentes para conferir autoridade técnica aos vídeos do seu canal no YouTube.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card 1: NBR 5410 Elétrica */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ABNT NBR 5410: Instalações Elétricas de Baixa Tensão</h3>
                <span className="text-[11px] text-amber-400 font-mono">Regulamentação e NR-10</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              A norma exige o dimensionamento correto da bitola dos condutores de cobre antichama, uso obrigatório de Dispositivos DR (Diferencial Residual) de 30mA em áreas molhadas e DPS (Dispositivo de Proteção contra Surtos) contra descargas atmosféricas.
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Condomínios: Barramentos blindados e quadros gerais com isolamento classe 2.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Residencial: Divisão mínima de circuitos para chuveiros, tomadas e iluminação.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Indústrias: Proteção térmica para motores trifásicos com relés de sobrecarga.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: NBR 5626 Hidráulica */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ABNT NBR 5626: Sistemas Prediais de Água Fria e Quente</h3>
                <span className="text-[11px] text-cyan-400 font-mono">Pressão e Estanqueidade</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Estabelece as condições de projeto e montagem de tubulações de PVC soldável e PPR termofusão, limitando a velocidade da água para evitar ruídos de golpe de aríete e garantindo estanqueidade perfeita sob pressão.
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Condomínios: Registros de gaveta de bronze de alta vazão no barrilete.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Residencial: Caixas sifonadas antiodor com fecho hídrico contra gases de esgoto.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Indústrias: Caixas separadoras de gordura e tubulações série reforçada (SR).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
