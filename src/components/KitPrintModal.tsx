import React from 'react';
import { X, Printer, Download, Video, ShieldCheck, Mail, FileSpreadsheet } from 'lucide-react';
import { Kit } from '../types';
import { exportKitToCSV } from '../utils/csvParser';

interface KitPrintModalProps {
  kit: Kit | null;
  isOpen: boolean;
  onClose: () => void;
  onGenerateVideoFromKit: (kit: Kit) => void;
}

export const KitPrintModal: React.FC<KitPrintModalProps> = ({
  kit,
  isOpen,
  onClose,
  onGenerateVideoFromKit,
}) => {
  if (!isOpen || !kit) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent = exportKitToCSV(kit);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kit-${kit.id}-multiluz.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const audienceLabel =
    kit.targetAudienceLabel ||
    (kit.targetAudience === 'condominio'
      ? 'Condomínios & Manutenção Predial'
      : kit.targetAudience === 'residencia'
      ? 'Residencial & Reformas'
      : kit.targetAudience === 'empresa'
      ? 'Empresas & Indústrias'
      : kit.targetAudience);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:text-black">
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-amber-500 font-mono text-xs font-bold text-slate-950">
              ML
            </span>
            <div>
              <h2 className="text-sm font-bold text-white">Visualização de Impressão & PDF</h2>
              <p className="text-[11px] text-slate-400">
                Ficha Técnica Comercial e Orçamento Oficial do Kit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              title="Baixar planilha CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onGenerateVideoFromKit(kit);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Gerar Vídeo</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div
          id="printable-kit-document"
          className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-900 text-slate-100 print:bg-white print:text-slate-900 print:p-0 print:overflow-visible font-sans"
        >
          {/* Document Header */}
          <div className="border-b border-slate-700 print:border-slate-300 pb-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-500 font-mono text-sm font-extrabold text-slate-950 print:bg-slate-900 print:text-white">
                    ML
                  </span>
                  <span className="text-xl font-bold tracking-tight text-white print:text-slate-950">
                    PORTAL MULTI LUZ
                  </span>
                </div>
                <p className="text-xs text-slate-400 print:text-slate-600">
                  Distribuidora de Materiais Elétricos, Hidráulicos e Iluminação Profissional
                </p>
                <p className="text-[11px] text-slate-400 print:text-slate-500 mt-0.5">
                  Contato Comercial: portalmultiluz@gmail.com · Emissão em {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="inline-block rounded bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-300 print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                  FICHA TÉCNICA DO KIT
                </span>
                <div className="text-xs font-mono text-slate-400 print:text-slate-600 mt-1">
                  REF: ML-KIT-{kit.id.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Kit Title & Segment info */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/60 p-4 print:border-slate-300 print:bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white print:text-slate-950">
                  {kit.title}
                </h1>
                <div className="font-mono text-base sm:text-lg font-bold text-amber-400 print:text-slate-900 tabular-nums">
                  Custo Total: R$ {kit.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300 print:text-slate-700">
                <span>
                  <strong>Segmento:</strong> {audienceLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>Categoria:</strong> {kit.category === 'eletrico' ? 'Material Elétrico' : 'Material Hidráulico'}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>Total de Itens:</strong> {kit.items.length} itens cadastrados
                </span>
              </div>

              {kit.highlight && (
                <div className="mt-2 text-xs text-slate-400 print:text-slate-600">
                  <strong>Destaque de Engenharia:</strong> {kit.highlight}
                </div>
              )}
            </div>
          </div>

          {/* Product Items Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
              Composição de Materiais e Equipamentos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 print:border-slate-300 bg-slate-950/80 print:bg-slate-100 text-slate-300 print:text-slate-700">
                    <th className="py-2.5 px-3 font-semibold">Cód.</th>
                    <th className="py-2.5 px-3 font-semibold">Descrição do Produto</th>
                    <th className="py-2.5 px-3 font-semibold">Marca / Fornecedor</th>
                    <th className="py-2.5 px-3 font-semibold">Qtd / Emb.</th>
                    <th className="py-2.5 px-3 font-semibold">Especificação / Aplicação</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Valor Unit.</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                  {kit.items.map((item, idx) => {
                    const subtotal = item.quantity * item.unitPrice;
                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400 print:text-slate-600">
                          {item.code || String(idx + 1).padStart(3, '0')}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-white print:text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 print:text-slate-600">
                          {item.supplier || '-'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-300 print:text-slate-800 tabular-nums">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 print:text-slate-600 text-[11px] max-w-xs">
                          {item.spec}
                          {item.norma && (
                            <span className="block text-[10px] text-emerald-400 print:text-emerald-700">
                              Norma: {item.norma}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-300 print:text-slate-800 tabular-nums">
                          R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-white print:text-slate-900 tabular-nums">
                          R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-700 print:border-slate-400 font-bold bg-slate-950/60 print:bg-slate-100">
                    <td colSpan={5} className="py-3 px-3 text-right text-xs uppercase tracking-wider text-slate-300 print:text-slate-800">
                      Custo Total do Kit:
                    </td>
                    <td colSpan={2} className="py-3 px-3 text-right font-mono text-sm text-amber-400 print:text-slate-950 tabular-nums">
                      R$ {kit.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Technical Compliance & Commercial Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 print:border-slate-300 pt-6 text-xs text-slate-400 print:text-slate-600">
            <div className="rounded-lg border border-slate-800 print:border-slate-300 p-3 bg-slate-950/40 print:bg-transparent">
              <h4 className="font-bold text-white print:text-slate-900 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 print:text-emerald-700" />
                <span>Conformidade ABNT & Segurança</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                Materiais elétricos certificados de acordo com a norma ABNT NBR 5410 e componentes hidráulicos em conformidade com a ABNT NBR 5626. Todos os produtos possuem garantia de fábrica e selo de procedência.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 print:border-slate-300 p-3 bg-slate-950/40 print:bg-transparent">
              <h4 className="font-bold text-white print:text-slate-900 mb-1 flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-amber-400 print:text-slate-900" />
                <span>Condições Comerciais & Pedidos</span>
              </h4>
              <p className="text-[11px] leading-relaxed">
                Validade da proposta técnica: 15 dias. Valores sujeitos a disponibilidade de estoque. Para pedidos com entrega agendada e condições para construtoras e condomínios, consulte portalmultiluz@gmail.com.
              </p>
            </div>
          </div>

          {/* Print Footer */}
          <div className="mt-8 text-center text-[10px] text-slate-400 print:text-slate-500 border-t border-slate-800 print:border-slate-300 pt-3">
            Portal Multi Luz · Gerado automaticamente pelo MultiLuz Studio com IA Veo 3 e Gemini 3.8 Flash
          </div>
        </div>
      </div>
    </div>
  );
};
