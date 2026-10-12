import React, { useState, useEffect } from 'react';
import { X, Upload, FileSpreadsheet, Download, Check, AlertCircle, Video, Printer, Plus, Tag } from 'lucide-react';
import { Kit, Segment, ProductItem } from '../types';
import { parseKitsCSV, SAMPLE_CSV_CONTENT } from '../utils/csvParser';

interface ImportKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportKit: (kit: Kit, action?: 'video' | 'pdf' | 'save') => void;
  segments: Segment[];
  onAddSegment: (newSegment: Segment) => void;
}

export const ImportKitModal: React.FC<ImportKitModalProps> = ({
  isOpen,
  onClose,
  onImportKit,
  segments,
  onAddSegment,
}) => {
  if (!isOpen) return null;

  const [csvText, setCsvText] = useState(SAMPLE_CSV_CONTENT);
  const [kitTitle, setKitTitle] = useState('Kit Condomínio - Manutenção & Iluminação');
  const [selectedAudience, setSelectedAudience] = useState<string>('condominio');
  const [category, setCategory] = useState<'eletrico' | 'hidraulico'>('eletrico');
  const [highlight, setHighlight] = useState('Itens de segurança predial, iluminação de emergência e proteção DR NBR 5410');
  const [parsedItems, setParsedItems] = useState<ProductItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');

  // Auto-parse CSV when text changes
  useEffect(() => {
    if (!csvText.trim()) {
      setParsedItems([]);
      setTotalCost(0);
      setParseErrors([]);
      return;
    }

    const res = parseKitsCSV(csvText, kitTitle);
    setParsedItems(res.items);
    setTotalCost(res.totalCost);
    setParseErrors(res.errors);
  }, [csvText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCsvText(content);
        // Clean filename for kit title
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setKitTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleLoadSample = () => {
    setCsvText(SAMPLE_CSV_CONTENT);
    setKitTitle('Kit Condomínio - Manutenção & Iluminação');
    setSelectedAudience('condominio');
    setCategory('eletrico');
    setHighlight('Itens de segurança predial, iluminação de emergência e proteção DR NBR 5410');
  };

  const handleDownloadSample = () => {
    const blob = new Blob(['\uFEFF' + SAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo-planilha-kit-multiluz.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCreateNewSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;

    const segmentId =
      'nicho-' +
      newSegmentName
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const createdSegment: Segment = {
      id: segmentId,
      label: newSegmentName.trim(),
      description: `Materiais e kits especializados para ${newSegmentName.trim()}`,
      isCustom: true,
    };

    onAddSegment(createdSegment);
    setSelectedAudience(createdSegment.id);
    setIsCreatingSegment(false);
    setNewSegmentName('');
  };

  const handleFinalImport = (action: 'video' | 'pdf' | 'save') => {
    if (parsedItems.length === 0) return;

    const currentSegment = segments.find((s) => s.id === selectedAudience);

    const newKit: Kit = {
      id: `imported-kit-${Date.now()}`,
      title: kitTitle.trim() || `Kit Comercial (${parsedItems.length} Itens)`,
      targetAudience: selectedAudience,
      targetAudienceLabel: currentSegment?.label || selectedAudience,
      category,
      description: `Kit comercial técnico importado via planilha com ${parsedItems.length} itens homologados para pronta entrega.`,
      highlight: highlight.trim() || 'Itens selecionados de alto desempenho com conformidade técnica ABNT.',
      image:
        category === 'hidraulico'
          ? '/src/assets/images/kit_hidraulico_predial_1791112179710.jpg'
          : '/src/assets/images/kit_eletrico_condominio_1791112169465.jpg',
      estimatedPrice: totalCost,
      recommendedAspectRatios: ['16:9', '9:16'],
      items: parsedItems,
    };

    onImportKit(newKit, action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Importar Kit via Planilha Excel / CSV</h2>
              <p className="text-xs text-slate-400">
                Compatível com arquivos separados por ponto-e-vírgula (;) ou vírgula (,)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 px-2 py-1 rounded border border-amber-500/30 bg-amber-500/10 transition-colors"
            >
              Carregar Modelo Anexo
            </button>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 rounded border border-slate-700 bg-slate-800 transition-colors"
              title="Baixar modelo .csv"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar Modelo</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Kit Details Configuration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Kit
              </label>
              <input
                type="text"
                value={kitTitle}
                onChange={(e) => setKitTitle(e.target.value)}
                placeholder="Ex: Kit Manutenção Predial 2026"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Segmento de Aplicação
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingSegment(!isCreatingSegment)}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                >
                  {isCreatingSegment ? 'Cancelar' : '+ Novo Nicho'}
                </button>
              </div>

              {!isCreatingSegment ? (
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                >
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.label}
                    </option>
                  ))}
                </select>
              ) : (
                <form onSubmit={handleCreateNewSegment} className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Nome do nicho..."
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    className="flex-1 rounded border border-amber-500/40 bg-slate-950 px-2 py-1 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded bg-amber-500 px-2.5 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400"
                  >
                    OK
                  </button>
                </form>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria Principal
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="eletrico">Material Elétrico & Iluminação</option>
                <option value="hidraulico">Material Hidráulico & Tubulações</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Destaque Comercial (usado no Roteiro do YouTube)
            </label>
            <input
              type="text"
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="Ex: Normas ABNT, pronta entrega e desconto para condomínios"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Upload Area & Text Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Conteúdo CSV / Excel (Copiar e Colar ou Carregar Arquivo):
              </label>
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
                <Upload className="h-3.5 w-3.5" />
                <span>Escolher Arquivo .csv</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              rows={6}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Cole aqui o conteúdo da sua planilha com colunas separadas por ponto-e-vírgula ou vírgula..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-[11px] text-slate-300 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Live Parsing Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Itens Detectados ({parsedItems.length})
                </span>
                {parsedItems.length > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <Check className="h-3.5 w-3.5" /> Planilha válida
                  </span>
                )}
              </div>

              <div className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                Custo Total Calculado: R${' '}
                {totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {parsedItems.length > 0 ? (
              <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 sticky top-0 text-[11px]">
                      <th className="py-2 px-3">Cód.</th>
                      <th className="py-2 px-3">Produto</th>
                      <th className="py-2 px-3">Fornecedor</th>
                      <th className="py-2 px-3">Qtd</th>
                      <th className="py-2 px-3">Observação / Aplicação</th>
                      <th className="py-2 px-3 text-right">Custo (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                    {parsedItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="py-1.5 px-3 font-mono text-slate-500">{item.code || idx + 1}</td>
                        <td className="py-1.5 px-3 font-medium text-white">{item.name}</td>
                        <td className="py-1.5 px-3 text-slate-400">{item.supplier || '-'}</td>
                        <td className="py-1.5 px-3 font-mono tabular-nums">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-1.5 px-3 text-slate-400 truncate max-w-xs">{item.spec}</td>
                        <td className="py-1.5 px-3 text-right font-mono text-amber-300 tabular-nums">
                          R$ {item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">
                Nenhum produto identificado. Cole o conteúdo da planilha no formato CSV acima ou clique em "Carregar Modelo Anexo".
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 bg-slate-950 px-6 py-4 gap-3">
          <div className="text-xs text-slate-400">
            {parsedItems.length > 0 ? (
              <span>Pronto para exportar PDF ou gerar vídeo com Veo 3</span>
            ) : (
              <span>Insira uma planilha válida para continuar</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              disabled={parsedItems.length === 0}
              onClick={() => handleFinalImport('save')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              Salvar no Catálogo
            </button>

            <button
              type="button"
              disabled={parsedItems.length === 0}
              onClick={() => handleFinalImport('pdf')}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Importar & Imprimir PDF</span>
            </button>

            <button
              type="button"
              disabled={parsedItems.length === 0}
              onClick={() => handleFinalImport('video')}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow disabled:opacity-50 transition-colors"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Importar & Gerar Vídeo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
