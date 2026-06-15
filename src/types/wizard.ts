export interface WizardFormData {
  productName: string
  productDescription: string
  productImage: File | null
  dailyBudget: number
  targetCities: string[]
  targetAgeMin: number
  targetAgeMax: number
  targetGender: 'all' | 'male' | 'female'
}

export interface AdCopyVariant {
  id: string
  headline: string
  body: string
  cta: string
}

export type WizardStep = 'product' | 'budget-target' | 'generate' | 'preview'
