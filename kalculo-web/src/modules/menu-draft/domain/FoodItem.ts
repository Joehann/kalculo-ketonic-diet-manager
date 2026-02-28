import {
  IncoherentFoodNutritionDataError,
  IncompleteFoodNutritionDataError,
} from './errors/MenuDraftError'

export type FoodNutritionPer100g = {
  caloriesKcal: number
  proteinGrams: number
  carbsGrams: number
  fatsGrams: number
}

export type FoodItem = {
  id: string
  name: string
  nutritionPer100g: FoodNutritionPer100g
}

export const assertFoodItemNutritionUsable = (food: FoodItem): FoodItem => {
  if (!food.id.trim() || !food.name.trim()) {
    throw new Error('Invalid food item: id and name are required')
  }

  assertNutritionValuesComplete(food)
  assertNutritionValuesCoherent(food)

  return food
}

const assertNutritionValuesComplete = (food: FoodItem): void => {
  const values = food.nutritionPer100g

  const entries: Array<[string, number]> = [
    ['caloriesKcal', values.caloriesKcal],
    ['proteinGrams', values.proteinGrams],
    ['carbsGrams', values.carbsGrams],
    ['fatsGrams', values.fatsGrams],
  ]

  for (const [fieldName, fieldValue] of entries) {
    if (!Number.isFinite(fieldValue)) {
      throw new IncompleteFoodNutritionDataError(
        `Donnees nutritionnelles incompletes (${fieldName}) pour "${food.name}". Action: renseignez toutes les valeurs par 100g.`,
      )
    }

    if (fieldValue < 0) {
      throw new IncompleteFoodNutritionDataError(
        `Donnees nutritionnelles invalides (${fieldName} negatif) pour "${food.name}". Action: corrigez avec une valeur positive ou nulle.`,
      )
    }
  }
}

const assertNutritionValuesCoherent = (food: FoodItem): void => {
  const values = food.nutritionPer100g
  const macroDerivedCalories =
    values.proteinGrams * 4 + values.carbsGrams * 4 + values.fatsGrams * 9

  if (macroDerivedCalories === 0 && values.caloriesKcal === 0) {
    throw new IncoherentFoodNutritionDataError(
      `Donnees nutritionnelles incoherentes pour "${food.name}". Action: renseignez des valeurs nutritionnelles exploitables.`,
    )
  }

  if (macroDerivedCalories > 0) {
    const relativeGap =
      Math.abs(values.caloriesKcal - macroDerivedCalories) / macroDerivedCalories

    if (relativeGap > 0.35) {
      throw new IncoherentFoodNutritionDataError(
        `Donnees nutritionnelles incoherentes pour "${food.name}". Action: alignez calories et macros (kcal proches de 4P + 4C + 9L).`,
      )
    }
  }
}
