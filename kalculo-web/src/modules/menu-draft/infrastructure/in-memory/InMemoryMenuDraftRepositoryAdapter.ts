import type { MenuDraftRepositoryPort } from '../../application/ports/MenuDraftRepositoryPort'
import type { DailyMenuDraft } from '../../domain/MenuDraft'

export class InMemoryMenuDraftRepositoryAdapter implements MenuDraftRepositoryPort {
  private readonly draftsByKey = new Map<string, DailyMenuDraft>()

  async findDraftByParentChildAndDay(
    parentId: string,
    childId: string,
    day: string,
  ): Promise<DailyMenuDraft | null> {
    return this.draftsByKey.get(this.buildKey(parentId, childId, day)) ?? null
  }

  async saveDraft(draft: DailyMenuDraft): Promise<void> {
    this.draftsByKey.set(
      this.buildKey(draft.parentId, draft.childId, draft.day),
      draft,
    )
  }

  private buildKey(parentId: string, childId: string, day: string): string {
    return `${parentId}:${childId}:${day}`
  }
}
