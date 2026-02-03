import { create } from 'zustand'

export const PHASES = {
  INIT: 'init',
  CHAT: 'chat',
  DOCUMENTING: 'documenting',
  DESIGN: 'design',
  REVIEW: 'review'
}

export const INDUSTRIES = [
  { id: 'finance', label: '金融', icon: '💰' },
  { id: 'compliance', label: '合规', icon: '📋' },
  { id: 'healthcare', label: '医疗', icon: '🏥' },
  { id: 'ecommerce', label: '电商', icon: '🛒' },
  { id: 'sports', label: '运动', icon: '⚽' }
]

export const PERSONAS = [
  { 
    id: 'beginner', 
    label: '小白级别', 
    description: '逻辑清晰，表达完整',
    difficulty: 1
  },
  { 
    id: 'realistic', 
    label: '职场现实', 
    description: '表达破碎、带有情绪、存在隐藏约束',
    difficulty: 3
  }
]

const useAppStore = create((set, get) => ({
  // Current phase
  currentPhase: PHASES.INIT,
  
  // User selections
  selectedIndustry: null,
  selectedPersona: null,
  
  // Generated task
  taskBackground: '',
  hiddenConstraints: [],
  corePainPoints: [],
  
  // Chat messages
  messages: [],
  
  // Document content
  documentContent: {
    businessGoals: '',
    painPoints: [],
    coreFeatures: []
  },
  
  // Design solution
  designSolution: '',
  aiIntegration: '',
  
  // Review scores
  reviewScores: null,
  
  // Actions
  setPhase: (phase) => set({ currentPhase: phase }),
  
  setIndustry: (industry) => set({ selectedIndustry: industry }),
  
  setPersona: (persona) => set({ selectedPersona: persona }),
  
  setTaskBackground: (task) => set({ taskBackground: task }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: Date.now() }]
  })),
  
  updateDocument: (content) => set((state) => ({
    documentContent: { ...state.documentContent, ...content }
  })),
  
  setDesignSolution: (solution) => set({ designSolution: solution }),
  
  setAIIntegration: (integration) => set({ aiIntegration: integration }),
  
  setReviewScores: (scores) => set({ reviewScores: scores }),
  
  reset: () => set({
    currentPhase: PHASES.INIT,
    selectedIndustry: null,
    selectedPersona: null,
    taskBackground: '',
    hiddenConstraints: [],
    corePainPoints: [],
    messages: [],
    documentContent: {
      businessGoals: '',
      painPoints: [],
      coreFeatures: []
    },
    designSolution: '',
    aiIntegration: '',
    reviewScores: null
  })
}))

export default useAppStore
