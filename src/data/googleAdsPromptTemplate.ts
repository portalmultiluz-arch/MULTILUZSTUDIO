/**
 * Modelo de Prompt e Estrutura Estratégica para Anúncios de Alta Conversão no Google Ads / YouTube Ads
 * Nicho: Portal Multi Luz - Kits de Materiais Elétricos, Hidráulicos e Iluminação para Condomínios e Obras.
 */

export const GOOGLE_ADS_STRATEGY_INFO = {
  nicheTitle: 'Portal Multi Luz - Kits Comerciais de Materiais Elétricos e Hidráulicos',
  targetAudiences: [
    'Síndicos Profissionais e Moradores Síndicos',
    'Zeladores e Gerentes Prediais',
    'Administradoras de Condomínios',
    'Eletricistas e Encanadores Instaladores',
    'Engenheiros Civis e Mestres de Obras',
  ],
  campaignFormats: [
    'Google Ads In-Stream Pulável (16:9 - 30 segundos)',
    'YouTube Shorts Ads / Demand Gen (9:16 - 15 a 30 segundos)',
    'Anúncios Não Puláveis de Fechamento Rápido (15 segundos)',
  ],
  keyTriggers: [
    'Fim da perda de tempo cotando em 5 lojas diferentes',
    'Segurança contra reprovação de AVCB (Corpo de Bombeiros)',
    'Conformidade técnica obrigatória ABNT NBR 5410 e NBR 5626',
    'Orçamento fechado com entrega rápida direto na portaria ou obra',
    'Marcas consagradas de engenharia (GE, Segurimax, Intelbras, Alumasa, Fertak)',
  ],
};

export const RAW_GOOGLE_ADS_PROMPT_TEMPLATE = `# MODELO DE PROMPT PARA GOOGLE ADS / YOUTUBE ADS - PORTAL MULTI LUZ

Você é um diretor sênior de criação e copywriter especializado em campanhas de tráfego pago no Google Ads (YouTube Video Ads e YouTube Shorts Ads) para o setor B2B/B2C de construção civil e materiais técnicos.

Seu objetivo é criar um roteiro de vídeo publicitário de altíssima conversão de 30 segundos, focado em geração de leads qualificados (síndicos, administradores prediais e eletricistas) para os KITS COMERCIAIS do Portal Multi Luz.

---
## DADOS DA CAMPANHA:
- Empresa: Portal Multi Luz (Distribuidora de Materiais Elétricos e Hidráulicos)
- Produto: {NOME_DO_KIT} (Ex: Kit Condomínio - Manutenção & Iluminação NBR 5410)
- Público-Alvo: {PUBLICO_ALVO} (Síndicos, Zeladores e Instaladores Prediais)
- Principais Itens: {LISTA_DE_ITENS_E_MARCAS} (Disjuntores DR GE, Luminárias de Emergência Segurimax, Refletores LED, Bateria Intelbras...)
- Formato: {FORMATO_16x9_OU_9x16_SHORTS}
- Oferta Comercial: Tabela de preços fechada em planilha Excel/PDF com entrega rápida e nota fiscal direta.

---
## ESTRUTURA OBRIGATÓRIA DO CRIATIVO GOOGLE ADS:

1. GANCHO VISUAL & AUDITIVO (0s a 5s) [CRÍTICO - ANTES DO BOTÃO 'PULAR ANÚNCIO']:
   - Quebra de padrão imediata que fisga a atenção do síndico/instalador nos primeiros 5 segundos.
   - Pergunta provocativa ou dor aguda (ex: tempo perdido em orçamentos picados ou risco de multa/reprovação de vistoria elétrica).

2. A DOR & O RISCO REAL (5s a 12s):
   - Mostrar a frustração de comprar peça por peça em lojas diferentes, receber materiais fora da norma ABNT ou sofrer com desarmes elétricos e lâmpadas de emergência que falham quando mais se precisa.

3. A SOLUÇÃO MULTILUZ (12s a 22s):
   - Apresentar o Kit Completo Portal Multi Luz: tudo o que o prédio precisa em uma única entrega, com custo fechado, marcas líderes (GE, Segurimax, Intelbras) e 100% de conformidade com a ABNT NBR 5410 e 5626.

4. CHAMADA PARA AÇÃO - CTA IRRESISTÍVEL (22s a 30s):
   - Instrução visual e falada direta: "Clique agora no botão abaixo para baixar a planilha com a lista de peças e tabela de preços ou chamar nosso time técnico no WhatsApp do Portal Multi Luz."

---
## PROMPT CINEMATOGRÁFICO PARA VEO 3 (EM INGLÊS):
Gere também o prompt cinemático para renderização no Veo 3:
"High-end commercial advertisement for electrical and plumbing materials kit. Dynamic camera opening, macro focus on clean circuit breakers with trip indicators, LED emergency lights turning on, copper wires and industrial valves arranged on a modern reflective graphite concrete surface, studio lighting with warm amber and cold cyan accents, 8K resolution, photorealistic TV commercial cinematography, professional product video."
`;
