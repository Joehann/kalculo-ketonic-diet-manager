import { describe, expect, it } from 'vitest'
import { buildGetDailyNutritionSummaryQuery } from './getDailyNutritionSummaryQuery'
import type { DailyNutritionSummaryQueryPort } from '../ports/DailyNutritionSummaryQueryPort'

describe('buildGetDailyNutritionSummaryQuery', () => {
  it('returns deterministic in-memory summary through the application seam', async () => {
    const inMemoryQueryPort: DailyNutritionSummaryQueryPort = {
      async getCurrentDailySummary() {
        return {
          childFirstName: 'Alex',
          protocol: 'Classique',
          caloriesKcal: 1650,
          proteinGrams: 78,
          carbsGrams: 180,
          fatsGrams: 62,
        }
      },
    }

    const getDailyNutritionSummaryQuery =
      buildGetDailyNutritionSummaryQuery(inMemoryQueryPort)

    await expect(getDailyNutritionSummaryQuery()).resolves.toEqual({
      childFirstName: 'Alex',
      protocol: 'Classique',
      caloriesKcal: 1650,
      proteinGrams: 78,
      carbsGrams: 180,
      fatsGrams: 62,
    })
  })
})
