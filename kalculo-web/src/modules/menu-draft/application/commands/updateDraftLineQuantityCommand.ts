import { createDraftIfMissing, updateDraftLineQuantity, type DailyMenuDraft } from '../../domain/MenuDraft'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type UpdateDraftLineQuantityCommandInput = {
  parentId: string
  childId: string
  day: string
  lineId: string
  quantityGrams: number
}

export type UpdateDraftLineQuantityCommand = (
  input: UpdateDraftLineQuantityCommandInput,
) => Promise<DailyMenuDraft>

export const buildUpdateDraftLineQuantityCommand = (
  draftRepositoryPort: MenuDraftRepositoryPort,
): UpdateDraftLineQuantityCommand => {
  return async (input) => {
    const existingDraft = await draftRepositoryPort.findDraftByParentChildAndDay(
      input.parentId,
      input.childId,
      input.day,
    )

    const draft = createDraftIfMissing(
      existingDraft,
      input.parentId,
      input.childId,
      input.day,
    )

    const updatedDraft = updateDraftLineQuantity(
      draft,
      input.lineId,
      input.quantityGrams,
    )

    await draftRepositoryPort.saveDraft(updatedDraft)

    return updatedDraft
  }
}
