import { create } from 'zustand'
import { generateFluxPreview, startLoraTraining, type GenerateResponse } from '../lib/api'

export type FluxPreview = {
  id: string
  prompt: string
  previewUrl: string
  createdAt: string
}

export type FluxState = {
  prompt: string
  seed?: number
  isGenerating: boolean
  isTraining: boolean
  previews: FluxPreview[]
  datasetFiles: File[]

  setPrompt: (prompt: string) => void
  setSeed: (seed?: number) => void
  addDatasetFiles: (files: File[]) => void
  clearDataset: () => void
  generate: () => Promise<void>
  train: (steps?: number) => Promise<void>
}

export const useFluxStore = create<FluxState>((set, get) => ({
  prompt: '',
  seed: undefined,
  isGenerating: false,
  isTraining: false,
  previews: [],
  datasetFiles: [],

  setPrompt: (prompt) => set({ prompt }),
  setSeed: (seed) => set({ seed }),
  addDatasetFiles: (files) => set((s) => ({ datasetFiles: [...s.datasetFiles, ...files] })),
  clearDataset: () => set({ datasetFiles: [] }),

  generate: async () => {
    const { prompt, seed } = get()
    if (!prompt.trim()) return
    set({ isGenerating: true })
    try {
      const res: GenerateResponse = await generateFluxPreview(prompt, seed)
      const preview: FluxPreview = {
        id: res.id,
        prompt: res.prompt,
        previewUrl: res.preview_url,
        createdAt: res.created_at,
      }
      set((s) => ({ previews: [preview, ...s.previews] }))
    } finally {
      set({ isGenerating: false })
    }
  },

  train: async (steps?: number) => {
    const { datasetFiles } = get()
    set({ isTraining: true })
    try {
      // This stub only sends counts, not file contents
      await startLoraTraining({ dataset: datasetFiles.map((f) => f.name), steps })
    } finally {
      set({ isTraining: false })
    }
  },
}))
