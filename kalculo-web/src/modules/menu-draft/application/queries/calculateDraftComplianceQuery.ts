import { assessDraftCompliance, calculateDraftNutritionTotals, type DraftComplianceResult } from '../../domain/DraftCompliance'
import { createDraftIfMissing } from '../../domain/MenuDraft'
import type { MacroTargetsQueryPort } from '../ports/MacroTargetsQueryPort'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type CalculateDraftComplianceQuery = (input: {
  parentId: string
  childId: string
  day: string
}) => Promise<DraftComplianceResult>

export const buildCalculateDraftComplianceQuery = (
  draftRepositoryPort: MenuDraftRepositoryPort,
  macroTargetsQueryPort: MacroTargetsQueryPort,
): CalculateDraftComplianceQuery => {
  return async ({ parentId, childId, day }) => {
    const existingDraft = await draftRepositoryPort.findDraftByParentChildAndDay(
      parentId,
      childId,
      day,
    )

    const draft = createDraftIfMissing(existingDraft, parentId, childId, day)
    const activeMacroTargets = await macroTargetsQueryPort.getActiveByChildId(childId)

    const totals = calculateDraftNutritionTotals(draft)

    return assessDraftCompliance(totals, {
      proteinTargetGrams: activeMacroTargets.proteinTargetGrams,
      carbsTargetGrams: activeMacroTargets.carbsTargetGrams,
      fatsTargetGrams: activeMacroTargets.fatsTargetGrams,
    })
  }
}
