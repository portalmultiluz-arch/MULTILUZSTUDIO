# MultiLuz Studio — Gerador de Vídeos YouTube para Kits Elétricos & Hidráulicos

Plataforma profissional para criação e geração de vídeos de alta conversão para o YouTube (em formatos 16:9 e 9:16 para Shorts), integrando catálogo técnico de kits elétricos e hidráulicos para condomínios, residências e empresas com geração por inteligência artificial através do modelo Veo 3.

## Decisões do Usuário & Alinhamentos Confirmados

> [!IMPORTANT]
> As escolhas prioritárias foram confirmadas na etapa de alinhamento:
> - **Formatos de Vídeo**: Suporte completo a formato horizontal 16:9 (vídeos regulares para YouTube) e formato vertical 9:16 (YouTube Shorts).
> - **Escopo de Kits**: Cobertura integrada para os 3 segmentos-chave: Condomínios (manutenção predial, bombas, quadros), Residências (reformas, iluminação, tubulação) e Empresas/Indústrias (alta demanda, painéis trifásicos, infraestrutura).
> - **Estilo Visual e Tom**: Comercial profissional técnico, destacando especificações de normas (NBR-5410, NBR-5626), segurança, durabilidade e custo-benefício.

---

## 1. Visão Geral & Conceito do Produto

- **O que faz**: Permite selecionar ou customizar kits de materiais elétricos e hidráulicos por segmento (Condomínio, Residencial, Comercial/Empresarial), gerar automaticamente roteiros comerciais detalhados com títulos e descrições otimizadas para SEO no YouTube com Gemini 3.8 Flash, e produzir vídeos promocionais ultra-realistas com Veo 3 (`veo-3.1-fast-generate-preview`) em 16:9 ou 9:16.
- **Público-Alvo**: Síndicos e administradoras de condomínios, eletricistas, engenheiros, instaladores hidráulicos, compradores corporativos e proprietários residenciais.
- **Proposta de Valor**: Automatiza o ciclo completo de marketing no YouTube para distribuidores e lojistas de materiais de construção e manutenção, reduzindo o tempo de criação de vídeo comercial de dias para minutos com metadados prontos para publicação.

---

## 2. Experiência do Usuário & Design Visual

### Fluxos Principais
1. **Exploração do Catálogo de Kits**: Navegação por categorias segmentadas (Condomínio, Residencial, Empresarial) com filtros por tipo de material (Elétrico, Hidráulico ou Híbrido).
2. **Customizador de Kit & Especificações**: Painel interativo com listagem de itens inclusos (disjuntores, barramentos, cabos de cobre, tubulações PPR/PVC, registros de pressão, bombas submersas), cálculo de valor estimado e compatibilidade técnica.
3. **Assistente de Roteiro e SEO para YouTube**: Geração com Gemini 3.8 Flash do roteiro cena a cena (introdução, problema, solução com o kit, chamada para ação comercial), títulos de alta taxa de clique (CTR), tags, hashtags e descrição com carimbos de tempo.
4. **Estúdio de Produção de Vídeo Veo 3**:
   - Seleção da proporção: 16:9 (Landscape para YouTube Desktop/TV) ou 9:16 (Portrait para YouTube Shorts/Mobile).
   - Ajuste de prompts visuais cinematográficos baseados nos produtos do kit (ex: iluminação técnica em estúdio, close-up em conexões de bronze e painéis elétricos industriais).
   - Barra de progresso com polling de operação de longa duração e mensagens dinâmicas de renderização.
   - Player de vídeo integrado com download em MP4 e cópia rápida de roteiro/metadados para o YouTube Studio.

### Identidade Visual & Tema
- **Direção Estética**: Industrial limpo e técnico-comercial, transmitindo solidez, precisão e confiança de engenharia.
- **Paleta de Cores (Disciplina 60-30-10)**:
  - *60% Neutros*: Fundo ardósia profundo (`slate-950` / `slate-900` para painéis) com contraste nítido e superfícies limpas.
  - *30% Estruturais*: Borda sutil de 1px em ardósia técnica (`slate-800`), cartões com leve gradiente escuro e tipografia legível (`slate-100` e `slate-400`).
  - *10% Acentos*: Amarelo elétrico âmbar (`amber-500` / `amber-400`) para materiais elétricos e energia; Azul ciano técnico (`cyan-500` / `blue-500`) para materiais hidráulicos e fluxo d'água.
