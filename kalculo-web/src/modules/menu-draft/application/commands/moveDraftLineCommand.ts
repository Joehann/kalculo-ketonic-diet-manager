import { createDraftIfMissing, moveDraftLine, type DailyMenuDraft } from '../../domain/MenuDraft'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type MoveDraftLineCommandInput = {
  parentId: string
  childId: string
  day: string
  lineId: string
  direction: 'up' | 'down'
}

export type MoveDraftLineCommand = (
  input: MoveDraftLineCommandInput,
) => Promise<DailyMenuDraft>

export const buildMoveDraftLineCommand = (
  draftRepositoryPort: MenuDraftRepositoryPort,
): MoveDraftLineCommand => {
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

    const updatedDraft = moveDraftLine(draft, input.lineId, input.direction)

    await draftRepositoryPort.saveDraft(updatedDraft)

    return updatedDraft
  }
}
