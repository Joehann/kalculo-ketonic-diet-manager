import { getDataSourceFromEnv } from '../env/dataSource'
import { buildNutritionUseCases } from '../../modules/nutrition'
import {
  buildAuthenticationUseCases,
  InMemoryParentRepositoryAdapter,
  InMemoryPasswordHasherAdapter,
  InMemorySessionStorageAdapter,
} from '../../modules/authentication'

export const buildDiContainer = () => {
  const dataSource = getDataSourceFromEnv()

  // Initialize authentication adapters
  const parentRepositoryAdapter = new InMemoryParentRepositoryAdapter()
  const passwordHasherAdapter = new InMemoryPasswordHasherAdapter()
  const sessionStorageAdapter = new InMemorySessionStorageAdapter()

  return {
    dataSource,
    useCases: {
      nutrition: buildNutritionUseCases(dataSource),
      authentication: buildAuthenticationUseCases(
        parentRepositoryAdapter,
        passwordHasherAdapter,
        sessionStorageAdapter,
      ),
    },
  }
}

export type DiContainer = ReturnType<typeof buildDiContainer>
export type AppUseCases = DiContainer['useCases']
