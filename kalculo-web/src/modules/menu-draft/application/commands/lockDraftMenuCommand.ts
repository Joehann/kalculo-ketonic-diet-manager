import { lockDraftMenu, createDraftIfMissing, type DailyMenuDraft } from '../../domain/MenuDraft'
import { MenuNotCompliantForLockError } from '../../domain/errors/MenuDraftError'
import type { MenuDraftRepositoryPort } from '../ports/MenuDraftRepositoryPort'
import type { CalculateDraftComplianceQuery } from '../queries/calculateDraftComplianceQuery'

export type LockDraftMenuCommandInput = {
  parentId: string
  childId: string
  day: string
}

export type LockDraftMenuCommand = (
  input: LockDraftMenuCommandInput,
) => Promise<DailyMenuDraft>

export const buildLockDraftMenuCommand = (
  draftRepositoryPort: MenuDraftRepositoryPort,
  calculateDraftComplianceQuery: CalculateDraftComplianceQuery,
): LockDraftMenuCommand => {
  return async (input) => {
    const compliance = await calculateDraftComplianceQuery(input)

    if (compliance.status !== 'compliant') {
      throw new MenuNotCompliantForLockError(
        'Verrouillage refuse: menu non conforme. Corrigez les ecarts puis relancez.',
      )
    }

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

    const lockedDraft = lockDraftMenu(draft)
    await draftRepositoryPort.saveDraft(lockedDraft)

    return lockedDraft
  }
}
