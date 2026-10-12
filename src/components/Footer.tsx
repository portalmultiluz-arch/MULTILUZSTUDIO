import React from 'react';
import { Mail, Youtube, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="sobre-portal" className="border-t border-slate-800 bg-slate-950 py-10 text-xs text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500 font-mono text-xs font-bold text-slate-950">
                ML
              </span>
              <span className="text-base font-bold text-white">MultiLuz Studio</span>
            </div>
            <p className="max-w-md text-slate-400 leading-relaxed">
              Plataforma de criação de vídeos comerciais para canais de YouTube e Shorts, gerando kits integrados de materiais elétricos e hidráulicos para condomínios, residências e empresas com Veo 3 e Gemini 3.8 Flash.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Contato & Suporte</h4>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4 text-amber-400" />
              <span>portalmultiluz@gmail.com</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Atendimento para televendas, cotações corporativas e parcerias com instaladores.
            </p>
          </div>

          {/* YouTube specs */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Formatos Suportados</h4>
            <ul className="space-y-1 text-slate-400">
              <li>16:9 Landscape (1920x1080)</li>
              <li>9:16 Shorts Vertical (1080x1920)</li>
              <li>Modelo Veo: veo-3.1-fast-generate-preview</li>
              <li>Roteiros: Gemini 3.8 Flash</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Portal Multi Luz. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <span>Conformidade ABNT NBR 5410 & NBR 5626</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
