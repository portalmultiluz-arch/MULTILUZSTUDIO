import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldCheck, Zap, Droplets, Tag, Check, Sparkles } from 'lucide-react';
import { Kit, ProductItem, TargetAudience, KitCategory, Segment } from '../types';

interface KitCustomizerModalProps {
  kit: Kit | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveKit: (updatedKit: Kit) => void;
  segments: Segment[];
  onAddSegment: (newSegment: Segment) => void;
}

export const KitCustomizerModal: React.FC<KitCustomizerModalProps> = ({
  kit,
  isOpen,
  onClose,
  onSaveKit,
  segments,
  onAddSegment,
}) => {
  if (!isOpen || !kit) return null;

  const [title, setTitle] = useState(kit.title);
  const [description, setDescription] = useState(kit.description);
  const [targetAudience, setTargetAudience] = useState<TargetAudience>(kit.targetAudience);
  const [category, setCategory] = useState<KitCategory>(kit.category);
  const [highlight, setHighlight] = useState(kit.highlight);
  const [items, setItems] = useState<ProductItem[]>([...kit.items]);

  // New segment creation state
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDesc, setNewSegmentDesc] = useState('');

  // Form for new item
  const [newItemName, setNewItemName] = useState('');
  const [newItemSpec, setNewItemSpec] = useState('');
  const [newItemNorma, setNewItemNorma] = useState('NBR 5410');
  const [newItemUnit, setNewItemUnit] = useState('peças');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(50);

  const handleCreateNewSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;

    // Generate safe id from name
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
      description: newSegmentDesc.trim() || `Materiais e kits especializados para ${newSegmentName.trim()}`,
      isCustom: true,
    };

    onAddSegment(createdSegment);
    setTargetAudience(createdSegment.id);
    setIsCreatingSegment(false);
    setNewSegmentName('');
    setNewSegmentDesc('');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ProductItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      category: category === 'hidraulico' ? 'hidraulico' : 'eletrico',
      spec: newItemSpec.trim() || 'Especificação padrão de engenharia',
      norma: newItemNorma.trim() || 'NBR ABNT',
      unit: newItemUnit.trim() || 'un',
      quantity: Number(newItemQuantity) || 1,
      unitPrice: Number(newItemPrice) || 0,
    };

    setItems([...items, newItem]);
    setNewItemName('');
    setNewItemSpec('');
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const totalPrice = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  const currentSegment = segments.find((s) => s.id === targetAudience);

  const handleSave = () => {
    onSaveKit({
      ...kit,
      title,
      description,
      targetAudience,
      targetAudienceLabel: currentSegment?.label || targetAudience,
      category,
      highlight,
      items,
      estimatedPrice: totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">Editar Especificações do Kit</h2>
            <p className="text-xs text-slate-400">
              Personalize o kit, materiais, normas e segmente por nichos comerciais
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Basic Info & Segment */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nome do Kit Comercial
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Segment with New Niche option */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Segmento de Aplicação / Nicho
                </label>
                <button
                  type="button"
                  onClick={() => setIsCreatingSegment(!isCreatingSegment)}
                  className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  <span>{isCreatingSegment ? 'Cancelar' : '+ Novo Nicho'}</span>
                </button>
              </div>

              {!isCreatingSegment ? (
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  {segments.map((seg) => (
                    <option key={seg.id} value={seg.id}>
                      {seg.label} {seg.isCustom ? '★ (Personalizado)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <form
                  onSubmit={handleCreateNewSegment}
                  className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 space-y-2"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Cadastrar Novo Segmento de Aplicação</span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ex: Agronegócio & Irrigação, Hospitalar..."
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      O nicho será adicionado aos filtros do catálogo e vídeos
                    </span>
                    <button
                      type="submit"
                      disabled={!newSegmentName.trim()}
                      className="rounded bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                    >
                      Criar Nicho
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoria do Kit
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('eletrico')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    category === 'eletrico'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="h-4 w-4 text-amber-400" />
                  <span>Material Elétrico</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('hidraulico')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    category === 'hidraulico'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Droplets className="h-4 w-4 text-cyan-400" />
                  <span>Material Hidráulico</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Destaque Comercial no Roteiro
              </label>
              <input
                type="text"
                value={highlight}
                onChange={(e) => setHighlight(e.target.value)}
                placeholder="Ex: Cabos 100% Cobre e Válvulas NBR 5626"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descrição do Kit para o Vídeo
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Items List */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">Lista de Materiais Inclusos ({items.length})</h3>
              <span className="font-mono text-xs text-amber-400 tabular-nums">
                Total Estimado: R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200"
                >
                  <div className="flex-1 pr-3">
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-slate-400 text-[11px]">
                      {item.spec} · <span className="text-emerald-400">{item.norma}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center rounded border border-slate-700 bg-slate-900">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-slate-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-mono text-[11px] text-slate-400 w-16 text-right tabular-nums">
                      R$ {(item.quantity * item.unitPrice).toFixed(0)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddItem} className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>Adicionar Produto ao Kit</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mb-2">
              <input
                type="text"
                placeholder="Nome do produto (ex: Disjuntor 32A)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Especificação técnica"
                value={newItemSpec}
                onChange={(e) => setNewItemSpec(e.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Norma ABNT (ex: NBR 5410)"
                value={newItemNorma}
                onChange={(e) => setNewItemNorma(e.target.value)}
                className="rounded border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Qtd"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  className="w-16 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Preço R$"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-24 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!newItemName.trim()}
                className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                + Adicionar Item
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Valores e normas serão inseridos no roteiro do YouTube</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow transition-colors"
            >
              Salvar Kit & Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
