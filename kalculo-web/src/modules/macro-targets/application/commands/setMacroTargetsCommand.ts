import {
  createMacroTargets,
  createMacroTargetsHistoryEntry,
  type MacroTargets,
  type MacroTargetsValues,
} from '../../domain/MacroTargets'
import type { MacroTargetsRepositoryPort } from '../ports/MacroTargetsRepositoryPort'

export type SetMacroTargetsCommandInput = {
  childId: string
  parentId: string
} & MacroTargetsValues

export type SetMacroTargetsCommand = (
  input: SetMacroTargetsCommandInput,
) => Promise<MacroTargets>

export const buildSetMacroTargetsCommand = (
  repositoryPort: MacroTargetsRepositoryPort,
): SetMacroTargetsCommand => {
  return async (input) => {
    const previous = await repositoryPort.findActiveByChildId(input.childId)

    const activeTargets = createMacroTargets(input)

    const historyEntry = createMacroTargetsHistoryEntry(
      input.childId,
      input.parentId,
      previous
        ? {
            proteinTargetGrams: previous.proteinTargetGrams,
            carbsTargetGrams: previous.carbsTargetGrams,
            fatsTargetGrams: previous.fatsTargetGrams,
          }
        : null,
      {
        proteinTargetGrams: input.proteinTargetGrams,
        carbsTargetGrams: input.carbsTargetGrams,
        fatsTargetGrams: input.fatsTargetGrams,
      },
    )

    await repositoryPort.saveActive(activeTargets)
    await repositoryPort.appendHistory(historyEntry)

    return activeTargets
  }
}
