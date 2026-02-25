import type { DailyNutritionSummaryQueryPort } from '../../application/ports/DailyNutritionSummaryQueryPort'
import type { DailyNutritionSummary } from '../../domain/DailyNutritionSummary'

export class ApiDailyNutritionSummaryQueryAdapter
  implements DailyNutritionSummaryQueryPort
{
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    throw new Error('API adapter not implemented yet for nutrition summary')
  }
}
