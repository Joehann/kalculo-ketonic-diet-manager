// Domain
export * from './domain/MacroTargets'
export * from './domain/errors/MacroTargetsError'

// Application
export { type MacroTargetsRepositoryPort } from './application/ports/MacroTargetsRepositoryPort'
export {
  buildSetMacroTargetsCommand,
  type SetMacroTargetsCommand,
  type SetMacroTargetsCommandInput,
} from './application/commands/setMacroTargetsCommand'
export {
  buildGetActiveMacroTargetsQuery,
  type GetActiveMacroTargetsQuery,
} from './application/queries/getActiveMacroTargetsQuery'
export {
  buildGetMacroTargetsHistoryQuery,
  type GetMacroTargetsHistoryQuery,
} from './application/queries/getMacroTargetsHistoryQuery'

// Infrastructure
export { InMemoryMacroTargetsRepositoryAdapter } from './infrastructure/in-memory/InMemoryMacroTargetsRepositoryAdapter'
export { ApiMacroTargetsRepositoryAdapter } from './infrastructure/api/ApiMacroTargetsRepositoryAdapter'

// Factory for use cases
import type { MacroTargetsRepositoryPort } from './application/ports/MacroTargetsRepositoryPort'
import { buildSetMacroTargetsCommand } from './application/commands/setMacroTargetsCommand'
import { buildGetActiveMacroTargetsQuery } from './application/queries/getActiveMacroTargetsQuery'
import { buildGetMacroTargetsHistoryQuery } from './application/queries/getMacroTargetsHistoryQuery'
import { ApiMacroTargetsRepositoryAdapter } from './infrastructure/api/ApiMacroTargetsRepositoryAdapter'
import { InMemoryMacroTargetsRepositoryAdapter } from './infrastructure/in-memory/InMemoryMacroTargetsRepositoryAdapter'

export type MacroTargetsDataSource = 'inmemory' | 'api'

export const buildMacroTargetsUseCases = (dataSource: MacroTargetsDataSource) => {
  const repositoryPort: MacroTargetsRepositoryPort =
    dataSource === 'api'
      ? new ApiMacroTargetsRepositoryAdapter()
      : new InMemoryMacroTargetsRepositoryAdapter()

  return {
    setMacroTargetsCommand: buildSetMacroTargetsCommand(repositoryPort),
    getActiveMacroTargetsQuery: buildGetActiveMacroTargetsQuery(repositoryPort),
    getMacroTargetsHistoryQuery: buildGetMacroTargetsHistoryQuery(repositoryPort),
  }
}

export type MacroTargetsUseCases = ReturnType<typeof buildMacroTargetsUseCases>
