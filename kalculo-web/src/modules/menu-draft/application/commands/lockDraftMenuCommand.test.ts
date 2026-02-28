import { describe, expect, it } from 'vitest'
import { DraftLockedError, MenuNotCompliantForLockError } from '../../domain/errors/MenuDraftError'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
import type { MacroTargetsQueryPort } from '../ports/MacroTargetsQueryPort'
import { buildAddFoodToDraftMenuCommand } from './addFoodToDraftMenuCommand'
import { buildLockDraftMenuCommand } from './lockDraftMenuCommand'
import { buildUpdateDraftLineQuantityCommand } from './updateDraftLineQuantityCommand'
import { buildCalculateDraftComplianceQuery } from '../queries/calculateDraftComplianceQuery'

describe('buildLockDraftMenuCommand', () => {
  const compliantTargetsPort: MacroTargetsQueryPort = {
    async getActiveByChildId() {
      return {
        childId: 'child-1',
        updatedAt: new Date(),
        updatedByParentId: 'parent-1',
        proteinTargetGrams: 20,
        carbsTargetGrams: 0,
        fatsTargetGrams: 13,
      }
    },
  }

  it('locks a compliant draft', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)

    await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-salmon',
      quantityGrams: 100,
    })

    const calculateCompliance = buildCalculateDraftComplianceQuery(
      repo,
      compliantTargetsPort,
    )

    const lockDraft = buildLockDraftMenuCommand(repo, calculateCompliance)

    const locked = await lockDraft({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
    })

    expect(locked.status).toBe('locked')
    expect(locked.lockedAt).toBeInstanceOf(Date)
  })

  it('rejects locking non-compliant draft', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const calculateCompliance = buildCalculateDraftComplianceQuery(repo, {
      async getActiveByChildId() {
        return {
          childId: 'child-1',
          updatedAt: new Date(),
          updatedByParentId: 'parent-1',
          proteinTargetGrams: 100,
          carbsTargetGrams: 100,
          fatsTargetGrams: 100,
        }
      },
    })

    const lockDraft = buildLockDraftMenuCommand(repo, calculateCompliance)

    await expect(
      lockDraft({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
      }),
    ).rejects.toBeInstanceOf(MenuNotCompliantForLockError)
  })

  it('blocks edition attempts after lock', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)

    const draft = await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-salmon',
      quantityGrams: 100,
    })

    const calculateCompliance = buildCalculateDraftComplianceQuery(
      repo,
      compliantTargetsPort,
    )
    const lockDraft = buildLockDraftMenuCommand(repo, calculateCompliance)
    const updateLine = buildUpdateDraftLineQuantityCommand(repo)

    await lockDraft({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
    })

    await expect(
      updateLine({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        lineId: draft.lines[0].id,
        quantityGrams: 150,
      }),
    ).rejects.toBeInstanceOf(DraftLockedError)
  })
})
