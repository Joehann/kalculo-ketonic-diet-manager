import { describe, expect, it } from 'vitest'
import type { FoodCatalogQueryPort } from '../ports/FoodCatalogQueryPort'
import {
  FoodItemNotFoundError,
  IncoherentFoodNutritionDataError,
  IncompleteFoodNutritionDataError,
  InvalidQuantityError,
} from '../../domain/errors/MenuDraftError'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { InMemoryMenuDraftRepositoryAdapter } from '../../infrastructure/in-memory/InMemoryMenuDraftRepositoryAdapter'
import { buildAddFoodToDraftMenuCommand } from './addFoodToDraftMenuCommand'

describe('buildAddFoodToDraftMenuCommand', () => {
  it('adds a line with quantity and nutrition snapshots to the draft menu', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const command = buildAddFoodToDraftMenuCommand(repo, foods)

    const draft = await command({
      parentId: 'parent-1',
      childId: 'child-1',
      day: '2026-02-28',
      foodId: 'food-egg',
      quantityGrams: 120,
    })

    expect(draft.lines).toHaveLength(1)
    expect(draft.lines[0]).toMatchObject({
      foodId: 'food-egg',
      foodName: 'Oeuf',
      quantityGrams: 120,
      nutritionPer100gSnapshot: {
        caloriesKcal: 155,
        proteinGrams: 13,
        carbsGrams: 1.1,
        fatsGrams: 11,
      },
    })
    expect(draft.lines[0].nutritionTotals.caloriesKcal).toBeCloseTo(186)
  })

  it('rejects unknown food id', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const command = buildAddFoodToDraftMenuCommand(repo, foods)

    await expect(
      command({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        foodId: 'missing-food',
        quantityGrams: 120,
      }),
    ).rejects.toBeInstanceOf(FoodItemNotFoundError)
  })

  it('rejects invalid quantity', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const foods = new InMemoryFoodCatalogQueryAdapter()
    const command = buildAddFoodToDraftMenuCommand(repo, foods)

    await expect(
      command({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        foodId: 'food-egg',
        quantityGrams: 0,
      }),
    ).rejects.toBeInstanceOf(InvalidQuantityError)
  })

  it('blocks planning when nutrition data is incomplete', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const incompleteFoodCatalogPort: FoodCatalogQueryPort = {
      async listFoods() {
        return []
      },
      async findFoodById() {
        return {
          id: 'food-invalid',
          name: 'Produit incomplet',
          nutritionPer100g: {
            caloriesKcal: Number.NaN,
            proteinGrams: 10,
            carbsGrams: 5,
            fatsGrams: 3,
          },
        }
      },
    }
    const command = buildAddFoodToDraftMenuCommand(repo, incompleteFoodCatalogPort)

    await expect(
      command({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        foodId: 'food-invalid',
        quantityGrams: 100,
      }),
    ).rejects.toBeInstanceOf(IncompleteFoodNutritionDataError)
  })

  it('blocks planning when nutrition data is incoherent', async () => {
    const repo = new InMemoryMenuDraftRepositoryAdapter()
    const incoherentFoodCatalogPort: FoodCatalogQueryPort = {
      async listFoods() {
        return []
      },
      async findFoodById() {
        return {
          id: 'food-incoherent',
          name: 'Produit incoherent',
          nutritionPer100g: {
            caloriesKcal: 5,
            proteinGrams: 20,
            carbsGrams: 20,
            fatsGrams: 10,
          },
        }
      },
    }
    const command = buildAddFoodToDraftMenuCommand(repo, incoherentFoodCatalogPort)

    await expect(
      command({
        parentId: 'parent-1',
        childId: 'child-1',
        day: '2026-02-28',
        foodId: 'food-incoherent',
        quantityGrams: 100,
      }),
    ).rejects.toBeInstanceOf(IncoherentFoodNutritionDataError)
  })
})
