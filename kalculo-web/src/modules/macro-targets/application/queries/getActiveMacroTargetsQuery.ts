import type { MacroTargets } from '../../domain/MacroTargets'
import { MacroTargetsNotConfiguredError } from '../../domain/errors/MacroTargetsError'
import type { MacroTargetsRepositoryPort } from '../ports/MacroTargetsRepositoryPort'

export type GetActiveMacroTargetsQuery = (childId: string) => Promise<MacroTargets>

export const buildGetActiveMacroTargetsQuery = (
  repositoryPort: MacroTargetsRepositoryPort,
): GetActiveMacroTargetsQuery => {
  return async (childId) => {
    const targets = await repositoryPort.findActiveByChildId(childId)

    if (!targets) {
      throw new MacroTargetsNotConfiguredError(
        'Aucune cible macro configuree pour cet enfant',
      )
    }

    return targets
  }
}
