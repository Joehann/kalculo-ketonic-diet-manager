import type { DailyMenuDraft } from '../../domain/MenuDraft'

export interface MenuDraftRepositoryPort {
  findDraftByParentChildAndDay(
    parentId: string,
    childId: string,
    day: string,
  ): Promise<DailyMenuDraft | null>
  saveDraft(draft: DailyMenuDraft): Promise<void>
}
