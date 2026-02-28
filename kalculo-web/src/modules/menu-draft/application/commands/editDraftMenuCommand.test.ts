import { describe, expect, it } from 'vitest'
import { DraftLineNotFoundError } from '../../domain/errors/MenuDraftError'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
import { buildAddFoodToDraftMenuCommand } from './addFoodToDraftMenuCommand'
import { buildMoveDraftLineCommand } from './moveDraftLineCommand'
import { buildRemoveDraftLineCommand } from './removeDraftLineCommand'
import { buildUpdateDraftLineQuantityCommand } from './updateDraftLineQuantityCommand'

describe('draft menu editing commands', () => {
  it('updates a line quantity and nutrition totals', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)
    const updateLine = buildUpdateDraftLineQuantityCommand(repo)

    const created = await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-egg',
      quantityGrams: 100,
    })

    const updated = await updateLine({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      lineId: created.lines[0].id,
      quantityGrams: 200,
    })

    expect(updated.lines[0].quantityGrams).toBe(200)
    expect(updated.lines[0].nutritionTotals.caloriesKcal).toBeCloseTo(310)
  })

  it('removes a line from draft', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)
    const removeLine = buildRemoveDraftLineCommand(repo)

    const created = await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-egg',
      quantityGrams: 100,
    })

    const afterRemoval = await removeLine({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      lineId: created.lines[0].id,
    })

    expect(afterRemoval.lines).toHaveLength(0)
  })

  it('reorders lines in draft', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const addFood = buildAddFoodToDraftMenuCommand(repo, foods)
    const moveLine = buildMoveDraftLineCommand(repo)

    const withFirst = await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-egg',
      quantityGrams: 100,
    })

    const withSecond = await addFood({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-avocado',
      quantityGrams: 100,
    })

    const moved = await moveLine({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      lineId: withSecond.lines[1].id,
      direction: 'up',
    })

    expect(withFirst.lines[0].foodId).toBe('food-egg')
    expect(moved.lines[0].foodId).toBe('food-avocado')
    expect(moved.lines[1].foodId).toBe('food-egg')
  })

  it('throws when editing unknown line', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const removeLine = buildRemoveDraftLineCommand(repo)

    await expect(
      removeLine({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        lineId: 'missing-line',
      }),
    ).rejects.toBeInstanceOf(DraftLineNotFoundError)
  })
})
