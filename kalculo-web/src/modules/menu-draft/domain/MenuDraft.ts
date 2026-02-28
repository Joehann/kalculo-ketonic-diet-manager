import type { FoodItem, FoodNutritionPer100g } from './FoodItem'
import { InvalidQuantityError } from './errors/MenuDraftError'

export type MenuDraftLineNutritionTotals = {
  caloriesKcal: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
}

export type MenuDraftLine = {
  id: string
  foodId: string
  foodName: string
  quantityGrams: number
  nutritionPer100gSnapshot: FoodNutritionPer100g
  nutritionTotals: MenuDraftLineNutritionTotals
  addedAt: Date
}

export type DailyMenuDraft = {
  id: string
  parentId: string
  childId: string
  day: string
  lines: MenuDraftLine[]
  updatedAt: Date
}

export const createDraftIfMissing = (
  existingDraft: DailyMenuDraft | null,
  parentId: string,
  childId: string,
  day: string,
): DailyMenuDraft => {
  if (existingDraft) {
    return existingDraft
  }

  return {
    id: `draft-${parentId}-${childId}-${day}`,
    parentId,
    childId,
    day,
    lines: [],
    updatedAt: new Date(),
  }
}

export const createDraftLine = (
  food: FoodItem,
  quantityGrams: number,
): MenuDraftLine => {
  if (!Number.isFinite(quantityGrams) || quantityGrams <= 0) {
    throw new InvalidQuantityError('La quantite doit etre un nombre strictement positif')
  }

  const ratio = quantityGrams / 100

  return {
    id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    foodId: food.id,
    foodName: food.name,
    quantityGrams,
    nutritionPer100gSnapshot: {
      ...food.nutritionPer100g,
    },
    nutritionTotals: {
      caloriesKcal: round2(food.nutritionPer100g.caloriesKcal * ratio),
      proteinGrams: round2(food.nutritionPer100g.proteinGrams * ratio),
      carbsGrams: round2(food.nutritionPer100g.carbsGrams * ratio),
      fatsGrams: round2(food.nutritionPer100g.fatsGrams * ratio),
    },
    addedAt: new Date(),
  }
}

export const appendLineToDraft = (
  draft: DailyMenuDraft,
  line: MenuDraftLine,
): DailyMenuDraft => ({
  ...draft,
  lines: [...draft.lines, line],
  updatedAt: new Date(),
})

const round2 = (value: number): number => Math.round(value * 100) / 100
