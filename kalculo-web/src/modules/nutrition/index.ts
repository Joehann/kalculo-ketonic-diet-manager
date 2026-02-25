import { buildGetDailyNutritionSummaryQuery } from './application/queries/getDailyNutritionSummaryQuery'
import { ApiDailyNutritionSummaryQueryAdapter } from './infrastructure/api/ApiDailyNutritionSummaryQueryAdapter'
import { InMemoryDailyNutritionSummaryQueryAdapter } from './infrastructure/in-memory/InMemoryDailyNutritionSummaryQueryAdapter'

export type NutritionDataSource = 'inmemory' | 'api'

export const buildNutritionUseCases = (dataSource: NutritionDataSource) => {
  const summaryQueryPort =
    dataSource === 'api'
      ? new ApiDailyNutritionSummaryQueryAdapter()
      : new InMemoryDailyNutritionSummaryQueryAdapter()

  return {
    getDailyNutritionSummaryQuery:
      buildGetDailyNutritionSummaryQuery(summaryQueryPort),
  }
}

export type NutritionUseCases = ReturnType<typeof buildNutritionUseCases>
