// Domain
export * from './domain/FoodItem'
export * from './domain/MenuDraft'
export * from './domain/DraftCompliance'
export * from './domain/errors/MenuDraftError'

// Application
export { type FoodCatalogQueryPort } from './application/ports/FoodCatalogQueryPort'
export { type MacroTargetsQueryPort } from './application/ports/MacroTargetsQueryPort'
export { type MenuDraftRepositoryPort } from './application/ports/MenuDraftRepositoryPort'
export {
  buildAddFoodToDraftMenuCommand,
  type AddFoodToDraftMenuCommand,
  type AddFoodToDraftMenuCommandInput,
} from './application/commands/addFoodToDraftMenuCommand'
export {
  buildUpdateDraftLineQuantityCommand,
  type UpdateDraftLineQuantityCommand,
  type UpdateDraftLineQuantityCommandInput,
} from './application/commands/updateDraftLineQuantityCommand'
export {
  buildRemoveDraftLineCommand,
  type RemoveDraftLineCommand,
  type RemoveDraftLineCommandInput,
} from './application/commands/removeDraftLineCommand'
export {
  buildMoveDraftLineCommand,
  type MoveDraftLineCommand,
  type MoveDraftLineCommandInput,
} from './application/commands/moveDraftLineCommand'
export {
  buildLockDraftMenuCommand,
  type LockDraftMenuCommand,
  type LockDraftMenuCommandInput,
} from './application/commands/lockDraftMenuCommand'
export {
  buildGetDailyDraftMenuQuery,
  type GetDailyDraftMenuQuery,
} from './application/queries/getDailyDraftMenuQuery'
export {
  buildCalculateDraftComplianceQuery,
  type CalculateDraftComplianceQuery,
} from './application/queries/calculateDraftComplianceQuery'
export {
  buildAuthorizeDraftShareQuery,
  type AuthorizeDraftShareQuery,
} from './application/queries/authorizeDraftShareQuery'
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
import { buildMoveDraftLineCommand } from './application/commands/moveDraftLineCommand'
import { buildRemoveDraftLineCommand } from './application/commands/removeDraftLineCommand'
import { buildUpdateDraftLineQuantityCommand } from './application/commands/updateDraftLineQuantityCommand'
import { buildLockDraftMenuCommand } from './application/commands/lockDraftMenuCommand'
import { buildCalculateDraftComplianceQuery } from './application/queries/calculateDraftComplianceQuery'
import { buildAuthorizeDraftShareQuery } from './application/queries/authorizeDraftShareQuery'
import { buildGetDailyDraftMenuQuery } from './application/queries/getDailyDraftMenuQuery'
import { buildListFoodCatalogQuery } from './application/queries/listFoodCatalogQuery'
import type { FoodCatalogQueryPort } from './application/ports/FoodCatalogQueryPort'
import type { MacroTargetsQueryPort } from './application/ports/MacroTargetsQueryPort'
import type { MenuDraftRepositoryPort } from './application/ports/MenuDraftRepositoryPort'
import { ApiFoodCatalogQueryAdapter } from './infrastructure/api/ApiFoodCatalogQueryAdapter'
import { ApiMenuDraftRepositoryAdapter } from './infrastructure/api/ApiMenuDraftRepositoryAdapter'
import { InMemoryFoodCatalogQueryAdapter } from './infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from './infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'

export type MenuDraftDataSource = 'inmemory' | 'api'

export const buildMenuDraftUseCases = (
  dataSource: MenuDraftDataSource,
  macroTargetsQueryPort: MacroTargetsQueryPort,
) => {
  const foodCatalogQueryPort: FoodCatalogQueryPort =
    dataSource === 'api'
      ? new ApiFoodCatalogQueryAdapter()
      : new InMemoryFoodCatalogQueryAdapter()

  const draftRepositoryPort: MenuDraftRepositoryPort =
    dataSource === 'api'
      ? new ApiMenuDraftRepositoryAdapter()
      : new InMemoryMenuDraftRepositoryAdapter()

  const calculateDraftComplianceQuery = buildCalculateDraftComplianceQuery(
    draftRepositoryPort,
    macroTargetsQueryPort,
  )

  return {
    listFoodCatalogQuery: buildListFoodCatalogQuery(foodCatalogQueryPort),
    getDailyDraftMenuQuery: buildGetDailyDraftMenuQuery(draftRepositoryPort),
    calculateDraftComplianceQuery,
    authorizeDraftShareQuery:
      buildAuthorizeDraftShareQuery(calculateDraftComplianceQuery),
    addFoodToDraftMenuCommand: buildAddFoodToDraftMenuCommand(
      draftRepositoryPort,
      foodCatalogQueryPort,
    ),
    updateDraftLineQuantityCommand:
      buildUpdateDraftLineQuantityCommand(draftRepositoryPort),
    removeDraftLineCommand: buildRemoveDraftLineCommand(draftRepositoryPort),
    moveDraftLineCommand: buildMoveDraftLineCommand(draftRepositoryPort),
    lockDraftMenuCommand: buildLockDraftMenuCommand(
      draftRepositoryPort,
      calculateDraftComplianceQuery,
    ),
  }
}

export type MenuDraftUseCases = ReturnType<typeof buildMenuDraftUseCases>
