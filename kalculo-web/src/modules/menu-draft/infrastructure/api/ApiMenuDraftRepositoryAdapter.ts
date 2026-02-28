import type { MenuDraftRepositoryPort } from '../../application/ports/MenuDraftRepositoryPort'
import type { DailyMenuDraft } from '../../domain/MenuDraft'

export class ApiMenuDraftRepositoryAdapter implements MenuDraftRepositoryPort {
  async findDraftByParentChildAndDay(
    _parentId: string,
    _childId: string,
    _day: string,
  ): Promise<DailyMenuDraft | null> {
    void _parentId
    void _childId
    void _day
    throw new Error('Not implemented: API menu draft repository adapter')
  }

  async saveDraft(_draft: DailyMenuDraft): Promise<void> {
    void _draft
    throw new Error('Not implemented: API menu draft repository adapter')
  }
}
