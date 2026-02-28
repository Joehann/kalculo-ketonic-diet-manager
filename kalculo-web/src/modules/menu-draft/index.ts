// Domain
export * from './domain/FoodItem'
export * from './domain/MenuDraft'
export * from './domain/errors/MenuDraftError'

// Application
export { type FoodCatalogQueryPort } from './application/ports/FoodCatalogQueryPort'
export { type MenuDraftRepositoryPort } from './application/ports/MenuDraftRepositoryPort'
export {
  buildAddFoodToDraftMenuCommand,
  type AddFoodToDraftMenuCommand,
  type AddFoodToDraftMenuCommandInput,
} from './application/commands/addFoodToDraftMenuCommand'
export {
  buildGetDailyDraftMenuQuery,
  type GetDailyDraftMenuQuery,
} from './application/queries/getDailyDraftMenuQuery'
export {
  buildListFoodCatalogQuery,
  type ListFoodCatalogQuery,
} from './application/queries/listFoodCatalogQuery'

// Infrastructure
export { InMemoryFoodCatalogQueryAdapter } from './infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
export { InMemoryMenuDraftRepositoryAdapter } from './infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
export { ApiFoodCatalogQueryAdapter } from './infrastructure/api/ApiFoodCatalogQueryAdapter'
export { ApiMenuDraftRepositoryAdapter } from './infrastructure/api/ApiMenuDraftRepositoryAdapter'

// Factory for use cases
import { buildAddFoodToDraftMenuCommand } from './application/commands/addFoodToDraftMenuCommand'
import { buildGetDailyDraftMenuQuery } from './application/queries/getDailyDraftMenuQuery'
import { buildListFoodCatalogQuery } from './application/queries/listFoodCatalogQuery'
import type { FoodCatalogQueryPort } from './application/ports/FoodCatalogQueryPort'
import type { MenuDraftRepositoryPort } from './application/ports/MenuDraftRepositoryPort'
import { ApiFoodCatalogQueryAdapter } from './infrastructure/api/ApiFoodCatalogQueryAdapter'
import { ApiMenuDraftRepositoryAdapter } from './infrastructure/api/ApiMenuDraftRepositoryAdapter'
import { InMemoryFoodCatalogQueryAdapter } from './infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from './infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'

export type MenuDraftDataSource = 'inmemory' | 'api'

export const buildMenuDraftUseCases = (dataSource: MenuDraftDataSource) => {
  const foodCatalogQueryPort: FoodCatalogQueryPort =
    dataSource === 'api'
      ? new ApiFoodCatalogQueryAdapter()
      : new InMemoryFoodCatalogQueryAdapter()

  const draftRepositoryPort: MenuDraftRepositoryPort =
    dataSource === 'api'
      ? new ApiMenuDraftRepositoryAdapter()
      : new InMemoryMenuDraftRepositoryAdapter()

  return {
    listFoodCatalogQuery: buildListFoodCatalogQuery(foodCatalogQueryPort),
    getDailyDraftMenuQuery: buildGetDailyDraftMenuQuery(draftRepositoryPort),
    addFoodToDraftMenuCommand: buildAddFoodToDraftMenuCommand(
      draftRepositoryPort,
      foodCatalogQueryPort,
    ),
  }
}

export type MenuDraftUseCases = ReturnType<typeof buildMenuDraftUseCases>
