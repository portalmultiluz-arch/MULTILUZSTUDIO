import { ProductItem, Kit } from '../types';

export const SAMPLE_CSV_CONTENT = `Componente do Kit;Código;Produto;Fornecedor;Embalagem;Observação;Custo (R$)
Luminária de emergência;7497;LUMINÁRIA DE EMERGÊNCIA 30 LEDS;SEGURIMAX;1 un.;30 LEDs - corredores e escadas, entra em ação em queda de energia;R$ 19,50
Disjuntor DR (proteção contra choque);7381;DISJUNTOR DIFERENCIAL - DR 2 MÓDULOS 30MA 230V 40A;GE;1 un.;DR 2 módulos 30mA 230V 40A - área comum/casa de máquinas;R$ 156,00
;4245;DISJUNTOR DIFERENCIAL - DR 2 MÓDULOS 30MA 230V 63A;GE;1 un.;DR 2 módulos 30mA 230V 63A - opção maior amperagem;R$ 189,00
Quadro de distribuição;4711;QUADRO DE DISTRIBUIÇÃO DE EMBUTIR PVC P/12 DISJ. AME / 16 DISJ. DIN;BIKI;1 un.;Embutir PVC p/12 disjuntores americanos ou 16 DIN - reforço/expansão do quadro;R$ 62,20
Refletor de LED (área externa/garagem);7047;REFLETOR DE LED 50W BIVOLT FLUXO LUMINOSO = 4.000 LUMENS(LM);DIVERSOS;1 un.;50W bivolt, 4.000 lumens;R$ 21,80
;7048;REFLETOR DE LED 100W BIVOLT PT FLUXO LUMINOSO = 8.000 LUMENS(LM);DIVERSOS;1 un.;100W bivolt, 8.000 lumens - áreas maiores;R$ 36,60
Escada de alumínio;7125;ESCADA RESIDENCIAL DE ALUMÍNIO C/5 DEGRAUS;ALUMASA;1 un.;5 degraus - manutenção de luminárias e áreas altas;R$ 209,80
;7126;ESCADA RESIDENCIAL DE ALUMÍNIO C/7 DEGRAUS;ALUMASA;1 un.;7 degraus - opção para pé-direito maior;R$ 299,00
Placas de sinalização;5261/6703;"PLACA SINALIZAÇÃO ALUMÍNIO ""SAÍDA"" OU ""PROIBIDO USO DE CELULAR""";SINALIZE;1 un.;"""Saída"" ou ""Proibido uso de celular""";R$ 22,20
;4497;"PLACA SINALIZAÇÃO ALUMÍNIO ""NÃO ESTACIONE"" (DIA/NOITE)";SINALIZE;1 un.;"""Não estacione"" (dia/noite)";R$ 34,70
;6629/4495;"PLACA SINALIZAÇÃO ALUMÍNIO ""DEFICIENTE FÍSICO"" OU ""EMPURRE"" - ""PUXE""";SINALIZE;1 un.;"""Deficiente Físico"" ou ""Empurre/Puxe"" - acessibilidade";R$ 25,90
Fita zebrada (isolamento de área);6936;FITA ZEBRADA AMARELA C/PRETA 65MM x 150MTS S/ADESIVO;BRASFORT;1 un.;Amarela/preta 65mm x 150m - sinalizar manutenção/obra em andamento;R$ 15,60
Alicate amperímetro (ferramenta técnica);3434;ALICATE AMPERÍMETRO DIGITAL C/BATERIA;FERTAK;1 un.;Digital c/bateria - diagnóstico elétrico preventivo;R$ 65,80
Bateria selada (backup de portão/cerca elétrica);8108;BATERIA SELADA P/CERCA ELÉTRICA/NOOBREAK 12V 9AH INTELBRAS;INTELBRAS;1 un.;12V 9AH - autonomia do portão eletrônico em queda de energia;R$ 186,50
CUSTO BASE DO KIT (1ª opção de cada item);;;;;;R$ 759,40`;

