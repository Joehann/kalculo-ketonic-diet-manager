import { createDraftIfMissing, removeDraftLine, type DailyMenuDraft } from '../../domain/MenuDraft'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type RemoveDraftLineCommandInput = {
  parentId: string
  childId: string
  day: string
  lineId: string
}

export type RemoveDraftLineCommand = (
  input: RemoveDraftLineCommandInput,
) => Promise<DailyMenuDraft>

export const buildRemoveDraftLineCommand = (
  draftRepositoryPort: MenuDraftRepositoryPort,
): RemoveDraftLineCommand => {
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

    const updatedDraft = removeDraftLine(draft, input.lineId)

    await draftRepositoryPort.saveDraft(updatedDraft)

    return updatedDraft
  }
}
