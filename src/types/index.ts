export type TargetAudience = string;
export type KitCategory = 'eletrico' | 'hidraulico' | 'hibrido';
export type AspectRatio = '16:9' | '9:16';

export interface Segment {
  id: string;
  label: string;
  description?: string;
  isCustom?: boolean;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'eletrico' | 'hidraulico';
  spec: string;
  norma: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  code?: string;
  supplier?: string;
  notes?: string;
}

export interface Kit {
  id: string;
  title: string;
  targetAudience: TargetAudience;
  targetAudienceLabel?: string;
  category: KitCategory;
  description: string;
  highlight: string;
  image: string;
  estimatedPrice: number;
  recommendedAspectRatios: AspectRatio[];
  items: ProductItem[];
}

export interface ScriptScene {
  time: string;
  title: string;
  visualDescription: string;
  narration: string;
}

export interface GeneratedScript {
  youtubeTitle: string;
  youtubeDescription: string;
  tags: string[];
  hashtags: string[];
  spokenScript: string;
  veoPrompt: string;
  scenes: ScriptScene[];
}

export interface VideoJob {
  operationName: string;
  aspectRatio: AspectRatio;
  status: 'idle' | 'generating_script' | 'starting_video' | 'rendering' | 'completed' | 'error';
  progress: number;
  phaseText: string;
  videoUrl?: string;
  isMock?: boolean;
  errorMessage?: string;
  script?: GeneratedScript;
}
