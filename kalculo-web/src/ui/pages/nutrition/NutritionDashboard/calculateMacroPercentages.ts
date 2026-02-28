import type { DailyNutritionSummary } from '../../../../modules/nutrition/domain/DailyNutritionSummary'

interface MacroPercentages {
  protein: number
  carbs: number
  fats: number
}

export const calculateMacroPercentages = (
  summary: DailyNutritionSummary,
): MacroPercentages => {
  const totalMacros = summary.proteinGrams + summary.carbsGrams + summary.fatsGrams

  if (totalMacros === 0) {
    return {
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  }

  return {
    protein: (summary.proteinGrams / totalMacros) * 100,
    carbs: (summary.carbsGrams / totalMacros) * 100,
    fats: (summary.fatsGrams / totalMacros) * 100,
  }
}
