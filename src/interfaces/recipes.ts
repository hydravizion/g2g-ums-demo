export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface IngredientItem {
  name: string
  amount: string
  unit: string
}

export interface IngredientSection {
  section: string
  items: IngredientItem[]
}

export interface InstructionStep {
  order: number
  text: string
}

export interface StepSection {
  section: string
  instructions: InstructionStep[]
}

export interface Recipe {
  id: string
  title: string
  description?: string
  images?: string[]
  categoryId?: string
  servings: number
  highlightInfo?: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  totalTimeMinutes: number
  ingredients?: IngredientSection[]
  steps?: StepSection[]
  references?: string
  createdAt: Date
  updatedAt: Date
}
