import type { NutritionDataSource } from '../../modules/nutrition'

const allowedDataSources = ['inmemory', 'api'] as const

type DataSourceEnv = Record<string, string | undefined>

const isValidDataSource = (
  value: string,
): value is (typeof allowedDataSources)[number] =>
  allowedDataSources.includes(value as NutritionDataSource)

export const getDataSourceFromEnv = (): NutritionDataSource => {
  const env = import.meta.env as DataSourceEnv
  const configuredDataSource = env.VITE_DATA_SOURCE ?? 'inmemory'
  return isValidDataSource(configuredDataSource)
    ? configuredDataSource
    : 'inmemory'
}
