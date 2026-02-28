import {
  createDraftIfMissing,
  type DailyMenuDraft,
} from '../../domain/MenuDraft'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'

export type GetDailyDraftMenuQuery = (input: {
  parentId: string
  childId: string
  day: string
}) => Promise<DailyMenuDraft>

export const buildGetDailyDraftMenuQuery = (
  draftRepositoryPort: MenuDraftRepositoryPort,
): GetDailyDraftMenuQuery => {
  return async ({ parentId, childId, day }) => {
    const existingDraft = await draftRepositoryPort.findDraftByParentChildAndDay(
      parentId,
      childId,
      day,
    )

    return createDraftIfMissing(existingDraft, parentId, childId, day)
  }
}
