import type { NutritionDataSource } from '../../modules/nutrition'

const allowedDataSources = ['inmemory', 'api'] as const

const isValidDataSource = (
  value: string,
): value is (typeof allowedDataSources)[number] =>
  allowedDataSources.includes(value as NutritionDataSource)

export const getDataSourceFromEnv = (): NutritionDataSource => {
  const configuredDataSource = import.meta.env.VITE_DATA_SOURCE ?? 'inmemory'
  return isValidDataSource(configuredDataSource)
    ? configuredDataSource
    : 'inmemory'
}