/**
 * Robust CSV Line Parser that handles quotes, escaped quotes, semicolons and commas
 */
function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Detect delimiter: semicolon, comma, or tab
 */
function detectDelimiter(text: string): string {
  const firstLine = text.split('\n')[0] || '';
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const tabs = (firstLine.match(/\t/g) || []).length;

  if (semicolons >= commas && semicolons >= tabs) return ';';
  if (tabs > commas) return '\t';
  return ',';
}

/**
 * Parse Brazilian or US currency string into float
 * e.g. "R$ 19,50" -> 19.50, "156.00" -> 156.00
 */
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  // Clean currency symbols and spaces
  let cleaned = priceStr.replace(/[R$\s]/g, '').trim();
  if (!cleaned) return 0;

  // If contains comma as decimal separator
  if (cleaned.includes(',') && !cleaned.includes('.')) {
    cleaned = cleaned.replace(',', '.');
  } else if (cleaned.includes('.') && cleaned.includes(',')) {
    // format like 1.234,56
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  }

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse quantity string
 * e.g. "1 un.", "2 peças", "50"
 */
function parseQuantity(qtyStr: string): { quantity: number; unit: string } {
  if (!qtyStr) return { quantity: 1, unit: 'un.' };

  const match = qtyStr.match(/^(\d+[\.,]?\d*)\s*(.*)$/);
  if (match) {
    const qty = parseFloat(match[1].replace(',', '.'));
    const unit = match[2].trim() || 'un.';
    return { quantity: isNaN(qty) ? 1 : qty, unit };
  }

  return { quantity: 1, unit: qtyStr.trim() || 'un.' };
}

export interface ParseResult {
  items: ProductItem[];
  totalCost: number;
  detectedKitTitle: string;
  errors: string[];
}

