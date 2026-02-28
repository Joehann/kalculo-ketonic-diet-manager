import { describe, expect, it } from 'vitest'
import type { MacroTargetsQueryPort } from '../ports/MacroTargetsQueryPort'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
import { buildAddFoodToDraftMenuCommand } from '../commands/addFoodToDraftMenuCommand'
import { buildCalculateDraftComplianceQuery } from './calculateDraftComplianceQuery'

describe('buildCalculateDraftComplianceQuery', () => {
  it('returns totals and compliance status against active targets', async () => {
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

    const macroTargetsPort: MacroTargetsQueryPort = {
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

    const calculateCompliance = buildCalculateDraftComplianceQuery(
      repo,
      macroTargetsPort,
    )

    const result = await calculateCompliance({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
    })

    expect(result.status).toBe('compliant')
    expect(result.totals).toEqual({
      caloriesKcal: 208,
      proteinGrams: 20,
      carbsGrams: 0,
      fatsGrams: 13,
    })
  })
})