- **Tipografia**:
  - Títulos & Destaques: Sans geométrico estruturado com alto peso e clareza técnica.
  - Textos & Metadados: Tipografia limpa, sem badges tipo pílula decorativas, com números tabulares (`tabular-nums`) para tensões, bitolas, polegadas e preços.

---

## 3. Decisões de Produto & Arquitetura

### Decisão 1: Pipeline de Vídeo Veo 3 no Backend
- **Abordagem**: Implementar padrão assíncrono de 3 etapas no servidor Express (`POST /api/generate-video`, `POST /api/video-status`, `POST /api/video-download`) usando `@google/genai` e modelo `veo-3.1-fast-generate-preview`.
- **Por que**: A geração de vídeo no Veo é assíncrona por design e dura de 60 a 180 segundos. O backend gerencia o polling de status da operação sem travar a interface do usuário e sem expor a chave de API no navegador.

### Decisão 2: Integração com Gemini 3.8 Flash para Roteiros e Metadados YouTube
- **Abordagem**: Endpoint dedicado `/api/generate-script` que formula roteiros narrativos em português, incluindo:
  - Título atraente no padrão do YouTube
  - Descrição estruturada com links e chamada para orçamento
  - Tags e hashtags estratégicas
  - Roteiro cena a cena sincronizado com a cena gerada pelo Veo 3

### Decisão 3: Catálogo Rápido com Kits Pré-Configurados e Edição Aberta
- **Abordagem**: Fornecer 6 kits estruturados de alta demanda pronta para uso (Kit Reforma Condomínio, Kit Entrada de Energia Bifásica/Trifásica Residencial, Kit Hidráulico Predial, Kit Empresa Padrão Industrial, Kit Manutenção Preventiva Elétrica, Kit Hidráulico Banheiros Corporativos) com possibilidade de criar kits personalizados.

---

## 4. Arquitetura Técnica & Estrutura de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MultiLuz Studio Frontend                        │
├────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  ┌───────────────────────────────────────┐ │
│ │ Top Bar Contract        │  │ Segment Filter: Condomínio/Casa/B2B   │ │
│ │ (Brand, Nav, Actions)   │  │ Format Switch: 16:9 (YT) / 9:16 (Short)│
│ └─────────────────────────┘  └───────────────────────────────────────┘ │
│ ┌───────────────────────────┐ ┌──────────────────────────────────────┐ │
│ │ Catálogo de Kits          │ │ Customizador & Seletor de Itens      │ │
│ │ - Elétrico & Hidráulico   │ │ - Disjuntores, Tubos, Conexões, Cabos│ │
│ │ - Especificações NBR      │ │ - Cálculo de Carga & Orçamento Est.  │ │
│ └─────────────┬─────────────┘ └──────────────────┬───────────────────┘ │
│               ▼                                  ▼                     │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Estúdio de Criação de Vídeo & Roteiro YouTube                      │ │
│ │ - Gerador de Roteiro Narrado & SEO YouTube (Gemini 3.8 Flash)      │ │
│ │ - Gerador de Vídeo Veo 3 (16:9 / 9:16)                             │ │
│ │ - Preview Interativo, Barra de Polling & Download MP4              │ │
│ └─────────────────────────────────┬──────────────────────────────────┘ │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ Fetch REST
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Express Server (server.ts)                      │
├────────────────────────────────────────────────────────────────────────┤
│ - POST /api/generate-script   --> Gemini 3.8 Flash (Structured JSON)   │
│ - POST /api/generate-video    --> Veo 3 (veo-3.1-fast-generate-preview)│
│ - POST /api/video-status      --> Polling getVideosOperation           │
│ - POST /api/video-download    --> Stream MP4 buffer seguro para client │
└────────────────────────────────────────────────────────────────────────┘
```

### Modelo de Dados Principal

```typescript
interface ProductItem {
  id: string;
  name: string;
  category: 'eletrico' | 'hidraulico';
  spec: string; // Ex: "Cabo Flexível 6mm² Antichama 750V"
  norma?: string; // Ex: "NBR 5410"
  unit: string;
  quantity: number;
}

interface Kit {
  id: string;
  title: string;
  targetAudience: 'condominio' | 'residencia' | 'empresa';
  description: string;
  items: ProductItem[];
  highlight: string;
  recommendedAspectRatios: ('16:9' | '9:16')[];
}

interface VideoGenerationJob {
  operationName: string;
  aspectRatio: '16:9' | '9:16';
  kitTitle: string;
  status: 'starting' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  script?: {
    youtubeTitle: string;
    youtubeDescription: string;
    hashtags: string[];
    spokenScript: string;
  };
}
```
