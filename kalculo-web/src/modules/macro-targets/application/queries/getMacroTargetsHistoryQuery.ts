import type { MacroTargetsHistoryEntry } from '../../domain/MacroTargets'
import type { MacroTargetsRepositoryPort } from '../ports/MacroTargetsRepositoryPort'

export type GetMacroTargetsHistoryQuery = (
  childId: string,
) => Promise<MacroTargetsHistoryEntry[]>

export const buildGetMacroTargetsHistoryQuery = (
  repositoryPort: MacroTargetsRepositoryPort,
): GetMacroTargetsHistoryQuery => {
  return async (childId) => {
    return repositoryPort.listHistoryByChildId(childId)
  }
}
