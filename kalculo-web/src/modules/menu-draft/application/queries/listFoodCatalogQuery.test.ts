import { describe, expect, it } from 'vitest'
import { InMemoryFoodCatalogQueryAdapter } from '../../infrastructure/in-memory/InMemoryFoodCatalogQueryAdapter'
import { buildListFoodCatalogQuery } from './listFoodCatalogQuery'

describe('buildListFoodCatalogQuery', () => {
  it('returns food catalog entries for UI selection', async () => {
    const query = buildListFoodCatalogQuery(new InMemoryFoodCatalogQueryAdapter())

    const foods = await query()

    expect(foods.length).toBeGreaterThan(0)
    expect(foods.some((food) => food.id === 'food-invalid-missing')).toBe(true)
    expect(foods.some((food) => food.id === 'food-invalid-incoherent')).toBe(true)
  })
})
