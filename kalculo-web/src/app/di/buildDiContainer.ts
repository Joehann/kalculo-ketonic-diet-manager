import { getDataSourceFromEnv } from '../env/dataSource'
import { buildNutritionUseCases } from '../../modules/nutrition'
import {
  buildAuthenticationUseCases,
  InMemoryParentRepositoryAdapter,
  InMemoryPasswordHasherAdapter,
  InMemorySessionStorageAdapter,
} from '../../modules/authentication'
import {
  buildTermsUseCases,
  InMemoryTermsAcceptanceRepositoryAdapter,
  InMemoryTermsStorageAdapter,
} from '../../modules/terms'
import { buildChildProfileUseCases } from '../../modules/child-profile'
import { buildMacroTargetsUseCases } from '../../modules/macro-targets'
import { buildMenuDraftUseCases } from '../../modules/menu-draft'

export const buildDiContainer = () => {
  const dataSource = getDataSourceFromEnv()

  // Initialize authentication adapters
  const parentRepositoryAdapter = new InMemoryParentRepositoryAdapter()
  const passwordHasherAdapter = new InMemoryPasswordHasherAdapter()
  const sessionStorageAdapter = new InMemorySessionStorageAdapter()

  // Initialize terms adapters
  const termsAcceptanceRepositoryAdapter =
    new InMemoryTermsAcceptanceRepositoryAdapter()
  const termsStorageAdapter = new InMemoryTermsStorageAdapter()

  return {
    dataSource,
    useCases: {
      nutrition: buildNutritionUseCases(dataSource),
      authentication: buildAuthenticationUseCases(
        parentRepositoryAdapter,
        passwordHasherAdapter,
        sessionStorageAdapter,
      ),
      terms: buildTermsUseCases(termsAcceptanceRepositoryAdapter, termsStorageAdapter),
      childProfile: buildChildProfileUseCases(dataSource),
      macroTargets: buildMacroTargetsUseCases(dataSource),
      menuDraft: buildMenuDraftUseCases(dataSource),
    },
  }
}

export type DiContainer = ReturnType<typeof buildDiContainer>
export type AppUseCases = DiContainer['useCases']
