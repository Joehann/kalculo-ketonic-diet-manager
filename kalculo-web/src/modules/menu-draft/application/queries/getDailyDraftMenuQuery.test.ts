import { describe, expect, it } from 'vitest'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
import { buildAddFoodToDraftMenuCommand } from '../commands/addFoodToDraftMenuCommand'
import { buildGetDailyDraftMenuQuery } from './getDailyDraftMenuQuery'

describe('buildGetDailyDraftMenuQuery', () => {
  it('returns existing draft with persisted lines', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)
    const getDraft = buildGetDailyDraftMenuQuery(repo)

    await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-avocado',
      quantityGrams: 80,
    })

    const draft = await getDraft({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
    })

    expect(draft.lines).toHaveLength(1)
    expect(draft.lines[0].foodId).toBe('food-avocado')
  })

  it('creates empty draft when none exists', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const getDraft = buildGetDailyDraftMenuQuery(repo)

    const draft = await getDraft({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
    })

    expect(draft.lines).toEqual([])
    expect(draft.day).toBe('2026-02-28')
  })
})
