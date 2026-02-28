import { describe, expect, it } from 'vitest'
import {
  IncoherentFoodNutritionDataError,
  IncompleteFoodNutritionDataError,
} from './errors/MenuDraftError'
import { assertFoodItemNutritionUsable, type FoodItem } from './FoodItem'

const validFood: FoodItem = {
  id: 'food-egg',
  name: 'Oeuf',
  nutritionPer100g: {
    caloriesKcal: 155,
    proteinGrams: 13,
    carbsGrams: 1.1,
    fatsGrams: 11,
  },
}

describe('assertFoodItemNutritionUsable', () => {
  it('accepts coherent and complete nutrition data', () => {
    expect(assertFoodItemNutritionUsable(validFood)).toEqual(validFood)
  })

  it('rejects incomplete nutrition data', () => {
    expect(
      () =>
        assertFoodItemNutritionUsable({
          ...validFood,
          nutritionPer100g: {
            ...validFood.nutritionPer100g,
            caloriesKcal: Number.NaN,
          },
        }),
    ).toThrow(IncompleteFoodNutritionDataError)
  })

  it('rejects incoherent calories versus macros', () => {
    expect(
      () =>
        assertFoodItemNutritionUsable({
          ...validFood,
          nutritionPer100g: {
            caloriesKcal: 10,
            proteinGrams: 20,
            carbsGrams: 20,
            fatsGrams: 20,
          },
        }),
    ).toThrow(IncoherentFoodNutritionDataError)
  })
})
