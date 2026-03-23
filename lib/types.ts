export interface VideoFile {
  id: string
  name: string
  size: number
  objectUrl: string
  frames: string[] // base64 JPEG frames
  transcript: string
}

export interface ProductInfo {
  name: string
  price: string
  description: string
  benefits: string[]
  audience: string
  niche: string
  usp: string
  reviews: string
  confidence: number
  note?: string
}

export interface VideoResult {
  rank: number
  name: string
  cpaScore: number
  cpaEstimate: string
  winnerVerdict: string
  hookScore: number
  audioScore: number
  captionsScore: number
  retentionScore: number
  conversionScore: number
  platformScore: number
  hookAnalysis: string
  audioAnalysis: string
  captionsAnalysis: string
  strengths: string[]
  weaknesses: string[]
  quickFix: string
  bestForFormat: string
}

export interface CopyVariant {
  variant: string
  approach: string
  text: string
  whyItWorks: string
  bestPairedWith: string
}

export interface Headline {
  text: string
  score: number
  type: string
}

export interface Description {
  text: string
  type: string
}

export interface VideoHook {
  text: string
  score: number
  type: string
  audioHook: string
}

export interface AnalysisResult {
  productBrief: {
    detectedName: string
    detectedPrice: string
    detectedAudience: string
    detectedBenefits: string[]
    emotionalTriggers: string[]
    competitiveAngle: string
    conversionPotential: number
    marketAlert: string
    alertType: 'success' | 'warn' | 'info'
  }
  videos: VideoResult[]
  copy: {
    primaryTexts: CopyVariant[]
    headlines: Headline[]
    descriptions: Description[]
    videoHooks: VideoHook[]
  }
  strategy: {
    winnerRationale: string
    targetingRecommendation: string
    budgetStrategy: string
    creativeRotation: string
    abTestingPlan: string
    scalingRoadmap: string
    quickWins: string[]
  }
}

export type Step = 1 | 2 | 3 | 4

export type CopyTab = 'primary' | 'headlines' | 'descriptions' | 'hooks' | 'strategy'