export function parseKitsCSV(csvContent: string, defaultKitTitle?: string): ParseResult {
  const errors: string[] = [];
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      items: [],
      totalCost: 0,
      detectedKitTitle: defaultKitTitle || 'Kit Importado',
      errors: ['Arquivo CSV vazio ou sem linhas válidas.'],
    };
  }

  const delimiter = detectDelimiter(csvContent);
  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine, delimiter).map((h) =>
    h
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '')
  );

  // Map header indexes
  let colComponente = headers.findIndex((h) => h.includes('componente') || h.includes('categoria') || h.includes('grupo'));
  let colCodigo = headers.findIndex((h) => h.includes('codigo') || h.includes('cod') || h.includes('ref'));
  let colProduto = headers.findIndex((h) => h.includes('produto') || h.includes('descricao') || h.includes('item') || h.includes('nome'));
  let colFornecedor = headers.findIndex((h) => h.includes('fornecedor') || h.includes('marca') || h.includes('fabricante'));
  let colEmbalagem = headers.findIndex((h) => h.includes('embalagem') || h.includes('unidade') || h.includes('qtd') || h.includes('quantidade'));
  let colObservacao = headers.findIndex((h) => h.includes('observacao') || h.includes('especificacao') || h.includes('obs') || h.includes('detalhe'));
  let colCusto = headers.findIndex((h) => h.includes('custo') || h.includes('preco') || h.includes('valor') || h.includes('total'));

  // Default mappings if headers weren't found
  if (colProduto === -1) colProduto = 2 < headers.length ? 2 : 0;
  if (colCodigo === -1 && headers.length > 1) colCodigo = 1;
  if (colCusto === -1 && headers.length > 6) colCusto = 6;

  const items: ProductItem[] = [];
  let lastComponente = '';

  for (let i = 1; i < lines.length; i++) {
    const rawCols = parseCsvLine(lines[i], delimiter);

    // Skip empty lines
    if (rawCols.every((c) => !c)) continue;

    // Check if this is a total or summary line (e.g. "CUSTO BASE DO KIT...")
    const fullLineLower = lines[i].toLowerCase();
    if (
      fullLineLower.includes('custo base') ||
      fullLineLower.includes('total do kit') ||
      fullLineLower.includes('valor total')
    ) {
      continue;
    }

    const componente = colComponente >= 0 ? rawCols[colComponente] || '' : '';
    if (componente) {
      lastComponente = componente;
    }

    const produto = colProduto >= 0 ? rawCols[colProduto] || '' : '';
    // If there is no product name, skip
    if (!produto) continue;

    const codigo = colCodigo >= 0 ? rawCols[colCodigo] || '' : '';
    const fornecedor = colFornecedor >= 0 ? rawCols[colFornecedor] || '' : '';
    const embalagem = colEmbalagem >= 0 ? rawCols[colEmbalagem] || '' : '';
    const observacao = colObservacao >= 0 ? rawCols[colObservacao] || '' : '';
    const custoStr = colCusto >= 0 ? rawCols[colCusto] || '' : '';

    const { quantity, unit } = parseQuantity(embalagem);
    const unitPrice = parsePrice(custoStr);

    // Determine category: eletrico or hidraulico based on words
    const checkText = `${componente} ${produto} ${observacao}`.toLowerCase();
    const isHidraulico =
      checkText.includes('tubo') ||
      checkText.includes('registro') ||
      checkText.includes('valvula') ||
      checkText.includes('hidraul') ||
      checkText.includes('esgoto') ||
      checkText.includes('ralo') ||
      checkText.includes('torneira') ||
      checkText.includes('bomba');

    // Auto-detect Norma ABNT if mentioned
    let norma = isHidraulico ? 'ABNT NBR 5626' : 'ABNT NBR 5410';
    if (checkText.includes('10898')) norma = 'NBR 10898 (Emergência)';
    if (checkText.includes('61008') || checkText.includes('dr')) norma = 'NBR NM 61008 (DR)';
    if (checkText.includes('5688')) norma = 'NBR 5688 (Esgoto)';

    items.push({
      id: `imported-item-${i}-${Date.now()}`,
      name: produto,
      category: isHidraulico ? 'hidraulico' : 'eletrico',
      spec: observacao || (componente ? `Componente: ${componente}` : 'Especificação técnica'),
      norma,
      unit,
      quantity,
      unitPrice,
      code: codigo,
      supplier: fornecedor,
      notes: componente ? `Grupo: ${componente}` : undefined,
    });
  }

  const totalCost = items.reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);

  return {
    items,
    totalCost,
    detectedKitTitle: defaultKitTitle || (items.length > 0 ? `Kit Comercial (${items.length} Itens)` : 'Kit Importado'),
    errors,
  };
}

/**
 * Generate CSV text from a Kit
 */
export function exportKitToCSV(kit: Kit): string {
  const headers = ['Componente do Kit', 'Código', 'Produto', 'Fornecedor', 'Embalagem', 'Observação', 'Custo (R$)'];
  const rows = kit.items.map((item) => {
    const comp = item.notes?.replace('Grupo: ', '') || (item.category === 'eletrico' ? 'Elétrica' : 'Hidráulica');
    const code = item.code || '';
    const name = `"${item.name.replace(/"/g, '""')}"`;
    const supp = item.supplier ? `"${item.supplier.replace(/"/g, '""')}"` : '';
    const emb = `${item.quantity} ${item.unit}`;
    const obs = item.spec ? `"${item.spec.replace(/"/g, '""')}"` : '';
    const cost = `R$ ${item.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    return [comp, code, name, supp, emb, obs, cost].join(';');
  });

  const totalRow = [
    'CUSTO BASE DO KIT',
    '',
    '',
    '',
    '',
    '',
    `R$ ${kit.estimatedPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  ].join(';');

  return [headers.join(';'), ...rows, totalRow].join('\r\n');
}
