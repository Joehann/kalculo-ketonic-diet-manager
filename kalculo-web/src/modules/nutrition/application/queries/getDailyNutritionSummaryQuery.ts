import type { DailyNutritionSummaryQueryPort } from '../ports/DailyNutritionSummaryQueryPort'
import type { DailyNutritionSummary } from '../../domain/DailyNutritionSummary'

export type GetDailyNutritionSummaryQuery = () => Promise<DailyNutritionSummary>

export const buildGetDailyNutritionSummaryQuery =
  (queryPort: DailyNutritionSummaryQueryPort): GetDailyNutritionSummaryQuery =>
  async () => {
    const summary = await queryPort.getCurrentDailySummary()
    return assertValidSummary(summary)
  }

const assertValidSummary = (
  summary: DailyNutritionSummary,
): DailyNutritionSummary => {
  if (!summary.childFirstName.trim()) {
    throw new Error('Invalid summary: childFirstName is required')
  }

  if (
    summary.caloriesKcal < 0 ||
    summary.proteinGrams < 0 ||
    summary.carbsGrams < 0 ||
    summary.fatsGrams < 0
  ) {
    throw new Error('Invalid summary: macro values must be non-negative')
  }

  return summary
}
