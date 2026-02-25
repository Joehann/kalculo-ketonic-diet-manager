import type { DailyNutritionSummary } from '../../domain/DailyNutritionSummary'

export interface DailyNutritionSummaryQueryPort {
  getCurrentDailySummary(): Promise<DailyNutritionSummary>
}
