import type { FoodItem, FoodNutritionPer100g } from './FoodItem'
import {
  DraftLineNotFoundError,
  DraftLockedError,
  InvalidQuantityError,
} from './errors/MenuDraftError'

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
  status: 'draft' | 'locked'
  lockedAt: Date | null
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
    status: 'draft',
    lockedAt: null,
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
  ...assertDraftEditable(draft),
  lines: [...draft.lines, line],
  updatedAt: new Date(),
})

export const lockDraftMenu = (draft: DailyMenuDraft): DailyMenuDraft => {
  if (draft.status === 'locked') {
    return draft
  }

  return {
    ...draft,
    status: 'locked',
    lockedAt: new Date(),
    updatedAt: new Date(),
  }
}

export const updateDraftLineQuantity = (
  draft: DailyMenuDraft,
  lineId: string,
  quantityGrams: number,
): DailyMenuDraft => {
  assertDraftEditable(draft)

  if (!Number.isFinite(quantityGrams) || quantityGrams <= 0) {
    throw new InvalidQuantityError('La quantite doit etre un nombre strictement positif')
  }

  let hasUpdated = false

  const updatedLines = draft.lines.map((line) => {
    if (line.id !== lineId) {
      return line
    }

    hasUpdated = true

    return {
      ...line,
      quantityGrams,
      nutritionTotals: computeNutritionTotals(line.nutritionPer100gSnapshot, quantityGrams),
    }
  })

  if (!hasUpdated) {
    throw new DraftLineNotFoundError('Ligne introuvable dans le menu brouillon')
  }

  return {
    ...draft,
    lines: updatedLines,
    updatedAt: new Date(),
  }
}

export const removeDraftLine = (
  draft: DailyMenuDraft,
  lineId: string,
): DailyMenuDraft => {
  assertDraftEditable(draft)

  const nextLines = draft.lines.filter((line) => line.id !== lineId)

  if (nextLines.length === draft.lines.length) {
    throw new DraftLineNotFoundError('Ligne introuvable dans le menu brouillon')
  }

  return {
    ...draft,
    lines: nextLines,
    updatedAt: new Date(),
  }
}

export const moveDraftLine = (
  draft: DailyMenuDraft,
  lineId: string,
  direction: 'up' | 'down',
): DailyMenuDraft => {
  assertDraftEditable(draft)

  const currentIndex = draft.lines.findIndex((line) => line.id === lineId)

  if (currentIndex === -1) {
    throw new DraftLineNotFoundError('Ligne introuvable dans le menu brouillon')
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= draft.lines.length) {
    return draft
  }

  const nextLines = [...draft.lines]
  const [movedLine] = nextLines.splice(currentIndex, 1)
  nextLines.splice(targetIndex, 0, movedLine)

  return {
    ...draft,
    lines: nextLines,
    updatedAt: new Date(),
  }
}

const round2 = (value: number): number => Math.round(value * 100) / 100

const assertDraftEditable = (draft: DailyMenuDraft): DailyMenuDraft => {
  if (draft.status === 'locked') {
    throw new DraftLockedError(
      'Menu verrouille: edition impossible. Dupliquez le menu pour le modifier.',
    )
  }

  return draft
}

const computeNutritionTotals = (
  nutritionPer100g: FoodNutritionPer100g,
  quantityGrams: number,
): MenuDraftLineNutritionTotals => {
  const ratio = quantityGrams / 100

  return {
    caloriesKcal: round2(nutritionPer100g.caloriesKcal * ratio),
    proteinGrams: round2(nutritionPer100g.proteinGrams * ratio),
    carbsGrams: round2(nutritionPer100g.carbsGrams * ratio),
    fatsGrams: round2(nutritionPer100g.fatsGrams * ratio),
  }
}
