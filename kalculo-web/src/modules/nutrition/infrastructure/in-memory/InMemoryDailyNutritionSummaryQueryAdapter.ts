import type { DailyNutritionSummaryQueryPort } from '../../application/ports/DailyNutritionSummaryQueryPort'
import type { DailyNutritionSummary } from '../../domain/DailyNutritionSummary'

const defaultSummary: DailyNutritionSummary = {
  childFirstName: 'Alex',
  protocol: 'Classique',
  caloriesKcal: 1650,
  proteinGrams: 78,
  carbsGrams: 180,
  fatsGrams: 62,
}

export class InMemoryDailyNutritionSummaryQueryAdapter
  implements DailyNutritionSummaryQueryPort
{
  async getCurrentDailySummary(): Promise<DailyNutritionSummary> {
    return defaultSummary
  }
}
